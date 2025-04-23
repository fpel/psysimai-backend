// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		res.status(401).json({ message: 'Token não fornecido.' });
		return;
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
		req.body.userId = decoded.userId;
		next();
	} catch (err) {
		console.error('Token inválido:', err);
		res.status(403).json({ message: 'Token inválido.' });
		return;
	}
};
