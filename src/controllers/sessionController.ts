// src/controllers/sessionController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getSessionMessages = async (req: Request, res: Response) => {
	const { sessionId } = req.params;

	if (!sessionId) {
		res.status(400).json({ message: 'sessionId ausente' });
		return;
	}

	try {
		const messages = await prisma.message.findMany({
			where: { sessionId },
			orderBy: { timestamp: 'asc' },
		});

		res.status(200).json(messages);
	} catch (error) {
		console.error('Erro ao buscar mensagens:', error);
		res.status(500).json({ message: 'Erro ao buscar mensagens da sessão.' });
		return;
	}
};

export const createSession = async (req: Request, res: Response) => {
	const { userId, configId } = req.body;

	if (!userId || !configId) {
		res.status(400).json({ message: 'userId ou configId ausente' });
		return;
	}

	try {
		const session = await prisma.session.create({
			data: {
				userId,
				configId,
				startedAt: new Date(),
			},
		});

		const firstPrompt = await prisma.prompt.findFirst({
			where: { configId },
			orderBy: { order: 'asc' },
		});

		if (firstPrompt) {
			await prisma.message.create({
				data: {
					sessionId: session.id,
					promptId: firstPrompt.id,
					sender: 'ia',
					content: firstPrompt.text,
					timestamp: new Date(),
				},
			});
		}

		res.status(201).json(session);
	} catch (err) {
		console.error('Erro ao criar sessão:', err);
		res.status(500).json({ message: 'Erro ao criar sessão.' });
		return;
	}
};

export const validateResponse = async (req: Request, res: Response) => {
	const { promptId, therapistResponse, sessionId } = req.body;

	if (!promptId || !therapistResponse || !sessionId) {
		res.status(400).json({ message: 'Dados ausentes para validação.' });
		return;
	}

	try {
		const expected = await prisma.expectedResponse.findMany({
			where: { promptId },
		});

		const respostaNormalizada = therapistResponse.toLowerCase().trim();
		const match = expected.find(er => respostaNormalizada.includes(er.text.toLowerCase()));

		const isValid = Boolean(match);
		const feedback = isValid
			? 'Boa pergunta! Continue assim.'
			: 'Essa pergunta pode ser reformulada. Tente explorar mais o que o paciente expressou.';

		await prisma.message.create({
			data: {
				sessionId,
				promptId,
				sender: 'therapist',
				content: therapistResponse,
				isValid,
				feedback,
				timestamp: new Date(),
			},
		});

		res.status(200).json({ isValid, feedback });
	} catch (err) {
		console.error('Erro ao validar resposta:', err);
		res.status(500).json({ message: 'Erro ao validar a resposta.' });
		return;
	}
};
