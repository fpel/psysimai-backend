import request from 'supertest';
import express from 'express';
import validationRoutes from '../routes/validationRoutes';

const app = express();
app.use(express.json());
app.use('/validate', validationRoutes);

describe('Validation routes', () => {
  it('should validate therapist response', async () => {
    const response = await request(app)
      .post('/validate')
      .send({ promptId: 'mock-prompt-id', therapistResponse: 'exemplo de resposta' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('isValid');
    expect(response.body).toHaveProperty('feedback');
  });
});
