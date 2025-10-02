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
	const { estimuloId } = req.body;
	const userId = req.user.id;

	if (!estimuloId) {
		res.status(400).json({ message: 'Campo estimuloId obrigatório ausente' });
		return;
	}

	try {
		const estimulo = await prisma.estimulo.findUnique({
			where: { id: estimuloId },
		});

		if (!estimulo) {
			res.status(404).json({ message: 'Estímulo não encontrado para o ID informado.' });
			return;
		}

		const session = await prisma.session.create({
			data: {
				userId,
				estimuloId: estimulo.id,
				status: 'in_progress',
				startedAt: new Date(),
			},
		});

		await prisma.message.create({
			data: {
				sessionId: session.id,
				sender: 'ia',
				content: estimulo.text,
				timestamp: new Date(),
			},
		});

		// const audioBuffer = await generateAudioFeedback(prompt.text);
		// const audioBase64 = audioBuffer.toString('base64');

		res.status(201).json({
			sessionId: session.id,
			// promptText: prompt.text,
			// promptAudio: audioBase64
		});
	} catch (err) {
		console.error('Erro ao criar sessão:', err);
		res.status(500).json({ message: 'Erro ao criar sessão.' });
		return;
	}
};

export const getSessionHistory = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;

		const sessions = await prisma.session.findMany({
			where: { userId },
			orderBy: { startedAt: 'desc' },
			include: {
				estimulo: {
					include: {
						difficultyLevel: true,
						skillCategory: true,
					},
				},
			},
		});

		const result = sessions.map(session => ({
			id: session.id,
			startedAt: session.startedAt,
			status: session.status || 'in_progress',
			level: session.estimulo.difficultyLevel.name,
			text: session.estimulo.text,
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

export const repeatSession = async (req: Request, res: Response) => {
	const { sessionId } = req.params;
	const userId = req.user.id;

	if (!sessionId) {
		res.status(400).json({ message: 'sessionId ausente' });
		return;
	}

	try {
		const originalSession = await prisma.session.findUnique({
			where: { id: sessionId },
			include: { estimulo: true },
		});

		if (!originalSession) {
			res.status(404).json({ message: 'Sessão original não encontrada.' });
			return;
		}

		const estimuloId = originalSession.estimulo.id;

		const newSession = await prisma.session.create({
			data: {
				userId,
				estimuloId,
				status: 'in_progress',
				startedAt: new Date(),
			},
		});

		await prisma.message.create({
			data: {
				sessionId: newSession.id,
				sender: 'ia',
				content: originalSession.estimulo.text,
				timestamp: new Date(),
			},
		});

		res.status(201).json(newSession);
	} catch (error) {
		console.error('Erro ao repetir sessão:', error);
		res.status(500).json({ message: 'Erro ao repetir sessão.' });
	}
};

// Retorna os IDs dos estímulos já concluídos com sucesso pelo usuário logado
export const getCompletedEstimulos = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;
		const sessions = await prisma.session.findMany({
			where: { userId, status: 'success' },
			select: { estimuloId: true },
		});
		const completedIds = sessions.map(s => s.estimuloId);
		res.status(200).json(completedIds);
	} catch (error) {
		console.error('Erro ao buscar estímulos concluídos:', error);
		res.status(500).json({ message: 'Erro ao buscar estímulos concluídos.' });
	}
};

// Retorna os dados da sessão pelo ID
export const getSessionById = async (req: Request, res: Response) => {
	const { sessionId } = req.params;
	if (!sessionId) {
		res.status(400).json({ message: 'sessionId ausente' });
		return;
	}
	try {
		const session = await prisma.session.findUnique({
			where: { id: sessionId },
			select: {
				id: true,
				userId: true,
				estimuloId: true,
				status: true,
				startedAt: true,
				endedAt: true,
			},
		});
		if (!session) {
			res.status(404).json({ message: 'Sessão não encontrada.' });
			return;
		}
		res.status(200).json(session);
	} catch (error) {
		console.error('Erro ao buscar sessão:', error);
		res.status(500).json({ message: 'Erro ao buscar sessão.' });
	}
};
