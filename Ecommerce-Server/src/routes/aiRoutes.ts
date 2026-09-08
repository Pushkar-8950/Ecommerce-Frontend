import { Router } from 'express';
import { generateText } from '../controllers/aiController';

const router = Router();

// POST /api/ai/generate
router.post('/generate', generateText);

export default router;
