// src/controllers/validationController.ts
import { Request, Response } from 'express';
import { getChatCompletion } from '../services/openaiService';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//Essa funcao nao esta sendo usada
// export const validateResponse = async (req: Request, res: Response) => {
// 	const { promptId, therapistResponse } = req.body;

// 	const expected = await prisma.expectedResponse.findMany({
// 		where: { promptId },
// 	});

// 	if (!therapistResponse) {
// 		res.status(400).json({
// 			isValid: false,
// 			feedback: 'Resposta vazia ou inválida.'
// 		});
// 		return;
// 	}

// 	const expectedTexts = expected.map(e => e.text.toLowerCase());
// 	const match = expectedTexts.some(text => therapistResponse.toLowerCase().includes(text));

// 	const feedback = match
// 		? 'Resposta adequada. Muito bem!'
// 		: 'A resposta não corresponde ao esperado. Tente novamente.';

// 	res.status(200).json({ isValid: match, feedback });
// 	return;
// };


export const validateResponseAI = async (req: Request, res: Response) => {
	const { therapistResponse, sessionId } = req.body;

	try {

		// 1. Busca a sessão pra extrair o promptId
		const session = await prisma.session.findUnique({
			where: { id: sessionId },
			select: { promptId: true }
		});

		if (!session) {
			res.status(404).json({
				error: 'Sessão não encontrada para este sessionId.'
			});
			return;
		}
		const promptId = session.promptId;

		// 2. Busca os comportamentos esperados
		const expected = await prisma.expectedResponse.findMany({
			where: { promptId }
		});

		if (expected.length === 0) {
			res.status(404).json({
				error: 'Nenhuma resposta esperada encontrada para este prompt.'
			});
			return;
		}

		// 3. Monta lista numerada de expected texts
		const expectedList = expected
			.map((e, i) => `${i + 1}. ${e.text}`)
			.join('\n');

		// 4. Constroi o prompt para a IA
		const prompt = `
			Você é um avaliador de respostas de terapia cognitivo-comportamental.
			Analise a resposta do terapeuta abaixo e compare com os comportamentos esperados.

			Resposta do terapeuta:
			"${therapistResponse}"

			Comportamentos esperados:
			${expectedList}

			Critérios de avaliação:
			Validar a experiência do paciente.
			Explicar a lógica de como a TCC pode ser utilizada para abordar as preocupações.
			Promover esperança quanto ao uso eficaz da TCC.
			Estabelecer expectativas adequadas sobre a natureza e o impacto da TCC.

			Forneça um feedback mais rigoroso e um percentual de adequação, só considerar a resposta adequada quando cumpriu todos os critérios acima.

			Responda **apenas** com JSON puro, **sem** formatação Markdown ou blocos de código, assim:
			{"isValid": boolean, "score": number, "feedback": "texto breve, gentil e profissional"}

			`;

		// console.log('Prompt enviado para IA:', prompt);

		const aiFeedback = await getChatCompletion(prompt);
		const ai = JSON.parse(aiFeedback);

		//Grava o historico da mensagem
		await prisma.message.create({
			data: {
				sessionId: sessionId,
				sender: 'therapist',
				content: therapistResponse,
				isValid: ai.isValid,
				feedback: ai.feedback,
				score: ai.score,
				timestamp: new Date(),
			},
		});



		res.status(200).json(ai);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Erro ao validar com IA.' });
	}
};