// src/controllers/authController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getLoginCode } from './emailController';
dotenv.config();

console.log('Initializing authController...');
const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
	const { email, code } = req.body;
	console.log('Login request received:', { email });

	if (!email || !code) {
		res.status(400).json({ message: 'Email e código obrigatórios.' });
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

		const validCode = getLoginCode(email);
		if (!validCode || code !== validCode) {
			res.status(401).json({ message: 'Código inválido.' });
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

export const registerUser = async (req: Request, res: Response) => {
	const { name, email } = req.body;
	if (!name || !email) {
		res.status(400).json({ message: 'Nome e email são obrigatórios.' });
		return;
	}
	try {
		const existing = await prisma.user.findUnique({ where: { email } });
		if (existing) {
			res.status(409).json({ message: 'Email já cadastrado.' });
			return;
		}
		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: '', // valor padrão
				isAdmin: false, // valor padrão
				ativo: true // valor padrão
			}
		});
		res.status(201).json({ user });
		return;
	} catch (err) {
		console.error('Erro ao cadastrar usuário:', err);
		res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
		return;
	}
};
