// tests/session.test.ts
import request from 'supertest';
import app from '../index';
import jwt from 'jsonwebtoken';
import { seedTestData } from './utils/testSeed';
import { PrismaClient } from '@prisma/client';

process.env.JWT_SECRET = 'test-secret';
const prisma = new PrismaClient();

let userId = '';
let configId = '';
let token = '';

describe('Session routes', () => {
	beforeAll(async () => {
		const data = await seedTestData();
		userId = data.userId;
		configId = data.configId;

		if (!process.env.JWT_SECRET) {
			throw new Error('JWT_SECRET is not defined');
		}

		token = jwt.sign({ userId }, process.env.JWT_SECRET);
	});

	afterAll(async () => {
		await prisma.message.deleteMany();
		await prisma.session.deleteMany();
		await prisma.expectedResponse.deleteMany();
		await prisma.prompt.deleteMany();
		await prisma.config.deleteMany();
		await prisma.difficultyLevel.deleteMany();
		await prisma.skillCategory.deleteMany();
		await prisma.user.deleteMany();
		await prisma.$disconnect();
	});

	it('should create a session', async () => {
		const response = await request(app)
			.post('/sessions')
			.set('Authorization', `Bearer ${token}`)
			.send({ userId, configId });

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty('id');
		expect(response.body.userId).toBe(userId);
		expect(response.body.configId).toBe(configId);
	}, 10000);

	it('should return 400 if data is missing', async () => {
		const response = await request(app)
			.post('/sessions')
			.set('Authorization', `Bearer ${token}`)
			.send({});

		expect(response.status).toBe(400);
		expect(response.body.message).toBe('userId ou configId ausente');
	});
});
