// src/routes/validationRoutes.ts
import express from 'express';
import { validateResponse, validateResponseAI } from '../controllers/validationController';
const router = express.Router();

router.post('/', validateResponse);
router.post('/validate-response', validateResponseAI);

export default router;
