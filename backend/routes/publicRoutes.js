import express from 'express';
import Certificate from '../models/Certificate.js';
import { calculateExpiryStatus } from '../services/expiryService.js';

const router = express.Router();

// @route   GET /api/public/verify/:certificateNumber
// @desc    Public verification of certificate authenticity and validity
// @access  Public (NO AUTH REQUIRED)
router.get('/verify/:certificateNumber', async (req, res, next) => {
  try {
    const certNumber = req.params.certificateNumber.trim().toUpperCase();

    const certificate = await Certificate.findOne({
      certificateNumber: certNumber,
    })
      .populate('instrument', 'category accuracyClass manufacturer model capacity locationAddress')
      .populate('verifiedBy', 'fullName designation department');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: `No digital certificate found matching reference "${certNumber}". Please ensure the certificate ID is typed accurately.`,
      });
    }

    const expiryInfo = calculateExpiryStatus(certificate.validUntil);
    const computedStatus =
      certificate.status === 'REVOKED' ? 'REVOKED' : expiryInfo.status;

    // Return non-sensitive verification payload suitable for public display
    const publicVerificationData = {
      isAuthentic: true,
      certificateNumber: certificate.certificateNumber,
      status: computedStatus,
      statusLabel:
        computedStatus === 'VALID'
          ? 'VALID & CERTIFIED'
          : computedStatus === 'EXPIRING_SOON'
          ? 'EXPIRING SOON (RE-VERIFICATION DUE)'
          : computedStatus === 'EXPIRED'
          ? 'EXPIRED / STAMPING LAPSED'
          : 'REVOKED',
      instrumentId: certificate.instrumentId,
      instrumentType: certificate.instrumentType,
      category: certificate.category || certificate.instrument?.category,
      manufacturer: certificate.manufacturer,
      model: certificate.model,
      serialNumber: certificate.serialNumber,
      capacity: certificate.capacity,
      accuracyClass: certificate.accuracyClass,
      businessName: certificate.businessName,
      jurisdictionState: certificate.state,
      jurisdictionDistrict: certificate.district,
      verificationDate: certificate.verificationDate,
      validUntil: certificate.validUntil,
      daysRemaining: expiryInfo.daysRemaining,
      verifiedByName: certificate.verifiedByName,
      verifiedByDesignation: certificate.verifiedByDesignation,
      issuingAuthority: certificate.issuingAuthority,
      digitalStampCode: certificate.digitalStampCode,
      qrCodeDataUrl: certificate.qrCodeDataUrl,
      verificationTimestamp: new Date().toISOString(),
      disclaimer:
        'This is a Smart India Hackathon prototype demonstrating a digital verification workflow under Legal Metrology.',
      portalVerificationBadge: 'Verified through MetraVerify Digital Verification Portal',
    };

    res.json({
      success: true,
      data: publicVerificationData,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
