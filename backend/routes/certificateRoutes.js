import express from 'express';
import Certificate from '../models/Certificate.js';
import Instrument from '../models/Instrument.js';
import { protect, authorizeRoles } from '../middleware/auth.js';
import { logAudit } from '../services/auditService.js';
import { buildCertificatePDF } from '../services/pdfService.js';
import { calculateExpiryStatus } from '../services/expiryService.js';

const router = express.Router();

// @route   GET /api/certificates
// @desc    Get all certificates with filters
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const { status, search, instrumentType, district } = req.query;
    const query = {};

    if (req.user.role === 'BUSINESS_USER') {
      query.owner = req.user._id;
    } else if (req.user.role === 'LMO_OFFICER' || req.user.role === 'GATC') {
      // Officers see certificates issued by them or all
    }

    if (status) {
      query.status = status;
    }

    if (instrumentType) {
      query.instrumentType = instrumentType;
    }

    if (district) {
      query.district = district;
    }

    let certificates = await Certificate.find(query)
      .populate('instrument')
      .populate('owner', 'fullName email organizationName phone')
      .populate('verifiedBy', 'fullName designation department')
      .sort({ verificationDate: -1 });

    // Update real-time status according to expiry rules (>30d valid, <=30d expiring soon, past due expired)
    const enriched = certificates.map((cert) => {
      const obj = cert.toObject();
      if (obj.status !== 'REVOKED') {
        const exp = calculateExpiryStatus(obj.validUntil);
        obj.computedStatus = exp.status;
        obj.daysRemaining = exp.daysRemaining;
      } else {
        obj.computedStatus = 'REVOKED';
        obj.daysRemaining = 0;
      }
      return obj;
    });

    if (search) {
      const s = search.toLowerCase();
      certificates = enriched.filter((c) => {
        return (
          c.certificateNumber.toLowerCase().includes(s) ||
          c.instrumentId.toLowerCase().includes(s) ||
          c.serialNumber.toLowerCase().includes(s) ||
          c.businessName.toLowerCase().includes(s) ||
          c.ownerName.toLowerCase().includes(s)
        );
      });
    } else {
      certificates = enriched;
    }

    res.json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/certificates/:id
// @desc    Get single certificate by ID or Certificate Number
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const query = isMongoId
      ? { _id: req.params.id }
      : { certificateNumber: req.params.id };

    const certificate = await Certificate.findOne(query)
      .populate('instrument')
      .populate('application')
      .populate('inspection')
      .populate('owner', 'fullName email organizationName phone address district state')
      .populate('verifiedBy', 'fullName designation department phone');

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    const obj = certificate.toObject();
    if (obj.status !== 'REVOKED') {
      const exp = calculateExpiryStatus(obj.validUntil);
      obj.computedStatus = exp.status;
      obj.daysRemaining = exp.daysRemaining;
    }

    res.json({ success: true, data: obj });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/certificates/:id/pdf
// @desc    Generate and download official PDF certificate
// @access  Public or Private (Anyone with certificate ID can download)
router.get('/:id/pdf', async (req, res, next) => {
  try {
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    const query = isMongoId
      ? { _id: req.params.id }
      : { certificateNumber: req.params.id };

    const certificate = await Certificate.findOne(query);

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="MetraVerify-Certificate-${certificate.certificateNumber}.pdf"`
    );

    await buildCertificatePDF(certificate, res);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/certificates/:id/revoke
// @desc    Revoke certificate (fraud, tampering, broken seal)
// @access  Private (ADMIN, LMO_OFFICER)
router.post(
  '/:id/revoke',
  protect,
  authorizeRoles('ADMIN', 'LMO_OFFICER'),
  async (req, res, next) => {
    try {
      const { reason = 'Revoked by Legal Metrology Authority' } = req.body;
      const certificate = await Certificate.findById(req.params.id);

      if (!certificate) {
        return res.status(404).json({ success: false, message: 'Certificate not found' });
      }

      certificate.status = 'REVOKED';
      await certificate.save();

      // Update instrument status to EXPIRED / REJECTED
      await Instrument.findByIdAndUpdate(certificate.instrument, {
        status: 'EXPIRED',
      });

      await logAudit({
        action: 'CERTIFICATE_REVOKED',
        user: req.user._id,
        userName: req.user.fullName,
        userRole: req.user.role,
        entity: 'Certificate',
        entityId: certificate._id,
        details: {
          certificateNumber: certificate.certificateNumber,
          reason,
        },
        ipAddress: req.ip,
      });

      res.json({
        success: true,
        message: 'Certificate has been revoked.',
        data: certificate,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
