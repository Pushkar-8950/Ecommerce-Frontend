import express from 'express';
import VerificationApplication from '../models/VerificationApplication.js';
import Instrument from '../models/Instrument.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { protect, authorizeRoles } from '../middleware/auth.js';
import { logAudit } from '../services/auditService.js';

const router = express.Router();

const generateApplicationId = async () => {
  const count = await VerificationApplication.countDocuments();
  const year = new Date().getFullYear();
  const sequence = String(count + 1).padStart(6, '0');
  return `APP-${year}-${sequence}`;
};

// @route   POST /api/applications
// @desc    Submit a verification or re-verification application
// @access  Private (BUSINESS_USER, ADMIN)
router.post('/', protect, async (req, res, next) => {
  try {
    let {
      instrumentId, // Mongo ID of instrument
      applicationType = 'NEW_VERIFICATION',
      preferredDate,
      preferredLocation = 'On-site Premise',
      notes,
      supportingDocuments = [],
      instrumentPhotos = [],
    } = req.body;

    if (applicationType) {
      const normalized = applicationType.toUpperCase().trim();
      if (normalized === 'PERIODIC_REVERIFICATION' || normalized === 'REVERIFICATION') {
        applicationType = 'RE_VERIFICATION';
      } else {
        applicationType = normalized;
      }
    }

    if (!instrumentId || !preferredDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide instrument and preferred verification date.',
      });
    }

    const instrument = await Instrument.findById(instrumentId);
    if (!instrument) {
      return res.status(404).json({ success: false, message: 'Instrument not found.' });
    }

    if (
      req.user.role === 'BUSINESS_USER' &&
      instrument.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You can only apply for instruments you own.',
      });
    }

    const applicationId = await generateApplicationId();

    const application = await VerificationApplication.create({
      applicationId,
      instrument: instrument._id,
      owner: instrument.owner,
      applicationType,
      preferredDate: new Date(preferredDate),
      preferredLocation,
      notes,
      supportingDocuments,
      instrumentPhotos,
      status: 'SUBMITTED',
      timeline: [
        {
          status: 'SUBMITTED',
          title: 'Application Submitted',
          comments: `Application submitted for ${applicationType === 'RE_VERIFICATION' ? 'Re-verification' : 'New Verification'}.`,
          updatedBy: req.user._id,
          updatedByName: req.user.fullName,
          timestamp: new Date(),
        },
      ],
    });

    // Update instrument status to PENDING_VERIFICATION
    instrument.status = 'PENDING_VERIFICATION';
    await instrument.save();

    await logAudit({
      action: 'APPLICATION_SUBMITTED',
      user: req.user._id,
      userName: req.user.fullName,
      userRole: req.user.role,
      entity: 'VerificationApplication',
      entityId: application._id,
      details: {
        applicationId: application.applicationId,
        instrumentId: instrument.instrumentId,
        type: applicationType,
      },
      ipAddress: req.ip,
    });

    // Notify Business User
    await Notification.create({
      user: instrument.owner,
      title: 'Application Submitted Successfully',
      message: `Your application ${application.applicationId} for instrument ${instrument.instrumentId} has been received.`,
      type: 'APPLICATION_UPDATE',
      relatedEntity: {
        entityType: 'Application',
        entityId: application.applicationId,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      data: application,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/applications
// @desc    Get all applications (role-filtered)
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const { status, type, search } = req.query;
    const query = {};

    if (req.user.role === 'BUSINESS_USER') {
      query.owner = req.user._id;
    } else if (req.user.role === 'LMO_OFFICER' || req.user.role === 'GATC') {
      // Officer can see cases assigned to them OR unassigned submitted cases in their jurisdiction
      query.$or = [{ assignedOfficer: req.user._id }, { status: 'SUBMITTED' }];
    }

    if (status) {
      query.status = status;
    }

    if (type) {
      query.applicationType = type;
    }

    let applications = await VerificationApplication.find(query)
      .populate('instrument')
      .populate('owner', 'fullName email organizationName phone address district state')
      .populate('assignedOfficer', 'fullName email designation phone department')
      .populate('inspection')
      .populate('certificate')
      .sort({ createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      applications = applications.filter((app) => {
        return (
          app.applicationId.toLowerCase().includes(s) ||
          app.instrument?.instrumentId?.toLowerCase().includes(s) ||
          app.instrument?.serialNumber?.toLowerCase().includes(s) ||
          app.owner?.organizationName?.toLowerCase().includes(s) ||
          app.owner?.fullName?.toLowerCase().includes(s)
        );
      });
    }

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/applications/:id
// @desc    Get application details by ID or applicationId
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const query = isMongoId
      ? { _id: req.params.id }
      : { applicationId: req.params.id };

    const application = await VerificationApplication.findOne(query)
      .populate('instrument')
      .populate('owner', 'fullName email organizationName phone address district state')
      .populate('assignedOfficer', 'fullName email designation phone department')
      .populate('inspection')
      .populate('certificate');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Business user check
    if (
      req.user.role === 'BUSINESS_USER' &&
      application.owner._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/applications/:id/assign
// @desc    Admin assigns officer or GATC, schedules date/time
// @access  Private (ADMIN)
router.post(
  '/:id/assign',
  protect,
  authorizeRoles('ADMIN'),
  async (req, res, next) => {
    try {
      const { assignedOfficerId, assignedToType = 'LMO', scheduledDate, scheduledSlot, comments } = req.body;

      if (!assignedOfficerId || !scheduledDate) {
        return res.status(400).json({
          success: false,
          message: 'Officer and scheduled inspection date are required.',
        });
      }

      const application = await VerificationApplication.findById(req.params.id)
        .populate('instrument')
        .populate('owner');

      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      const officer = await User.findById(assignedOfficerId);
      if (!officer) {
        return res.status(404).json({ success: false, message: 'Officer not found' });
      }

      application.assignedOfficer = officer._id;
      application.assignedToType = assignedToType;
      application.scheduledDate = new Date(scheduledDate);
      if (scheduledSlot) application.scheduledSlot = scheduledSlot;
      application.status = 'SCHEDULED';

      application.timeline.push({
        status: 'SCHEDULED',
        title: 'Inspection Scheduled & Assigned',
        comments: comments || `Assigned to ${officer.fullName} (${officer.designation || assignedToType}). Scheduled for ${new Date(scheduledDate).toLocaleDateString()}.`,
        updatedBy: req.user._id,
        updatedByName: req.user.fullName,
        timestamp: new Date(),
      });

      await application.save();

      // Update instrument status to SCHEDULED
      if (application.instrument) {
        await Instrument.findByIdAndUpdate(application.instrument._id, {
          status: 'SCHEDULED',
        });
      }

      await logAudit({
        action: 'APPLICATION_ASSIGNED',
        user: req.user._id,
        userName: req.user.fullName,
        userRole: req.user.role,
        entity: 'VerificationApplication',
        entityId: application._id,
        details: {
          applicationId: application.applicationId,
          officerName: officer.fullName,
          scheduledDate: application.scheduledDate,
        },
        ipAddress: req.ip,
      });

      // Notify Officer
      await Notification.create({
        user: officer._id,
        title: 'New Inspection Case Assigned',
        message: `Case ${application.applicationId} scheduled for inspection on ${new Date(scheduledDate).toLocaleDateString()}.`,
        type: 'ASSIGNMENT',
        relatedEntity: {
          entityType: 'Application',
          entityId: application.applicationId,
        },
      });

      // Notify Business User
      await Notification.create({
        user: application.owner._id,
        title: 'Verification Inspection Scheduled',
        message: `Your verification application ${application.applicationId} has been scheduled for ${new Date(scheduledDate).toLocaleDateString()} with Officer ${officer.fullName}.`,
        type: 'APPLICATION_UPDATE',
        relatedEntity: {
          entityType: 'Application',
          entityId: application.applicationId,
        },
      });

      res.json({
        success: true,
        message: 'Officer assigned and verification scheduled successfully.',
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   POST /api/applications/:id/schedule
// @desc    Update application schedule
// @access  Private (ADMIN, LMO_OFFICER, GATC)
router.post(
  '/:id/schedule',
  protect,
  authorizeRoles('ADMIN', 'LMO_OFFICER', 'GATC'),
  async (req, res, next) => {
    try {
      const { scheduledDate, scheduledSlot, comments } = req.body;
      const application = await VerificationApplication.findById(req.params.id);

      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      if (scheduledDate) application.scheduledDate = new Date(scheduledDate);
      if (scheduledSlot) application.scheduledSlot = scheduledSlot;
      application.status = 'SCHEDULED';

      application.timeline.push({
        status: 'SCHEDULED',
        title: 'Schedule Updated',
        comments: comments || `Inspection rescheduled to ${new Date(scheduledDate).toLocaleDateString()}.`,
        updatedBy: req.user._id,
        updatedByName: req.user.fullName,
        timestamp: new Date(),
      });

      await application.save();

      res.json({
        success: true,
        message: 'Inspection schedule updated.',
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
