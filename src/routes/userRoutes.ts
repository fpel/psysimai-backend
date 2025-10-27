// src/routes/userRoutes.ts
import express from 'express';
import { registerUser, listActiveUsers } from '../controllers/userController';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

console.log('User routes initialized');

router.post('/register', verifyToken, registerUser);
// Nova rota para listar usuários ativos ordenados por nome (apenas admins)
router.get('/active', verifyToken, requireAdmin, listActiveUsers);

export default router;

