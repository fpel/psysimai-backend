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
	const { configId, difficultyLevelId, skillCategoryId } = req.body;
	const userId = req.user.id;

	if (!configId || !difficultyLevelId || !skillCategoryId) {
		res.status(400).json({ message: 'Campos obrigatórios ausentes' });
		return;
	}

	try {
		const prompts = await prisma.prompt.findMany({
			where: {
				configId,
				difficultyLevelId,
				skillCategoryId
			},
		});

		if (prompts.length === 0) {
			res.status(404).json({ message: 'Nenhum prompt encontrado para os critérios informados.' });
			return;
		}

		const promptAleatorio = prompts[Math.floor(Math.random() * prompts.length)];

		const session = await prisma.session.create({
			data: {
				userId,
				configId,
				difficultyLevelId,
				status: 'in_progress',
				startedAt: new Date(),
			},
		});

		await prisma.message.create({
			data: {
				sessionId: session.id,
				promptId: promptAleatorio.id,
				sender: 'ia',
				content: promptAleatorio.text,
				timestamp: new Date(),
			},
		});

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

export const getSessionHistory = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;

		const sessions = await prisma.session.findMany({
			where: { userId },
			include: {
				difficultyLevel: true,
			},
			orderBy: {
				startedAt: 'desc',
			},
		});

		const result = sessions.map(session => ({
			id: session.id,
			startedAt: session.startedAt,
			difficultyLevelId: session.difficultyLevelId,
			level: session.difficultyLevel.name,
			status: session.status || 'in_progress',
		}));

		res.status(200).json(result);
		return;
	} catch (error) {
		console.error('Erro ao buscar histórico de sessões:', error);
		res.status(500).json({ message: 'Erro ao buscar histórico de sessões' });
		return;
	}
};

export const updateSessionStatus = async (req: Request, res: Response) => {
	const { sessionId } = req.params;
	const { status } = req.body;

	const allowedStatuses = ['in_progress', 'success', 'fail'];

	if (!sessionId || !status) {
		res.status(400).json({ message: 'Dados obrigatórios ausentes.' });
		return;
	}

	if (!allowedStatuses.includes(status)) {
		res.status(400).json({ message: `Status inválido. Permitidos: ${allowedStatuses.join(', ')}` });
		return;
	}

	try {
		const updatedSession = await prisma.session.update({
			where: { id: sessionId },
			data: { status },
		});

		res.status(200).json(updatedSession);
	} catch (error) {
		console.error('Erro ao atualizar status da sessão:', error);
		res.status(500).json({ message: 'Erro ao atualizar status da sessão.' });
	}
};

