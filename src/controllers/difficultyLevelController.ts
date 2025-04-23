import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllDifficultyLevels = async (_req: Request, res: Response) => {
	try {
		const levels = await prisma.difficultyLevel.findMany({
			orderBy: { order: 'asc' },
		});

		res.status(200).json(levels);
		return;
	} catch (err) {
		console.error('Erro ao buscar níveis de dificuldade:', err);
		res.status(500).json({ message: 'Erro ao buscar níveis de dificuldade.' });
		return;
	}
};
