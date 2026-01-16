// src/controllers/feedbackController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createFeedback = async (req: Request, res: Response) => {
	const { rating, description, anonymous } = req.body as {
		rating?: unknown;
		description?: unknown;
		anonymous?: unknown;
	};

	const parsedRating = Number(rating);
	const parsedAnonymous = Boolean(anonymous);

	if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
		res.status(400).json({ message: 'Rating inválido. Use um valor entre 1 e 5.' });
		return;
	}

	if (typeof description !== 'string' || description.trim().length === 0) {
		res.status(400).json({ message: 'Descrição é obrigatória.' });
		return;
	}

	try {
		const feedback = await prisma.feedback.create({
			data: {
				rating: parsedRating,
				description: description.trim(),
				anonymous: parsedAnonymous,
				userId: parsedAnonymous ? null : req.user.id,
			},
		});

		res.status(201).json({ id: feedback.id });
	} catch (error) {
		console.error('Erro ao registrar feedback:', error);
		res.status(500).json({ message: 'Erro ao registrar feedback.' });
	}
};
