// src/controllers/validationController.ts
import { Request, Response } from 'express';
import { getChatCompletion } from '../services/openaiService';
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


export const validateResponseAI = async (req: Request, res: Response) => {
	const { therapistResponse, expectedBehavior } = req.body;

	try {
		const prompt = `Você é um avaliador de respostas de terapia cognitivo-comportamental.

		Analise a resposta do terapeuta com base no comportamento esperado abaixo.
		
		Responda no seguinte formato:
		
		Correção: [texto explicativo se a resposta está correta ou o que poderia melhorar]
		Nota: [número de 0 a 10, onde 10 é uma resposta perfeita]
		
		Resposta do terapeuta:
		"${therapistResponse}"
		
		Comportamento esperado:
		"${expectedBehavior}"
		
		Seja objetivo, gentil e profissional.`;

		console.log('Prompt enviado para IA:', prompt);

		const aiFeedback = await getChatCompletion(prompt);

		res.status(200).json({ feedback: aiFeedback });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Erro ao validar com IA.' });
	}
};