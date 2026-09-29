import AuditLog from '../models/AuditLog.js';

export const logAudit = async ({
  action,
  user,
  userName,
  userRole,
  entity,
  entityId,
  details = {},
  ipAddress = '127.0.0.1',
}) => {
  try {
    await AuditLog.create({
      action,
      user: user ? user._id || user : undefined,
      userName: userName || (user && user.fullName) || 'System',
      userRole: userRole || (user && user.role) || 'SYSTEM',
      entity,
      entityId: String(entityId),
      details,
      ipAddress,
    });
  } catch (error) {
    console.error('[Audit Log Error]', error.message);
  }
};
