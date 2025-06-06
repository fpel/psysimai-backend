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

		// 4. Busca critérios e feedback da configuração
		const configuracao = await prisma.configuracao.findFirst();
		const criteriosAvaliacao = configuracao?.criteriosAvaliacao || `Critérios de avaliação:\n- Validar a experiência do paciente.\n- Explicar a lógica de como a TCC pode ser utilizada para abordar as preocupações.\n- Promover esperança quanto ao uso eficaz da TCC.\n- Estabelecer expectativas adequadas sobre a natureza e o impacto da TCC.`;
		const feedbackInstrucao = configuracao?.feedback || 'Forneça um feedback mais rigoroso e um percentual de adequação, só considerar a resposta adequada quando cumpriu todos os critérios acima.';

		// ESSE PROMPT FUNCIONA - TROQUEI PARA BUSCAR NA BASE DE DADOS
		// const prompt = `
		// 	Resposta do terapeuta:
		// 	"${therapistResponse}"

		// 	Comportamentos esperados:
		// 	${expectedList}

		// 	Critérios de avaliação:
		// 	- Validar a experiência do paciente.
		// 	- Explicar a lógica de como a TCC pode ser utilizada para abordar as preocupações.
		// 	- Promover esperança quanto ao uso eficaz da TCC.
		// 	- Estabelecer expectativas adequadas sobre a natureza e o impacto da TCC.

		// 	Forneça um feedback mais rigoroso e um percentual de adequação, só considerar a resposta adequada quando cumpriu todos os critérios acima.`;


		// 5. Constroi o prompt para a IA
		const prompt = `\n\tResposta do terapeuta:\n\t"${therapistResponse}"\n\n\tComportamentos esperados:\n\t${expectedList}\n\n\t${criteriosAvaliacao}\n\n\t${feedbackInstrucao}`;

		console.log('Prompt enviado para IA:', prompt);

		const aiFeedback = await getChatCompletion(prompt);
		const raw = aiFeedback.trim()
			.replace(/^```json\s*/, '')
			.replace(/```$/, '')
		const ai = JSON.parse(raw);

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