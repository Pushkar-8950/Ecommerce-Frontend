import express from 'express';
import AuditLog from '../models/AuditLog.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/audit-logs
// @desc    Get audit logs with search & filters
// @access  Private (ADMIN)
router.get('/', protect, authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const { action, entity, search, limit = 100 } = req.query;
    const query = {};

    if (action) {
      query.action = action;
    }

    if (entity) {
      query.entity = entity;
    }

    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { entityId: { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } },
      ];
    }

    const logs = await AuditLog.find(query)
      .populate('user', 'fullName email role')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
