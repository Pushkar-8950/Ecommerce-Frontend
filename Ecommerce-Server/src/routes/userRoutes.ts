import { Router } from 'express';
import { getMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// GET /api/users/profile
router.get('/profile', protect, getMe);

export default router;
