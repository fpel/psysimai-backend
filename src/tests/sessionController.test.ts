// tests/sessionController.test.ts
import request from 'supertest';
import app from '../index';
import jwt from 'jsonwebtoken';
import { seedTestData } from './utils/testSeed';

process.env.JWT_SECRET = 'test-secret';

let userId = '';
let configId = '6fdfed5a-8c43-4dc2-a216-aaec4280c827';
let token = '';

describe('Session Controller', () => {
	beforeAll(async () => {
		const data = await seedTestData();
		userId = data.userId;
		if (!process.env.JWT_SECRET) {
			throw new Error('JWT_SECRET is not defined');
		}
		token = jwt.sign({ userId }, process.env.JWT_SECRET);
	});

	it('should create a session', async () => {
		const response = await request(app)
			.post('/sessions')
			.set('Authorization', `Bearer ${token}`)
			.send({
				userId,
				configId
			});

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty('id');
	});

	it('should fail when missing data', async () => {
		const response = await request(app)
			.post('/sessions')
			.set('Authorization', `Bearer ${token}`)
			.send({});

		expect(response.status).toBe(400);
		expect(response.body.message).toBe('userId ou configId ausente');
	});
});
