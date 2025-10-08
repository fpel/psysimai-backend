// src/routes/authRoutes.ts
import express from 'express';
import { login, registerUser } from '../controllers/authController';

const router = express.Router();

console.log('Auth routes initialized');
router.post('/login', login);
router.post('/register', registerUser);

export default router;
