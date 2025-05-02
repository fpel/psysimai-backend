// src/controllers/configController.ts
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getConfigsByUser = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;

		const configs = await prisma.config.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
			include: {
				skillCategory: true,
				difficultyLevel: true,
			}
		});

		res.status(200).json(configs);
	} catch (error) {
		console.error('Erro ao buscar configs:', error);
		res.status(500).json({ message: 'Erro ao buscar configurações' });
	}
};
