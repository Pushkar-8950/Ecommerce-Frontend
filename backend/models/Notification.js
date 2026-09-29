import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'EXPIRY_ALERT',
        'APPLICATION_UPDATE',
        'ASSIGNMENT',
        'INSPECTION_RESULT',
        'CERTIFICATE_ISSUED',
        'SYSTEM',
      ],
      default: 'SYSTEM',
    },
    relatedEntity: {
      entityType: { type: String },
      entityId: { type: String },
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
