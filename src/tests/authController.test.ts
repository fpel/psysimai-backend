// tests/authController.test.ts
import request from 'supertest';
import app from '../index';
import { seedTestData } from './utils/testSeed';

describe('Auth Controller', () => {
	beforeAll(async () => {
		await seedTestData();
	});

	it('should return token and user on valid login', async () => {
		const response = await request(app)
			.post('/auth/login')
			.send({ email: 'test@psysimai.com', password: '123456' });

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('user');
		expect(response.body).toHaveProperty('token');
	});

	it('should fail with invalid credentials', async () => {
		const response = await request(app)
			.post('/auth/login')
			.send({ email: 'test@psysimai.com', password: 'senhaerrada' });

		expect(response.status).toBe(401);
		expect(response.body.message).toBe('Credenciais inválidas.');
	});

	it('should return 400 when missing email or password', async () => {
		const response = await request(app)
			.post('/auth/login')
			.send({ email: '' });

		expect(response.status).toBe(400);
		expect(response.body.message).toBe('Email e senha obrigatórios.');
	});
});
