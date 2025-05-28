// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from './middleware/authMiddleware';
import sessionRoutes from './routes/sessionRoutes';
import messageRoutes from './routes/messageRoutes';
import validationRoutes from './routes/validationRoutes';
import configRoutes from './routes/configRoutes';
import authRoutes from './routes/authRoutes';
import configuracaoRoutes from './routes/configuracaoRoutes';
import openaiRoutes from './routes/openaiRoutes';

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
app.use('/api/configs', verifyToken, configRoutes);
app.use('/api/configuracao', verifyToken, configuracaoRoutes);
app.use('/api/openai', verifyToken, openaiRoutes);


if (process.env.NODE_ENV !== 'test') {
	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
