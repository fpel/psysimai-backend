import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getConfiguracao = async (req: Request, res: Response) => {
	try {
		const config = await prisma.configuracao.findFirst();
		if (!config) {
			res.status(404).json({ error: 'Configuração não encontrada.' });
			return;
		}
		res.json(config);
		return;
	} catch (error) {
		res.status(500).json({ error: 'Erro ao buscar configuração.' });
		return;
	}
};

export const updateConfiguracao = async (req: Request, res: Response) => {
	const { criteriosAvaliacao, feedback } = req.body;
	const { id } = req.params;
	try {
		const updated = await prisma.configuracao.update({
			where: { id: Number(id) },
			data: { criteriosAvaliacao, feedback },
		});
		res.json(updated);
		return;
	} catch (error) {
		res.status(400).json({ error: 'Erro ao atualizar configuração.' });
		return;
	}
};

export const createConfiguracao = async (req: Request, res: Response) => {
	const { criteriosAvaliacao, feedback } = req.body;
	try {
		const created = await prisma.configuracao.create({
			data: { criteriosAvaliacao, feedback },
		});
		res.status(201).json(created);
		return;
	} catch (error) {
		res.status(400).json({ error: 'Erro ao criar configuração.' });
		return;
	}
};