// src/services/openaiService.ts
import { OpenAI } from 'openai';
import fs from 'fs';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY, // coloque sua chave no .env
});

export async function getChatCompletion(prompt: string) {
	// console.log('[OpenAI] Iniciando getChatCompletion');
	const start = Date.now();
	try {
		// 1) Loga o prompt para depuração
		console.log('[OpenAI] Enviando para API:', JSON.stringify({
			model: 'gpt-4o', // ou 'gpt-4-turbo', ou o modelo que preferir
			messages: [
				{ role: "system", "content": "Você é um avaliador especializado em Terapia Cognitivo-Comportamental (TCC). Sua tarefa é avaliar se uma resposta de terapeuta cumpre todos os critérios técnicos esperados. Responda **exclusivamente** com JSON puro, sem formatação, sem blocos de código e sem explicações externas. Use estritamente o formato:\n\n{\"isValid\": boolean, \"score\": number, \"feedback\": \"texto breve, gentil e profissional\"}\n\nA avaliação deve seguir os critérios fornecidos pelo usuário. Só considere a resposta válida se **TODOS** os critérios forem integralmente atendidos. Respostas **metalinguísticas, de teste, ou que não se dirigem ao paciente** devem ser classificadas com **\"isValid\": false** e **\"score\": 0**. Seja técnico, imparcial e preciso." },
				{ role: 'user', content: prompt },
			],
			temperature: 0.4, 
		}));

		const response = await openai.chat.completions.create({
			model: 'gpt-4o', // ou 'gpt-4-turbo', ou o modelo que preferir
			messages: [
				{ role: "system", "content": "Você é um avaliador especializado em Terapia Cognitivo-Comportamental (TCC). Sua tarefa é avaliar se uma resposta de terapeuta cumpre todos os critérios técnicos esperados. Responda **exclusivamente** com JSON puro, sem formatação, sem blocos de código e sem explicações externas. Use estritamente o formato:\n\n{\"isValid\": boolean, \"score\": number, \"feedback\": \"texto breve, gentil e profissional\"}\n\nA avaliação deve seguir os critérios fornecidos pelo usuário. Só considere a resposta válida se **TODOS** os critérios forem integralmente atendidos. Respostas **metalinguísticas, de teste, ou que não se dirigem ao paciente** devem ser classificadas com **\"isValid\": false** e **\"score\": 0**. Seja técnico, imparcial e preciso." },
				{ role: 'user', content: prompt },
			],
			temperature: 0.4, 
		});

		// 2) Loga o objeto inteiro pra inspecionar se choices existe
		console.log('[OpenAI] full response:', JSON.stringify(response));

		// 3) Verifica se choices e message.content estão definidos
		const content = response.choices?.[0]?.message?.content;
		if (!content) {
			throw new Error('OpenAI retornou sem `message.content`.');
		}
		const duration = Date.now() - start;
		// console.log(`[OpenAI] getChatCompletion finalizado em ${duration}ms`);
		return content;
		// return response.choices[0].message.content;

	} catch (error) {
		console.error('[OpenAI] Erro ao chamar a API:', error);
		throw new Error('Erro na chamada à API da OpenAI.');
	}

}

export async function transcribeAudio(filePath: string): Promise<string> {
	// console.log(`[OpenAI] Iniciando transcrição de áudio: ${filePath}`);
	const start = Date.now();

	const transcription = await openai.audio.transcriptions.create({
		file: fs.createReadStream(filePath),
		model: 'whisper-1',
		language: 'pt',
	});

	const duration = Date.now() - start;
	// console.log(`[OpenAI] Transcrição finalizada em ${duration}ms`);

	return transcription.text;
}


export async function generateAudioFeedback(text: string): Promise<Buffer> {
	const tts = await openai.audio.speech.create({
		model: 'tts-1',
		voice: 'nova',
		input: text,
	});

	return Buffer.from(await tts.arrayBuffer());
}