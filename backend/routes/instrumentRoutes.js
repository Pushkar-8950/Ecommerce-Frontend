import express from 'express';
import Instrument from '../models/Instrument.js';
import VerificationApplication from '../models/VerificationApplication.js';
import Certificate from '../models/Certificate.js';
import { protect } from '../middleware/auth.js';
import { logAudit } from '../services/auditService.js';
import { calculateExpiryStatus } from '../services/expiryService.js';

const router = express.Router();

const generateInstrumentId = async () => {
  const count = await Instrument.countDocuments();
  const year = new Date().getFullYear();
  const sequence = String(count + 1).padStart(6, '0');
  return `INS-${year}-${sequence}`;
};

// @route   POST /api/instruments
// @desc    Register a new weighing/measuring instrument
// @access  Private (BUSINESS_USER, ADMIN)
router.post('/', protect, async (req, res, next) => {
  try {
    const {
      instrumentType,
      category,
      manufacturer,
      model,
      serialNumber,
      capacity,
      accuracyClass,
      locationAddress,
      state,
      district,
      purchaseDate,
      photos,
      documents,
    } = req.body;

    if (!instrumentType || !manufacturer || !model || !serialNumber || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide instrument type, manufacturer, model, serial number, and capacity.',
      });
    }

    const instrumentId = await generateInstrumentId();

    const instrument = await Instrument.create({
      instrumentId,
      instrumentType,
      category: category || 'Commercial',
      manufacturer,
      model,
      serialNumber,
      capacity,
      accuracyClass: accuracyClass || 'Class III (Medium)',
      locationAddress: locationAddress || req.user.address || 'Commercial Facility',
      state: state || req.user.state || 'Delhi',
      district: district || req.user.district || 'Central Delhi',
      owner: req.user._id,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
      status: 'REGISTERED',
      photos: photos || [],
      documents: documents || [],
    });

    await logAudit({
      action: 'INSTRUMENT_CREATED',
      user: req.user._id,
      userName: req.user.fullName,
      userRole: req.user.role,
      entity: 'Instrument',
      entityId: instrument._id,
      details: {
        instrumentId: instrument.instrumentId,
        serialNumber: instrument.serialNumber,
        type: instrument.instrumentType,
      },
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Instrument successfully registered in Legal Metrology Registry.',
      data: instrument,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/instruments
// @desc    Get instruments with filters & search
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const {
      search,
      status,
      category,
      instrumentType,
      state,
      district,
      expiryFilter,
    } = req.query;

    const query = {};

    // If business user, only see own instruments
    if (req.user.role === 'BUSINESS_USER') {
      query.owner = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (instrumentType) {
      query.instrumentType = instrumentType;
    }

    if (state) {
      query.state = state;
    }

    if (district) {
      query.district = district;
    }

    if (search) {
      query.$or = [
        { instrumentId: { $regex: search, $options: 'i' } },
        { serialNumber: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { instrumentType: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
      ];
    }

    const instruments = await Instrument.find(query)
      .populate('owner', 'fullName email organizationName phone')
      .populate('activeCertificate')
      .sort({ createdAt: -1 });

    // Enrich instruments with live expiry calculation
    const enriched = instruments.map((inst) => {
      const obj = inst.toObject();
      if (inst.nextVerificationDueDate) {
        const expiry = calculateExpiryStatus(inst.nextVerificationDueDate);
        obj.expiryCalculated = expiry;
      }
      return obj;
    });

    let finalData = enriched;
    if (expiryFilter === 'EXPIRING_SOON') {
      finalData = enriched.filter((i) => i.expiryCalculated?.status === 'EXPIRING_SOON');
    } else if (expiryFilter === 'EXPIRED') {
      finalData = enriched.filter((i) => i.expiryCalculated?.status === 'EXPIRED');
    }

    res.json({
      success: true,
      count: finalData.length,
      data: finalData,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/instruments/:id
// @desc    Get instrument details with history and certificates
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const instrument = await Instrument.findById(req.params.id)
      .populate('owner', 'fullName email organizationName phone address state district')
      .populate('activeCertificate');

    if (!instrument) {
      return res.status(404).json({ success: false, message: 'Instrument not found' });
    }

    // Role check: business user can only view their own instrument
    if (
      req.user.role === 'BUSINESS_USER' &&
      instrument.owner._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Fetch related applications and certificates
    const applications = await VerificationApplication.find({ instrument: instrument._id })
      .populate('assignedOfficer', 'fullName email designation phone')
      .sort({ createdAt: -1 });

    const certificates = await Certificate.find({ instrument: instrument._id })
      .populate('verifiedBy', 'fullName designation')
      .sort({ verificationDate: -1 });

    const obj = instrument.toObject();
    if (instrument.nextVerificationDueDate) {
      obj.expiryCalculated = calculateExpiryStatus(instrument.nextVerificationDueDate);
    }

    res.json({
      success: true,
      data: {
        instrument: obj,
        applications,
        certificates,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   PATCH /api/instruments/:id
// @desc    Update instrument details
// @access  Private
router.patch('/:id', protect, async (req, res, next) => {
  try {
    const instrument = await Instrument.findById(req.params.id);
    if (!instrument) {
      return res.status(404).json({ success: false, message: 'Instrument not found' });
    }

    if (
      req.user.role === 'BUSINESS_USER' &&
      instrument.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const updates = req.body;
    // Don't allow changing instrumentId directly
    delete updates.instrumentId;

    const updatedInstrument = await Instrument.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Instrument updated successfully.',
      data: updatedInstrument,
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/instruments/:id
// @desc    Delete instrument
// @access  Private (ADMIN or Owner if in REGISTERED status)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const instrument = await Instrument.findById(req.params.id);
    if (!instrument) {
      return res.status(404).json({ success: false, message: 'Instrument not found' });
    }

    if (req.user.role !== 'ADMIN') {
      if (instrument.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      if (instrument.status !== 'REGISTERED') {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete an instrument with active verification history.',
        });
      }
    }

    await Instrument.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Instrument deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
