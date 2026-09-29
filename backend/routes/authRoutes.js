import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { logAudit } from '../services/auditService.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'metraverify_super_secret_jwt_key_sih2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      role = 'BUSINESS_USER',
      organizationName,
      address,
      state = 'Delhi',
      district = 'Central Delhi',
    } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, phone, and password.',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address is already registered.',
      });
    }

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      password,
      role: ['BUSINESS_USER', 'LMO_OFFICER', 'GATC', 'ADMIN'].includes(role)
        ? role
        : 'BUSINESS_USER',
      organizationName: organizationName || `${fullName}'s Enterprises`,
      address: address || 'Main Commercial Road',
      state,
      district,
    });

    await logAudit({
      action: 'USER_REGISTERED',
      user: user._id,
      userName: user.fullName,
      userRole: user.role,
      entity: 'User',
      entityId: user._id,
      details: { email: user.email, role: user.role },
      ipAddress: req.ip,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        organizationName: user.organizationName,
        address: user.address,
        state: user.state,
        district: user.district,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password incorrect.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is deactivated. Please contact support.',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        organizationName: user.organizationName,
        address: user.address,
        state: user.state,
        district: user.district,
        designation: user.designation,
        department: user.department,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;
