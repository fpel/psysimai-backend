// src/routes/validationRoutes.ts
import express from 'express';
import { validateResponseAI } from '../controllers/validationController';
const router = express.Router();

// router.post('/', validateResponse);
router.post('/validate-response', validateResponseAI);

export default router;
