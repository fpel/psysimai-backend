import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllEstimulos = async (req: Request, res: Response) => {
	try {
		const estimulos = await prisma.estimulo.findMany({
			include: {
				skillCategory: true,
				difficultyLevel: true,
				expectedResponses: true,
			},
		});
		res.status(200).json(estimulos);
		return;
	} catch (error) {
		console.error('Erro ao buscar estímulos:', error);
		res.status(500).json({ message: 'Erro ao buscar estímulos.' });
		return;
	}
};

export const getEstimulosByUser = async (req: Request, res: Response) => {
	const { userId } = req.params;
	if (!userId) {
		res.status(400).json({ message: 'userId ausente.' });
		return;
	}
	try {
		const userEstimulos = await prisma.userEstimulo.findMany({
			where: { userId },
			include: {
				estimulo: {
					select: {
						id: true,
						text: true,
						order: true,
						difficultyLevel: true,
					},
				},
			},
		});
		// Retorna apenas os estímulos já filtrados
		const estimulos = userEstimulos.map(ue => ue.estimulo);
		res.status(200).json(estimulos);
		return;
	} catch (error) {
		console.error('Erro ao buscar estímulos do usuário:', error);
		res.status(500).json({ message: 'Erro ao buscar estímulos do usuário.' });
		return;
	}
};
