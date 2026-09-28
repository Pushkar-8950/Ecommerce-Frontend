import { Router } from 'express';
import {
  generateText,
  generateMultilingualCatalog,
  generateDynamicPricing,
  enhanceProductImage,
} from '../controllers/aiController';

const router = Router();

// POST /api/ai/generate
router.post('/generate', generateText);

// POST /api/ai/catalog (Multilingual Voice / Text Auto-Cataloger)
router.post('/catalog', generateMultilingualCatalog);

// POST /api/ai/pricing (Dynamic ML Pricing Assistant)
router.post('/pricing', generateDynamicPricing);

// POST /api/ai/enhance-image (AI Studio & No-Background Policy Enhancement)
router.post('/enhance-image', enhanceProductImage);

export default router;

