import express from 'express';
import { textToSpeech } from '../controllers/openaiController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/tts', verifyToken, textToSpeech);

export default router;
