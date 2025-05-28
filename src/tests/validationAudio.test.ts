// tests/validationAudio.test.ts
import request from 'supertest';
import app from '../index';
import path from 'path';

jest.mock('../services/openaiService', () => ({
	transcribeAudio: jest.fn(() => Promise.resolve('resposta transcrita')),
	getChatCompletion: jest.fn(() => Promise.resolve(JSON.stringify({
		isValid: true,
		score: 90,
		feedback: 'Muito bom, continue assim!'
	}))),
	generateAudioFeedback: jest.fn(() => Promise.resolve(Buffer.from('fake audio')))
}));

jest.mock('@prisma/client', () => {
	const original = jest.requireActual('@prisma/client');
	return {
		PrismaClient: jest.fn(() => ({
			session: {
				findUnique: jest.fn(() => Promise.resolve({ promptId: 'mock-prompt-id' }))
			},
			expectedResponse: {
				findMany: jest.fn(() => Promise.resolve([{ text: 'Comportamento esperado 1' }]))
			},
			configuracao: {
				findFirst: jest.fn(() => Promise.resolve({
					criteriosAvaliacao: 'Critério 1',
					feedback: 'Feedback instrução'
				}))
			},
			message: {
				create: jest.fn(() => Promise.resolve())
			}
		})),
		...original
	};
});

describe('POST /api/validation/audio-response', () => {
	it('should return validation and audio feedback', async () => {
		const audioPath = path.join(__dirname, 'mock_audio.mp3');
		const res = await request(app)
			.post('/api/validation/audio-response')
			.set('Authorization', 'Bearer testtoken')
			.field('sessionId', 'mock-session-id')
			.attach('audio', audioPath);

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('isValid', true);
		expect(res.body).toHaveProperty('score', 90);
		expect(res.body).toHaveProperty('feedback');
		expect(res.body).toHaveProperty('audioFeedback');
	});
});