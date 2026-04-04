import express from 'express';
import { getAIRecommendations } from '../controllers/aiController.js';

const router = express.Router();

// @route   POST /api/ai/recommend
// @desc    Get AI-powered song recommendations
router.post('/recommend', getAIRecommendations);

export default router;
