import request from 'supertest';
import express from 'express';
import sessionRoutes from '../routes/sessionRoutes';
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(express.json());
app.use('/sessions', sessionRoutes);

const prisma = new PrismaClient();
let userId: string;
let configId: string;

beforeAll(async () => {
	const user = await prisma.user.create({
		data: {
			name: 'Test User',
			email: 'test@example.com',
			password: '123456'
		}
	});

	const config = await prisma.config.create({
		data: {
			userId: user.id,
			name: 'Config Test'
		}
	});

	userId = user.id;
	configId = config.id;
});

afterAll(async () => {
	await prisma.session.deleteMany();
	await prisma.config.deleteMany();
	await prisma.user.deleteMany();
	await prisma.$disconnect();
});

describe('Session routes', () => {
	it('should create a session', async () => {
		const response = await request(app)
			.post('/sessions')
			.send({ userId, configId });

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty('id');
	});
});
