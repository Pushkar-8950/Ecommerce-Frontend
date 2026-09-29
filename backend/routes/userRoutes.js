import express from 'express';
import User from '../models/User.js';
import { protect, authorizeRoles } from '../middleware/auth.js';
import { logAudit } from '../services/auditService.js';

const router = express.Router();

// @route   GET /api/users/officers
// @desc    Get all active LMO officers (for assignment)
// @access  Private (ADMIN, LMO_OFFICER, GATC)
router.get('/officers', protect, async (req, res, next) => {
  try {
    const officers = await User.find({
      role: 'LMO_OFFICER',
      isActive: true,
    }).select('fullName email phone designation department district state pincode address');
    res.json({ success: true, count: officers.length, data: officers });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/users/gatcs
// @desc    Get all active GATC test centres / users
// @access  Private (ADMIN, LMO_OFFICER, GATC)
router.get('/gatcs', protect, async (req, res, next) => {
  try {
    const gatcs = await User.find({
      role: 'GATC',
      isActive: true,
    }).select('fullName email phone organizationName district state pincode address');
    res.json({ success: true, count: gatcs.length, data: gatcs });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/users
// @desc    Get all users with filtering and search
// @access  Private (ADMIN)
router.get('/', protect, authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const { role, search, state, district } = req.query;
    const query = {};

    if (role) query.role = role;
    if (state) query.state = state;
    if (district) query.district = district;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { organizationName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// @route   PATCH /api/users/:id
// @desc    Update user details or status
// @access  Private
router.patch('/:id', protect, async (req, res, next) => {
  try {
    // Only admin can update others, users can update own profile
    if (req.user.role !== 'ADMIN' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const allowedUpdates = [
      'fullName',
      'phone',
      'organizationName',
      'address',
      'pincode',
      'state',
      'district',
      'designation',
      'department',
      'gstin',
      'panNumber',
      'businessType',
    ];
    if (req.user.role === 'ADMIN') {
      allowedUpdates.push('role', 'isActive');
    }

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    await logAudit({
      action: 'STATUS_CHANGED',
      user: req.user._id,
      userName: req.user.fullName,
      userRole: req.user.role,
      entity: 'User',
      entityId: req.params.id,
      details: updates,
      ipAddress: req.ip,
    });

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
});

export default router;
