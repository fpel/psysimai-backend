import request from 'supertest';
import app from '../src/index';
import jwt from 'jsonwebtoken';

describe('GET /api/skills', () => {
  let token: string;

  beforeAll(() => {
    // Gera um token JWT válido para testes (ajuste a secret se necessário)
    token = jwt.sign({ userId: 'test-user', email: 'test@example.com' }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
  });

  it('deve retornar 200 e um array de habilidades com autenticação', async () => {
    const res = await request(app)
      .get('/api/skills')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('description');
      // 'title' pode ser null
      expect(res.body[0]).toHaveProperty('title');
    }
  });

  it('deve retornar 401 sem autenticação', async () => {
    const res = await request(app).get('/api/skills');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/skills', () => {
  let token: string;
  beforeAll(() => {
    token = jwt.sign({ userId: 'test-user', email: 'test@example.com' }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
  });

  it('deve criar uma nova habilidade com sucesso', async () => {
    const res = await request(app)
      .post('/api/skills')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Nova Skill Teste', description: 'Descrição teste' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Nova Skill Teste');
    expect(res.body.description).toBe('Descrição teste');
  });

  it('deve retornar 400 se o título não for enviado', async () => {
    const res = await request(app)
      .post('/api/skills')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Sem título' });
    expect(res.status).toBe(400);
  });

  it('deve retornar 401 sem autenticação', async () => {
    const res = await request(app)
      .post('/api/skills')
      .send({ title: 'Skill sem auth' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/skills/:id', () => {
  let token: string;
  let createdSkillId: string;

  beforeAll(async () => {
    token = jwt.sign({ userId: 'test-user', email: 'test@example.com' }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
    // Cria uma skill para testar a busca por ID
    const res = await request(app)
      .post('/api/skills')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Skill para GET por ID', description: 'Descrição para GET por ID' });
    createdSkillId = res.body.id;
  });

  it('deve retornar 200 e a skill correta com autenticação', async () => {
    const res = await request(app)
      .get(`/api/skills/${createdSkillId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', createdSkillId);
    expect(res.body).toHaveProperty('title', 'Skill para GET por ID');
    expect(res.body).toHaveProperty('description', 'Descrição para GET por ID');
  });

  it('deve retornar 404 para skill inexistente', async () => {
    const res = await request(app)
      .get('/api/skills/nao-existe-id')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it('deve retornar 401 sem autenticação', async () => {
    const res = await request(app).get(`/api/skills/${createdSkillId}`);
    expect(res.status).toBe(401);
  });
});

describe('PUT /api/skills/:id', () => {
  let token: string;
  let createdSkillId: string;

  beforeAll(async () => {
    token = jwt.sign({ userId: 'test-user', email: 'test@example.com' }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
    // Cria uma skill para testar a atualização
    const res = await request(app)
      .post('/api/skills')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Skill para PUT', description: 'Descrição PUT' });
    createdSkillId = res.body.id;
  });

  it('deve atualizar a skill com sucesso', async () => {
    const res = await request(app)
      .put(`/api/skills/${createdSkillId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Skill Atualizada', description: 'Nova descrição' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', createdSkillId);
    expect(res.body).toHaveProperty('title', 'Skill Atualizada');
    expect(res.body).toHaveProperty('description', 'Nova descrição');
  });

  it('deve retornar 404 para skill inexistente', async () => {
    const res = await request(app)
      .put('/api/skills/nao-existe-id')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Qualquer', description: 'Qualquer' });
    expect(res.status).toBe(404);
  });

  it('deve retornar 400 se faltar título', async () => {
    const res = await request(app)
      .put(`/api/skills/${createdSkillId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Sem título' });
    expect(res.status).toBe(400);
  });

  it('deve retornar 401 sem autenticação', async () => {
    const res = await request(app)
      .put(`/api/skills/${createdSkillId}`)
      .send({ title: 'Sem auth', description: 'Sem auth' });
    expect(res.status).toBe(401);
  });
});

describe('PATCH /api/skills/:id', () => {
  let token: string;
  let createdSkillId: string;
  let userName = 'Usuário Teste';
  let userEmail = 'test@example.com';

  beforeAll(async () => {
    token = jwt.sign({ userId: 'test-user', email: userEmail, name: userName }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
    // Cria uma skill para testar a exclusão lógica
    const res = await request(app)
      .post('/api/skills')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Skill para PATCH', description: 'Descrição PATCH' });
    createdSkillId = res.body.id;
  });

  it('deve marcar a skill como deleted, salvar deletedBy e deletedAt', async () => {
    const res = await request(app)
      .patch(`/api/skills/${createdSkillId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'deleted' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', createdSkillId);
    expect(res.body).toHaveProperty('status', 'deleted');
    expect(res.body).toHaveProperty('deletedBy');
    expect(res.body.deletedBy === userName || res.body.deletedBy === userEmail).toBe(true);
    expect(res.body).toHaveProperty('deletedAt');
    expect(new Date(res.body.deletedAt).getTime()).not.toBeNaN();
  });

  it('deve retornar 400 se status não for enviado', async () => {
    const res = await request(app)
      .patch(`/api/skills/${createdSkillId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
  });

  it('deve retornar 404 para skill inexistente', async () => {
    const res = await request(app)
      .patch('/api/skills/nao-existe-id')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'deleted' });
    expect(res.status).toBe(404);
  });

  it('deve retornar 401 sem autenticação', async () => {
    const res = await request(app)
      .patch(`/api/skills/${createdSkillId}`)
      .send({ status: 'deleted' });
    expect(res.status).toBe(401);
  });
});
