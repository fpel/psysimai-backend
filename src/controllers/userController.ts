// src/controllers/userController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
	const { name, email, cpf, cidade, estado, telefone } = req.body;
	if (!name || !email || !cpf || !cidade || !estado || !telefone) {
		res.status(400).json({ message: 'Nome, email, CPF, cidade, estado e telefone são obrigatórios.' });
		return;
	}
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		res.status(400).json({ message: 'Formato de email inválido.' });
		return;
	}
	const cpfDigits = String(cpf).replace(/\D/g, '');
	if (cpfDigits.length !== 11 || cpfDigits !== String(cpf)) {
		res.status(400).json({ message: 'CPF inválido. Use apenas números com 11 dígitos.' });
		return;
	}
	const estadoValue = String(estado).trim().toUpperCase();
	if (!/^[A-Z]{2}$/.test(estadoValue)) {
		res.status(400).json({ message: 'Estado inválido. Use 2 letras.' });
		return;
	}
	if (!/^\d{11}$/.test(String(telefone))) {
		res.status(400).json({ message: 'Telefone inválido. Use apenas números (11 dígitos).' });
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
				cpf: cpfDigits,
				cidade,
				estado: estadoValue,
				telefone,
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
			orderBy: { name: 'asc' },
			select: {
				id: true,
				name: true,
				email: true,
				cpf: true,
				cidade: true,
				estado: true,
				telefone: true,
				isAdmin: true,
				ativo: true,
			},
		});
		res.status(200).json(users);
		return;
	} catch (err) {
		console.error('Erro ao listar usuários:', err);
		res.status(500).json({ message: 'Erro ao listar usuários.' });
		return;
	}
};

export const updateUser = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { name, email, cpf, cidade, estado, telefone, ativo, isAdmin } = req.body;

	if (!id) {
		res.status(400).json({ message: 'ID do usuário é obrigatório.' });
		return;
	}

	if (email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			res.status(400).json({ message: 'Formato de email inválido.' });
			return;
		}
	}

	let cpfDigits: string | undefined;
	if (cpf !== undefined) {
		cpfDigits = String(cpf).replace(/\D/g, '');
		if (cpfDigits.length !== 11 || cpfDigits !== String(cpf)) {
			res.status(400).json({ message: 'CPF inválido. Use apenas números com 11 dígitos.' });
			return;
		}
	}

	let estadoValue: string | undefined;
	if (estado !== undefined) {
		estadoValue = String(estado).trim().toUpperCase();
		if (!/^[A-Z]{2}$/.test(estadoValue)) {
			res.status(400).json({ message: 'Estado inválido. Use 2 letras.' });
			return;
		}
	}

	if (telefone !== undefined && !/^\d{11}$/.test(String(telefone))) {
		res.status(400).json({ message: 'Telefone inválido. Use apenas números (11 dígitos).' });
		return;
	}

	try {
		const user = await prisma.user.update({
			where: { id },
			data: {
				name,
				email,
				cpf: cpfDigits ?? (cpf === undefined ? undefined : null),
				cidade,
				estado: estadoValue ?? (estado === undefined ? undefined : null),
				telefone,
				ativo,
				isAdmin,
			},
		});
		res.status(200).json({ user });
		return;
	} catch (err) {
		console.error('Erro ao atualizar usuário:', err);
		res.status(500).json({ message: 'Erro ao atualizar usuário.' });
		return;
	}
};
