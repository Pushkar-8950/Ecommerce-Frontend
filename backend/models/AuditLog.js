import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: [
        'USER_REGISTERED',
        'INSTRUMENT_CREATED',
        'APPLICATION_SUBMITTED',
        'APPLICATION_ASSIGNED',
        'APPLICATION_SCHEDULED',
        'INSPECTION_STARTED',
        'INSPECTION_COMPLETED',
        'CERTIFICATE_ISSUED',
        'CERTIFICATE_REVOKED',
        'STATUS_CHANGED',
      ],
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userName: {
      type: String,
      default: 'System',
    },
    userRole: {
      type: String,
      default: 'SYSTEM',
    },
    entity: {
      type: String,
      required: true,
      index: true,
    },
    entityId: {
      type: String,
      required: true,
      index: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
  },
  {
    timestamps: true,
  }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
