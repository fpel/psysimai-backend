// src/controllers/configController.ts
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getPromptsByConfig = async (req: Request, res: Response) => {
	const { configId } = req.params

	try {
		const prompts = await prisma.prompt.findMany({
			where: { configId },
			orderBy: { order: 'asc' },
			select: {
				id: true,
				text: true,
				skillCategory: {
					select: {
						description: true
					}
				},
				difficultyLevel: {
					select: {
						name: true
					}
				},
				difficultyLevelId: true
			}
		})

		res.status(200).json(prompts)
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Erro ao buscar prompts' })
	}
}

export const getConfigsByUser = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;

		const configs = await prisma.config.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
		});

		res.status(200).json(configs);
	} catch (error) {
		console.error('Erro ao buscar configs:', error);
		res.status(500).json({ message: 'Erro ao buscar configurações' });
	}
};
