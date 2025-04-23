// src/routes/promptRoutes.ts
import express from 'express';
import { getNextPrompt } from '../controllers/promptController';

const router = express.Router();

router.get('/sessions/:sessionId/next-prompt', getNextPrompt);

export default router;
