import express from 'express';
import { createSession, getSessionMessages, getSessionHistory } from '../controllers/sessionController';
import { verifyToken } from '../middleware/authMiddleware';
const router = express.Router();

router.post('/', createSession);
router.get('/:sessionId/messages', getSessionMessages);
router.get('/', verifyToken, getSessionHistory);

export default router;
