import { Request, Response } from 'express';
import { generateAudioFeedback } from '../services/openaiService';

export const textToSpeech = async (req: Request, res: Response) => {
	const { text } = req.body;

	if (!text || typeof text !== 'string') {
		res.status(400).json({ message: 'Texto ausente ou inválido.' });
		return;
	}

	try {
		const audioBuffer = await generateAudioFeedback(text);
		const audioBase64 = audioBuffer.toString('base64');

		res.status(200).json({ audio: audioBase64 });
	} catch (error) {
		console.error('Erro ao gerar áudio:', error);
		res.status(500).json({ message: 'Erro ao gerar áudio.' });
	}
};
