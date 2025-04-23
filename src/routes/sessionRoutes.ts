import express from 'express';
import { createSession, getSessionMessages } from '../controllers/sessionController';

const router = express.Router();

router.post('/', createSession);
router.get('/:sessionId/messages', getSessionMessages);

export default router;
