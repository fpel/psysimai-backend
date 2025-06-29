// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from './middleware/authMiddleware';
import sessionRoutes from './routes/sessionRoutes';
import messageRoutes from './routes/messageRoutes';
import validationRoutes from './routes/validationRoutes';
import authRoutes from './routes/authRoutes';
import openaiRoutes from './routes/openaiRoutes';
import estimuloRoutes from './routes/estimuloRoutes';
import difficultyLevelRoutes from './routes/difficultyLevelRoutes';
import http from 'http';

console.log('Starting PsySimAI server...');
dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/sessions', verifyToken, sessionRoutes);
app.use('/api/messages', verifyToken, messageRoutes);
app.use('/api/validate', verifyToken, validationRoutes);
app.use('/api/openai', verifyToken, openaiRoutes);
app.use('/api/estimulos', verifyToken, estimuloRoutes);
app.use('/api/difficulty-levels', verifyToken, difficultyLevelRoutes);


if (process.env.NODE_ENV !== 'test') {
	const PORT = process.env.PORT || 3000;
	const server = http.createServer(app);
	server.timeout = 10 * 60 * 1000; // 10 minutos
	server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
