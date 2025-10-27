// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface DecodedToken {
	userId: string;
	user?: {
		id: string;
		email: string;
		name: string;
		isAdmin: boolean;
	};
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		res.status(401).json({ message: 'Token não fornecido.' });
		return;
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
		req.body.userId = decoded.userId;
		req.user = { id: decoded.userId, isAdmin: decoded.user?.isAdmin ?? false };
		next();
	} catch (err) {
		console.error('Token inválido:', err);
		res.status(403).json({ message: 'Token inválido.' });
		return;
	}
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
	if (!req.user || !req.user.isAdmin) {
		res.status(403).json({ message: 'Acesso restrito a administradores.' });
		return;
	}
	next();
};

declare global {
	namespace Express {
		interface Request {
			user: { id: string; isAdmin: boolean };
		}
	}
}