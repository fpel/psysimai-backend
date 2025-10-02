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
docker compose up -d
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


## Configuração de Limite de Upload no Nginx

Se você utiliza Nginx como proxy reverso para o backend, é importante aumentar o limite de upload para aceitar arquivos de áudio grandes (ex: até 50MB). Adicione a seguinte linha no bloco http, server ou location do seu arquivo de configuração do Nginx (nginx.conf):

```
client_max_body_size 50M;
```

Após alterar, reinicie o serviço do Nginx:

```
sudo systemctl restart nginx
```

Isso evita o erro 413 (Request Entity Too Large) ao enviar áudios grandes para a API.

## Diagrama de Fluxo das Rotas e Funções do Backend

```text
validationRoutes.ts
├── POST /validate-response
│   └── validationController.validateResponseAI
│       └── avaliarResposta (busca sessão, estímulo, respostas esperadas, monta prompt)
│           └── openaiService.getChatCompletion
│       └── Salva mensagem (prisma)
│       └── Retorna resposta da IA
├── POST /audio-response
│   └── validationController.validateAudioResponse
│       └── openaiService.transcribeAudio
│       └── avaliarResposta (busca sessão, estímulo, respostas esperadas, monta prompt)
│           └── openaiService.getChatCompletion
│       └── Salva mensagem (prisma)
│       └── openaiService.generateAudioFeedback
│       └── Retorna resposta da IA + áudio do feedback
├── POST /validate-custom
│   └── validationController.validateCustomStimulus
│       └── (se multipart e houver áudio) openaiService.transcribeAudio
│       └── openaiService.getChatCompletion
│       └── Retorna resposta da IA + resposta transcrita/texto

estimuloRoutes.ts
├── GET /estimulos
│   └── estimuloController.getAllEstimulos → Busca estímulos (prisma)
├── GET /estimulos/:id
│   └── estimuloController.getEstimuloById → Busca estímulo por ID (prisma)
├── PUT /estimulos/:id
│   └── estimuloController.updateEstimulo → Atualiza estímulo (prisma)
├── GET /estimulos/usuario/:userId
│   └── estimuloController.getEstimulosByUser → Busca estímulos do usuário (prisma)

sessionRoutes.ts
├── POST /sessions
│   └── sessionController.createSession → Cria sessão (prisma)
├── GET /sessions/:id
│   └── sessionController.getSessionById → Busca sessão (prisma)
├── GET /sessions/usuario/:userId
│   └── sessionController.getSessionsByUser → Busca sessões do usuário (prisma)

authRoutes.ts
├── POST /login
│   └── authController.login → Busca usuário (prisma), valida senha, gera JWT
├── POST /register
│   └── authController.register → Cria usuário (prisma)

difficultyLevelRoutes.ts
├── GET /difficulty-levels
│   └── difficultyLevelController.getAllDifficultyLevels → Busca níveis (prisma)

messageRoutes.ts
├── GET /messages/session/:sessionId
│   └── messageController.getMessagesBySession → Busca mensagens da sessão (prisma)

openaiRoutes.ts
├── POST /openai/tts
│   └── openaiController.textToSpeech → openaiService.textToSpeech
```

> Todas as rotas protegidas usam o middleware de autenticação JWT.
> Upload de arquivos usa o middleware de upload (multer).
> Todas as integrações com IA estão em `services/openaiService.ts`.
> Todas as operações de banco usam Prisma.

