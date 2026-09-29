import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    instrument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instrument',
      required: true,
      index: true,
    },
    instrumentId: {
      type: String,
      required: true,
      index: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VerificationApplication',
      required: true,
    },
    applicationId: {
      type: String,
      required: true,
    },
    inspection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inspection',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    instrumentType: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    serialNumber: {
      type: String,
      required: true,
      index: true,
    },
    capacity: {
      type: String,
      required: true,
    },
    accuracyClass: {
      type: String,
      required: true,
    },
    verificationDate: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
      index: true,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    verifiedByName: {
      type: String,
      required: true,
    },
    verifiedByDesignation: {
      type: String,
      default: 'Legal Metrology Officer',
    },
    issuingAuthority: {
      type: String,
      default: 'Government of NCT of Delhi / Legal Metrology Wing',
    },
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['VALID', 'EXPIRING_SOON', 'EXPIRED', 'REVOKED'],
      default: 'VALID',
      index: true,
    },
    qrCodeDataUrl: {
      type: String,
    },
    verificationUrl: {
      type: String,
    },
    digitalStampCode: {
      type: String,
    },
    disclaimer: {
      type: String,
      default:
        'This is a Smart India Hackathon prototype demonstrating a digital verification workflow under Legal Metrology.',
    },
    pdfUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
