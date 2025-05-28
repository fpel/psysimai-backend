// routes/validationRoutes.ts
import express from 'express';
import { validateResponseAI, validateAudioResponse } from '../controllers/validationController';
import { verifyToken } from '../middleware/authMiddleware';
import { upload } from '../middleware/upload';

const router = express.Router();

router.post('/validate-response', verifyToken, validateResponseAI);
router.post('/audio-response', verifyToken, upload.single('audio'), validateAudioResponse); // NOVO

export default router;
