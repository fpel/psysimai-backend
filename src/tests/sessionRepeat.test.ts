// tests/sessionRepeat.test.ts
import request from 'supertest';
import app from '../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let token: string;
let originalSessionId: string;

beforeAll(async () => {
	// Autentica e cria token de teste
	const res = await request(app)
		.post('/api/auth/login')
		.send({ email: 'terapeuta@example.com', password: '123456' });

	token = res.body.token;

	// Cria sessão original
	const config = await prisma.config.findFirst({
		include: {
			prompts: true
		}
	});

	const prompt = config?.prompts[0];

	const session = await prisma.session.create({
		data: {
			userId: config?.userId!,
			promptId: prompt!.id,
			status: 'success',
			startedAt: new Date()
		}
	});

	await prisma.message.create({
		data: {
			sessionId: session.id,
			sender: 'ia',
			content: prompt!.text,
			timestamp: new Date()
		}
	});

	originalSessionId = session.id;
});

afterAll(async () => {
	await prisma.message.deleteMany({});
	await prisma.session.deleteMany({});
	await prisma.$disconnect();
});

describe('POST /api/sessions/:sessionId/repeat', () => {
	it('deve criar uma nova sessão com o mesmo prompt da original', async () => {
		const response = await request(app)
			.post(`/api/sessions/${originalSessionId}/repeat`)
			.set('Authorization', `Bearer ${token}`)
			.send();

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty('id');
		expect(response.body).toHaveProperty('promptId');

		// Verifica se promptId é o mesmo da original
		const original = await prisma.session.findUnique({ where: { id: originalSessionId } });
		expect(response.body.promptId).toBe(original?.promptId);

		// Verifica se a primeira mensagem da nova sessão foi criada com mesmo conteúdo
		const messages = await prisma.message.findMany({
			where: { sessionId: response.body.id },
		});
		expect(messages[0].content).toBeDefined();
		expect(messages[0].sender).toBe('ia');
	});
});
