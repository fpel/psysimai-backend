// src/controllers/validationController.ts
import { Request, Response } from 'express';
import { getChatCompletion, transcribeAudio, generateAudioFeedback } from '../services/openaiService';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';

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


// Função utilitária para montar prompt e buscar feedback da IA
async function avaliarResposta({
	resposta, sessionId, isAudio = false
}: {
	resposta: string;
	sessionId: string;
	isAudio?: boolean;
}) {
	// 1. Busca a sessão pra extrair o estimuloId e já traz o estimulo com categorias
	const session = await prisma.session.findUnique({
		where: { id: sessionId },
		select: {
			estimuloId: true,
			estimulo: {
				select: {
					id: true,
					criteriosAvaliacao: true,
					feedback: true,
				}
			}
		}
	});
	if (!session) throw new Error('Sessão não encontrada para este sessionId.');
	const estimuloId = session.estimuloId;
	const estimulo = session.estimulo;

	// 2. Busca os comportamentos esperados
	const expected = await prisma.expectedResponse.findMany({ where: { estimuloId } });
	if (expected.length === 0) throw new Error('Nenhuma resposta esperada encontrada para este estímulo.');
	const expectedList = expected.map((e, i) => `${i + 1}. ${e.text}`).join('\n');

	// 3. Busca critérios e feedback do estímulo
	const criteriosAvaliacao = estimulo.criteriosAvaliacao || `Critérios de avaliação:\n- Validar a experiência do paciente.\n- Explicar a lógica de como a TCC pode ser utilizada para abordar as preocupações.\n- Promover esperança quanto ao uso eficaz da TCC.\n- Estabelecer expectativas adequadas sobre a natureza e o impacto da TCC.`;
	const feedbackInstrucao = estimulo.feedback || 'Forneça um feedback mais rigoroso e um percentual de adequação, só considerar a resposta adequada quando cumpriu todos os critérios acima.';

	// 4. Constroi o prompt para a IA
	const prompt = `\n\tResposta do terapeuta:\n\t"${resposta}"\n\n\tComportamentos esperados:\n\t${expectedList}\n\n\t${criteriosAvaliacao}\n\n\t${feedbackInstrucao}`;

	// 5. Chama a IA
	const aiFeedback = await getChatCompletion(prompt);
	const raw = aiFeedback.trim().replace(/^```json\s*/, '').replace(/```$/, '');
	const ai = JSON.parse(raw);
	return { ai, prompt, expectedList };
}

export const validateResponseAI = async (req: Request, res: Response) => {
	const { therapistResponse, sessionId } = req.body;

	try {
		const { ai } = await avaliarResposta({ resposta: therapistResponse, sessionId });

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
	} catch (error: any) {
		console.error(error);
		res.status(500).json({ error: error.message || 'Erro ao validar com IA.' });
	}
};

export const validateAudioResponse = async (req: Request, res: Response) => {
	const file = (req as any).file as Express.Multer.File;
	const { sessionId } = req.body;

	if (!file || !sessionId) {
		res.status(400).json({ message: 'Áudio ou sessionId ausente.' });
		return;
	}

	try {
		const therapistResponse = await transcribeAudio(file.path);
		const { ai } = await avaliarResposta({ resposta: therapistResponse, sessionId, isAudio: true });

		await prisma.message.create({
			data: {
				sessionId,
				sender: 'therapist',
				content: '[Resposta em áudio]',
				transcription: therapistResponse,
				isValid: ai.isValid,
				feedback: ai.feedback,
				score: ai.score,
				timestamp: new Date(),
			},
		});

		const audioBuffer = await generateAudioFeedback(ai.feedback);

		await fs.unlink(file.path);

		res.status(200).json({
			isValid: ai.isValid,
			score: ai.score,
			feedback: ai.feedback,
			transcription: therapistResponse,
			audioFeedback: audioBuffer.toString('base64'),
		});
		return;
	} catch (error: any) {
		console.error('Erro ao validar áudio:', error);
		res.status(500).json({ message: error.message || 'Erro ao processar áudio.' });
		return;
	}
};

