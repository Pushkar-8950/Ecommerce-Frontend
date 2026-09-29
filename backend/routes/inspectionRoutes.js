import express from 'express';
import Inspection from '../models/Inspection.js';
import VerificationApplication from '../models/VerificationApplication.js';
import Instrument from '../models/Instrument.js';
import Certificate from '../models/Certificate.js';
import Notification from '../models/Notification.js';
import { protect, authorizeRoles } from '../middleware/auth.js';
import { logAudit } from '../services/auditService.js';
import { generateCertificateQR } from '../services/qrService.js';

const router = express.Router();

const generateInspectionId = async () => {
  const count = await Inspection.countDocuments();
  const year = new Date().getFullYear();
  const sequence = String(count + 1).padStart(6, '0');
  return `INSP-${year}-${sequence}`;
};

const generateCertificateNumber = async () => {
  const count = await Certificate.countDocuments();
  const year = new Date().getFullYear();
  const sequence = String(count + 1).padStart(6, '0');
  return `CERT-${year}-${sequence}`;
};

// @route   POST /api/inspections/start
// @desc    Officer starts inspection for an application
// @access  Private (LMO_OFFICER, GATC, ADMIN)
router.post(
  '/start',
  protect,
  authorizeRoles('LMO_OFFICER', 'GATC', 'ADMIN'),
  async (req, res, next) => {
    try {
      const { applicationId } = req.body;

      if (!applicationId) {
        return res.status(400).json({
          success: false,
          message: 'Application ID is required.',
        });
      }

      const application = await VerificationApplication.findById(applicationId).populate('instrument');
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found.' });
      }

      // Check if an inspection already exists
      let inspection = await Inspection.findOne({ application: application._id });

      if (!inspection) {
        const inspectionId = await generateInspectionId();
        inspection = await Inspection.create({
          inspectionId,
          application: application._id,
          instrument: application.instrument._id,
          officer: req.user._id,
          officerType: req.user.role === 'GATC' ? 'GATC' : 'LMO_OFFICER',
          finalResult: 'IN_PROGRESS',
        });

        application.inspection = inspection._id;
        application.status = 'INSPECTION';
        application.timeline.push({
          status: 'INSPECTION',
          title: 'Digital Inspection Commenced',
          comments: `Officer ${req.user.fullName} initiated on-site/bench inspection.`,
          updatedBy: req.user._id,
          updatedByName: req.user.fullName,
          timestamp: new Date(),
        });
        await application.save();

        await Instrument.findByIdAndUpdate(application.instrument._id, {
          status: 'UNDER_INSPECTION',
        });

        await logAudit({
          action: 'INSPECTION_STARTED',
          user: req.user._id,
          userName: req.user.fullName,
          userRole: req.user.role,
          entity: 'Inspection',
          entityId: inspection._id,
          details: {
            inspectionId: inspection.inspectionId,
            applicationId: application.applicationId,
          },
          ipAddress: req.ip,
        });
      }

      res.status(200).json({
        success: true,
        message: 'Inspection active.',
        data: inspection,
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   GET /api/inspections/:id
// @desc    Get inspection details
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const query = isMongoId ? { _id: req.params.id } : { inspectionId: req.params.id };

    const inspection = await Inspection.findOne(query)
      .populate('application')
      .populate('instrument')
      .populate('officer', 'fullName email designation department phone');

    if (!inspection) {
      return res.status(404).json({ success: false, message: 'Inspection not found' });
    }

    res.json({ success: true, data: inspection });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/inspections/:id/complete
// @desc    Submit inspection findings and pass/fail decision
// @access  Private (LMO_OFFICER, GATC, ADMIN)
router.post(
  '/:id/complete',
  protect,
  authorizeRoles('LMO_OFFICER', 'GATC', 'ADMIN'),
  async (req, res, next) => {
    try {
      const {
        checks,
        remarks = '',
        officerNotes = '',
        photos = [],
        documents = [],
        finalDecision, // 'PASS' or 'FAIL'
      } = req.body;

      const inspection = await Inspection.findById(req.params.id)
        .populate('application')
        .populate('instrument');

      if (!inspection) {
        return res.status(404).json({ success: false, message: 'Inspection not found' });
      }

      // Check checklist completeness
      const mandatoryKeys = [
        'instrumentCondition',
        'display',
        'zeroError',
        'accuracy',
        'calibration',
        'sealingStamping',
        'physicalCondition',
      ];

      const mergedChecks = { ...inspection.checks.toObject(), ...checks };

      let passedCount = 0;
      let hasPending = false;

      for (const key of mandatoryKeys) {
        if (!mergedChecks[key] || mergedChecks[key] === 'PENDING') {
          hasPending = true;
        } else if (mergedChecks[key] === 'PASS') {
          passedCount++;
        }
      }

      if (hasPending) {
        return res.status(400).json({
          success: false,
          message:
            'All 7 mandatory legal metrology checks must be evaluated before completing inspection.',
        });
      }

      const isVerified = finalDecision === 'PASS' && passedCount === 7;
      const finalResult = isVerified ? 'VERIFIED' : 'REJECTED';

      inspection.checks = mergedChecks;
      inspection.passedChecks = passedCount;
      inspection.remarks = remarks;
      inspection.officerNotes = officerNotes;
      if (photos.length) inspection.photos = photos;
      if (documents.length) inspection.documents = documents;
      inspection.finalResult = finalResult;
      inspection.completedAt = new Date();
      await inspection.save();

      const application = await VerificationApplication.findById(inspection.application._id)
        .populate('instrument')
        .populate('owner');

      const instrument = await Instrument.findById(inspection.instrument._id);

      if (isVerified) {
        // Successful verification: Generate Digital Verification Certificate
        const certNumber = await generateCertificateNumber();
        const verificationDate = new Date();
        const validUntil = new Date();
        validUntil.setFullYear(validUntil.getFullYear() + 1); // 1-year periodic verification cycle

        const { qrDataUrl, verifyUrl } = await generateCertificateQR(certNumber);

        const stampCode = `LM-STAMP-${new Date().getFullYear()}-${Math.floor(
          100000 + Math.random() * 900000
        )}`;

        const certificate = await Certificate.create({
          certificateNumber: certNumber,
          instrument: instrument._id,
          instrumentId: instrument.instrumentId,
          application: application._id,
          applicationId: application.applicationId,
          inspection: inspection._id,
          owner: application.owner._id,
          businessName: application.owner.organizationName || application.owner.fullName,
          ownerName: application.owner.fullName,
          instrumentType: instrument.instrumentType,
          category: instrument.category,
          manufacturer: instrument.manufacturer,
          model: instrument.model,
          serialNumber: instrument.serialNumber,
          capacity: instrument.capacity,
          accuracyClass: instrument.accuracyClass,
          verificationDate,
          validUntil,
          verifiedBy: req.user._id,
          verifiedByName: req.user.fullName,
          verifiedByDesignation: req.user.designation || 'Legal Metrology Officer',
          issuingAuthority: `${req.user.department || 'Legal Metrology Department'}, ${instrument.district}, ${instrument.state}`,
          state: instrument.state,
          district: instrument.district,
          status: 'VALID',
          qrCodeDataUrl: qrDataUrl,
          verificationUrl: verifyUrl,
          digitalStampCode: stampCode,
        });

        // Update instrument
        instrument.status = 'VERIFIED';
        instrument.lastVerificationDate = verificationDate;
        instrument.nextVerificationDueDate = validUntil;
        instrument.activeCertificate = certificate._id;
        await instrument.save();

        // Update application
        application.status = 'CERTIFICATE_ISSUED';
        application.certificate = certificate._id;
        application.timeline.push({
          status: 'CERTIFICATE_ISSUED',
          title: 'Certificate Issued & Stamped',
          comments: `All 7/7 checks passed. Certificate ${certNumber} issued valid until ${validUntil.toLocaleDateString()}.`,
          updatedBy: req.user._id,
          updatedByName: req.user.fullName,
          timestamp: new Date(),
        });
        await application.save();

        await logAudit({
          action: 'CERTIFICATE_ISSUED',
          user: req.user._id,
          userName: req.user.fullName,
          userRole: req.user.role,
          entity: 'Certificate',
          entityId: certificate._id,
          details: {
            certificateNumber: certNumber,
            instrumentId: instrument.instrumentId,
            owner: application.owner.fullName,
          },
          ipAddress: req.ip,
        });

        // Notify Business User
        await Notification.create({
          user: application.owner._id,
          title: 'Verification Certificate Issued!',
          message: `Congratulations! Your instrument ${instrument.instrumentId} passed inspection. Digital Certificate ${certNumber} is now available.`,
          type: 'CERTIFICATE_ISSUED',
          relatedEntity: {
            entityType: 'Certificate',
            entityId: certNumber,
          },
        });

        return res.json({
          success: true,
          message: 'Inspection completed successfully. Digital Certificate generated.',
          data: {
            inspection,
            certificate,
          },
        });
      } else {
        // Failed inspection
        instrument.status = 'REJECTED';
        await instrument.save();

        application.status = 'REJECTED';
        application.rejectionReason = remarks || officerNotes || 'Failed verification checks';
        application.timeline.push({
          status: 'REJECTED',
          title: 'Verification Rejected',
          comments: `Inspection failed (${passedCount}/7 checks passed). Remarks: ${application.rejectionReason}`,
          updatedBy: req.user._id,
          updatedByName: req.user.fullName,
          timestamp: new Date(),
        });
        await application.save();

        await logAudit({
          action: 'INSPECTION_COMPLETED',
          user: req.user._id,
          userName: req.user.fullName,
          userRole: req.user.role,
          entity: 'Inspection',
          entityId: inspection._id,
          details: {
            result: 'REJECTED',
            passedCount,
            remarks,
          },
          ipAddress: req.ip,
        });

        // Notify Business User
        await Notification.create({
          user: application.owner._id,
          title: 'Verification Notice: Action Required',
          message: `Instrument ${instrument.instrumentId} did not pass inspection (${passedCount}/7 checks). Reason: ${remarks}`,
          type: 'INSPECTION_RESULT',
          relatedEntity: {
            entityType: 'Application',
            entityId: application.applicationId,
          },
        });

        return res.json({
          success: true,
          message: 'Inspection marked as REJECTED.',
          data: {
            inspection,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
