// src/routes/sessionRoutes.ts
import express from 'express';
import { createSession, getSessionMessages, getSessionHistory, validateResponse, updateSessionStatus } from '../controllers/sessionController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', verifyToken, createSession);
router.get('/:sessionId/messages', getSessionMessages);
router.get('/', verifyToken, getSessionHistory);
router.post('/validate-response', verifyToken, validateResponse);
router.patch('/:sessionId', verifyToken, updateSessionStatus);

export default router;