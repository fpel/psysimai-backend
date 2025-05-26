// src/routes/authRoutes.ts
import express from 'express';
import { login } from '../controllers/authController';

const router = express.Router();

console.log('Auth routes initialized');
router.post('/login', login);

export default router;
