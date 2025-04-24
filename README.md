# PsySimAI

PsySimAI é uma aplicação interativa que simula o treinamento de terapeutas em práticas de psicoterapia cognitivo-comportamental (TCC). A IA apresenta situações clínicas e avalia a resposta do terapeuta, oferecendo feedback imediato. O progresso é acompanhado por níveis de dificuldade e categorias de habilidade.

## Tecnologias Utilizadas
- Node.js + Express (backend)
- TypeScript
- Prisma ORM
- PostgreSQL
- React + Vite (frontend)
- TailwindCSS
- Docker + Docker Compose
- JWT para autenticação
- Jest + Supertest para testes automatizados

## Requisitos
- Node.js 18+
- Docker + Docker Compose

## Como rodar o projeto localmente

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/psysimai.git
cd psysimai
```

### 2. Suba o banco de dados com Docker
```bash
docker-compose up -d
```

### 3. Configure o ambiente
Crie um arquivo `.env` com base no `.env.example`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/psysimai
JWT_SECRET=suasecret
```

### 4. Rode as migrations e o seed
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Rode o backend
```bash
cd psysimai-backend
npm install
npm run dev
```

### 6. Rode o frontend
```bash
cd psysimai-frontend
npm install
npm run dev
```

## Executando os testes
Crie um `.env.test` com URL de banco de testes e JWT de teste:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/psysimai_test
JWT_SECRET=testsecret
```

Para rodar os testes:
```bash
npm run test
```

## Estrutura de Pastas
```
psysimai/
├── psysimai-backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── prisma/
│   │   └── tests/
│   ├── prisma/
│   │   └── schema.prisma
│   └── .env
├── psysimai-frontend/
│   ├── src/pages/
│   └── src/services/
├── docker-compose.yml
└── README.md
```

## Funcionalidades implementadas
- Login com autenticação JWT
- Criação de sessões com prompts da IA
- Avaliação da resposta do terapeuta com feedback
- Progresso do terapeuta com desbloqueio de níveis
- Painel de dashboard (em andamento)

## Roadmap
- [ ] Visualização de histórico de sessões
- [ ] Exportação de resultados
- [ ] Painel do administrador para editar prompts e respostas esperadas
- [ ] Suporte a diferentes idiomas

