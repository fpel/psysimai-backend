// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import sessionRoutes from './routes/sessionRoutes';
import messageRoutes from './routes/messageRoutes';
import validationRoutes from './routes/validationRoutes';
import configRoutes from './routes/configRoutes';
import authRoutes from './routes/authRoutes';
import { verifyToken } from './middleware/authMiddleware';


dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/sessions', verifyToken, sessionRoutes);
app.use('/messages', verifyToken, messageRoutes);
app.use('/validate', verifyToken, validationRoutes);
app.use('/configs', verifyToken, configRoutes);



if (process.env.NODE_ENV !== 'test') {
	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
