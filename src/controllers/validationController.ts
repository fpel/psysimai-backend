import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const validateResponse = async (req: Request, res: Response) => {
	const { promptId, therapistResponse } = req.body;

	const expected = await prisma.expectedResponse.findMany({
		where: { promptId },
	});

	if (!therapistResponse) {
		res.status(400).json({
			isValid: false,
			feedback: 'Resposta vazia ou inválida.'
		});
		return;
	}

	const expectedTexts = expected.map(e => e.text.toLowerCase());
	const match = expectedTexts.some(text => therapistResponse.toLowerCase().includes(text));

	const feedback = match
		? 'Resposta adequada. Muito bem!'
		: 'A resposta não corresponde ao esperado. Tente novamente.';

	res.status(200).json({ isValid: match, feedback });
	return;
};
