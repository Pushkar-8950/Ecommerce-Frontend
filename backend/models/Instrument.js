import mongoose from 'mongoose';

const instrumentSchema = new mongoose.Schema(
  {
    instrumentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    instrumentType: {
      type: String,
      required: [true, 'Instrument type is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Commercial', 'Industrial', 'Petroleum', 'Retail', 'Healthcare', 'Jewellery / Precision'],
      default: 'Commercial',
    },
    manufacturer: {
      type: String,
      required: [true, 'Manufacturer is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    serialNumber: {
      type: String,
      required: [true, 'Serial number is required'],
      trim: true,
      index: true,
    },
    capacity: {
      type: String,
      required: [true, 'Capacity is required'],
      trim: true,
    },
    accuracyClass: {
      type: String,
      enum: ['Class I (Special)', 'Class II (High)', 'Class III (Medium)', 'Class IV (Ordinary)'],
      default: 'Class III (Medium)',
    },
    locationAddress: {
      type: String,
      required: [true, 'Location address is required'],
    },
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    purchaseDate: {
      type: Date,
    },
    lastVerificationDate: {
      type: Date,
    },
    nextVerificationDueDate: {
      type: Date,
      index: true,
    },
    status: {
      type: String,
      enum: [
        'REGISTERED',
        'PENDING_VERIFICATION',
        'SCHEDULED',
        'UNDER_INSPECTION',
        'VERIFIED',
        'REJECTED',
        'EXPIRED',
      ],
      default: 'REGISTERED',
      index: true,
    },
    photos: [
      {
        type: String,
      },
    ],
    documents: [
      {
        title: String,
        url: String,
      },
    ],
    activeCertificate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate',
    },
  },
  {
    timestamps: true,
  }
);

const Instrument = mongoose.model('Instrument', instrumentSchema);
export default Instrument;
