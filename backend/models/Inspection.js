import mongoose from 'mongoose';

const inspectionSchema = new mongoose.Schema(
  {
    inspectionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VerificationApplication',
      required: true,
      index: true,
    },
    instrument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instrument',
      required: true,
      index: true,
    },
    officer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    officerType: {
      type: String,
      enum: ['LMO_OFFICER', 'GATC'],
      default: 'LMO_OFFICER',
    },
    checks: {
      instrumentCondition: {
        type: String,
        enum: ['PASS', 'FAIL', 'PENDING'],
        default: 'PENDING',
      },
      display: {
        type: String,
        enum: ['PASS', 'FAIL', 'PENDING'],
        default: 'PENDING',
      },
      zeroError: {
        type: String,
        enum: ['PASS', 'FAIL', 'PENDING'],
        default: 'PENDING',
      },
      accuracy: {
        type: String,
        enum: ['PASS', 'FAIL', 'PENDING'],
        default: 'PENDING',
      },
      calibration: {
        type: String,
        enum: ['PASS', 'FAIL', 'PENDING'],
        default: 'PENDING',
      },
      sealingStamping: {
        type: String,
        enum: ['PASS', 'FAIL', 'PENDING'],
        default: 'PENDING',
      },
      physicalCondition: {
        type: String,
        enum: ['PASS', 'FAIL', 'PENDING'],
        default: 'PENDING',
      },
    },
    passedChecks: {
      type: Number,
      default: 0,
    },
    totalChecks: {
      type: Number,
      default: 7,
    },
    remarks: {
      type: String,
      default: '',
    },
    officerNotes: {
      type: String,
      default: '',
    },
    photos: [
      {
        type: String,
      },
    ],
    documents: [
      {
        type: String,
      },
    ],
    finalResult: {
      type: String,
      enum: ['IN_PROGRESS', 'VERIFIED', 'REJECTED'],
      default: 'IN_PROGRESS',
      index: true,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Inspection = mongoose.model('Inspection', inspectionSchema);
export default Inspection;
