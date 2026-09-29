import mongoose from 'mongoose';

const verificationApplicationSchema = new mongoose.Schema(
  {
    applicationId: {
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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    applicationType: {
      type: String,
      enum: ['NEW_VERIFICATION', 'RE_VERIFICATION'],
      default: 'NEW_VERIFICATION',
    },
    preferredDate: {
      type: Date,
      required: true,
    },
    preferredLocation: {
      type: String,
      default: 'On-site Premise',
    },
    notes: {
      type: String,
      default: '',
    },
    supportingDocuments: [
      {
        type: String,
      },
    ],
    instrumentPhotos: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: [
        'SUBMITTED',
        'UNDER_REVIEW',
        'SCHEDULED',
        'INSPECTION',
        'VERIFIED',
        'REJECTED',
        'CERTIFICATE_ISSUED',
      ],
      default: 'SUBMITTED',
      index: true,
    },
    assignedToType: {
      type: String,
      enum: ['LMO', 'GATC'],
      default: 'LMO',
    },
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    scheduledDate: {
      type: Date,
    },
    scheduledSlot: {
      type: String,
      default: '10:00 AM - 01:00 PM',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    inspection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inspection',
    },
    certificate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate',
    },
    timeline: [
      {
        status: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        comments: {
          type: String,
          default: '',
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        updatedByName: {
          type: String,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const VerificationApplication = mongoose.model(
  'VerificationApplication',
  verificationApplicationSchema
);
export default VerificationApplication;
