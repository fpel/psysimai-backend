// tests/progressController.test.ts
import request from 'supertest';
import app from '../index';
import jwt from 'jsonwebtoken';
import { seedTestData } from './utils/testSeed';

process.env.JWT_SECRET = 'test-secret';

let userId = '';
let token = '';

let difficultyLevelId = '';

describe('Progress Controller', () => {
	beforeAll(async () => {
		const data = await seedTestData();
		userId = data.userId;
		difficultyLevelId = 'difficulty-level-test';
		if (!process.env.JWT_SECRET) {
			throw new Error('JWT_SECRET is not defined');
		}
		token = jwt.sign({ userId }, process.env.JWT_SECRET);
	});

	it('should save progress successfully', async () => {
		const response = await request(app)
			.post('/progress')
			.set('Authorization', `Bearer ${token}`)
			.send({ userId, difficultyLevelId });

		expect([200, 201]).toContain(response.status);
		expect(response.body.message).toBe('Progresso salvo com sucesso.');
	});

	it('should return user progress list', async () => {
		const response = await request(app)
			.get(`/progress/${userId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(Array.isArray(response.body)).toBe(true);
	});
});
