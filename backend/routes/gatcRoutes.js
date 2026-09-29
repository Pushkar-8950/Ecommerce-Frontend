import express from 'express';
import GATC from '../models/GATC.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/gatcs
// @desc    Get all Government Approved Test Centres
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const gatcs = await GATC.find().sort({ centreName: 1 });
    res.json({ success: true, count: gatcs.length, data: gatcs });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/gatcs
// @desc    Register new test centre
// @access  Private (ADMIN)
router.post('/', protect, authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const gatc = await GATC.create(req.body);
    res.status(201).json({ success: true, data: gatc });
  } catch (error) {
    next(error);
  }
});

// @route   PATCH /api/gatcs/:id
// @desc    Update test centre
// @access  Private (ADMIN)
router.patch('/:id', protect, authorizeRoles('ADMIN'), async (req, res, next) => {
  try {
    const gatc = await GATC.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, data: gatc });
  } catch (error) {
    next(error);
  }
});

export default router;
