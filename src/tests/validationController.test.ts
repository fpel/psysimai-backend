import request from 'supertest';
import app from '../index';
import jwt from 'jsonwebtoken';
import { seedTestData } from './utils/testSeed';

process.env.JWT_SECRET = 'test-secret';

let promptId = '';
let userId = '';
let sessionId = '';
let token = '';

describe('Validation routes', () => {
	beforeAll(async () => {
		const data = await seedTestData();
		promptId = data.promptId;
		userId = data.userId;
		sessionId = data.sessionId;
		if (!process.env.JWT_SECRET) {
			throw new Error('JWT_SECRET is not defined');
		}
		token = jwt.sign({ userId }, process.env.JWT_SECRET);
	});

	it('should validate therapist response', async () => {
		const response = await request(app)
			.post('/validate')
			.set('Authorization', `Bearer ${token}`)
			.send({ promptId, sessionId, therapistResponse: 'Como você tem lidado com essa ansiedade?' });

		expect([200, 201]).toContain(response.status);
		expect(response.body).toHaveProperty('isValid');
		expect(response.body).toHaveProperty('feedback');
	});

	it('should fail when missing fields', async () => {
		const response = await request(app)
			.post('/validate')
			.set('Authorization', `Bearer ${token}`)
			.send({});

		expect(response.status).toBe(400);
		expect(response.body.feedback).toBe('Resposta vazia ou inválida.');
	});
});
