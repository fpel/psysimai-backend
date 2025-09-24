// src/controllers/authController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

console.log('Initializing authController...');
const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	console.log('Login request received:', { email });

	if (!email || !password) {
		res.status(400).json({ message: 'Email e senha obrigatórios.' });
		return;
	}

	try {
		console.log(`Validando o usuário ${email}`);
		const user = await prisma.user.findUnique({
			where: { email }
		});


		if (!user || user.ativo === false) {
			res.status(403).json({ message: 'Usuário inativo. Entre em contato com o administrador.' });
			return;
		}

		if (!user || user.password !== password) {
			res.status(401).json({ message: 'Credenciais inválidas.' });
			return;
		}

		const token = jwt.sign({ userId: user.id, user: { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin } }, process.env.JWT_SECRET as string, {
			expiresIn: '1d'
		});

		res.status(200).json({ user, token });
		return;
	} catch (err) {
		console.error('Erro no login:', err);
		res.status(500).json({ message: 'Erro no login.' });
		return;
	}
};
