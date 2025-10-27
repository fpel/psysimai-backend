// src/controllers/userController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
	const { name, email } = req.body;
	if (!name || !email) {
		res.status(400).json({ message: 'Nome e email são obrigatórios.' });
		return;
	}
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		res.status(400).json({ message: 'Formato de email inválido.' });
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

export const listActiveUsers = async (req: Request, res: Response) => {
	try {
		const users = await prisma.user.findMany({
			where: { ativo: true },
			orderBy: { name: 'asc' },
			select: {
				id: true,
				name: true,
				email: true,
				isAdmin: true,
				ativo: true,
			},
		});
		res.status(200).json(users);
		return;
	} catch (err) {
		console.error('Erro ao listar usuários ativos:', err);
		res.status(500).json({ message: 'Erro ao listar usuários ativos.' });
		return;
	}
};

