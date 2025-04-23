// src/controllers/promptController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getNextPrompt = async (req: Request, res: Response) => {
	const { sessionId } = req.params;

	if (!sessionId) {
		res.status(400).json({ message: 'sessionId ausente' });
		return;
	}

	try {
		const session = await prisma.session.findUnique({
			where: { id: sessionId },
			include: {
				config: true
			}
		});

		if (!session) {
			res.status(404).json({ message: 'Sessão não encontrada' });
			return;
		}

		const lastTherapistMessage = await prisma.message.findFirst({
			where: {
				sessionId,
				sender: 'therapist',
				isValid: true
			},
			orderBy: {
				timestamp: 'desc'
			},
			include: {
				prompt: true
			}
		});

		if (!lastTherapistMessage?.prompt) {
			res.status(200).json({ nextPrompt: null, finishedDifficulty: false });
			return;
		}

		const { order, difficultyLevelId } = lastTherapistMessage.prompt;

		const nextPrompt = await prisma.prompt.findFirst({
			where: {
				configId: session.configId,
				difficultyLevelId,
				order: { gt: order }
			},
			orderBy: { order: 'asc' }
		});

		if (!nextPrompt) {
			res.status(200).json({ nextPrompt: null, finishedDifficulty: true });
			return;
		}

		res.status(200).json({ nextPrompt, finishedDifficulty: false });
		return;
	} catch (err) {
		console.error('Erro ao buscar próximo prompt:', err);
		res.status(500).json({ message: 'Erro ao buscar próximo prompt' });
		return;
	}
};
