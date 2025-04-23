// src/controllers/progressController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const saveProgress = async (req: Request, res: Response) => {
	const { userId, difficultyLevelId } = req.body;

	if (!userId || !difficultyLevelId) {
		res.status(400).json({ message: 'Dados ausentes para salvar progresso.' });
		return;
	}

	try {
		await prisma.progress.upsert({
			where: {
				userId_difficultyLevelId: {
					userId,
					difficultyLevelId
				}
			},
			update: {},
			create: {
				userId,
				difficultyLevelId
			}
		});

		res.status(201).json({ message: 'Progresso salvo com sucesso.' });
		return;
	} catch (err) {
		console.error('Erro ao salvar progresso:', err);
		res.status(500).json({ message: 'Erro ao salvar progresso.' });
		return;
	}
};

export const getUserProgress = async (req: Request, res: Response) => {
	const { userId } = req.params;

	if (!userId) {
		res.status(400).json({ message: 'userId ausente' });
		return;
	}

	try {
		const progress = await prisma.progress.findMany({
			where: { userId },
			include: {
				difficultyLevel: true
			}
		});

		res.status(200).json(progress);
		return;
	} catch (err) {
		console.error('Erro ao buscar progresso:', err);
		res.status(500).json({ message: 'Erro ao buscar progresso.' });
	}
};
