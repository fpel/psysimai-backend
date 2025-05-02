// src/services/openaiService.ts
import { OpenAI } from 'openai';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY, // coloque sua chave no .env
});

export async function getChatCompletion(prompt: string) {
	const response = await openai.chat.completions.create({
		model: 'gpt-4o', // ou 'gpt-4-turbo', ou o modelo que preferir
		messages: [
			{ role: 'system', content: 'Você é um avaliador de respostas de terapia. Avalie baseado nos critérios técnicos descritos.' },
			{ role: 'user', content: prompt },
		],
		temperature: 0.3, // deixar mais objetivo
	});
	
	// 2) Loga o objeto inteiro pra inspecionar se choices existe
    // console.log('[OpenAI] full response:', JSON.stringify(response, null, 2));

    // 3) Verifica se choices e message.content estão definidos
    const content = response.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('OpenAI retornou sem `message.content`.');
    }

	return content;
	// return response.choices[0].message.content;
}
