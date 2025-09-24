// src/routes/sessionRoutes.ts
import express from 'express';
import {
	createSession,
	getSessionMessages,
	getSessionHistory,
	updateSessionStatus,
	repeatSession,
	getCompletedEstimulos,
} from '../controllers/sessionController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();


router.post('/', verifyToken, createSession);
router.post('/:sessionId/repeat', verifyToken, repeatSession);
router.get('/:sessionId/messages', getSessionMessages);
router.get('/', verifyToken, getSessionHistory);
router.patch('/:sessionId', verifyToken, updateSessionStatus);
// Nova rota para buscar IDs dos estímulos concluídos
router.get('/completed/estimulos', verifyToken, getCompletedEstimulos);

export default router;