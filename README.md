// README.md atualizado com instruções de deploy e execução

# PsySimAI Backend

Plataforma para prática deliberada em TCC com IA.

## Requisitos
- Node.js 18+
- Docker e Docker Compose

---

## 🚀 Rodando localmente

```bash
# Instale dependências
npm install

# Suba o banco de dados
docker-compose up -d db

# Gere o client do Prisma
npx prisma generate

# Rode as migrations
npx prisma migrate dev --name init

# Popule o banco com dados fictícios
npm run seed

# Inicie o servidor local
npm run dev
```

O backend estará disponível em:
```
http://localhost:3000
```

---

## 🚀 Fazendo o Deploy (ex: Railway, Render, Fly.io)

### 1. Crie o banco de dados na plataforma de sua escolha
- Obtenha a `DATABASE_URL` da instância do PostgreSQL

### 2. Configure o repositório no GitHub (caso não esteja)
- Suba o projeto para um repositório público ou privado

### 3. Configure variáveis de ambiente
Na plataforma de deploy, adicione:
```
DATABASE_URL=<sua_string_de_conexão_postgres>
```

### 4. Build e Deploy
- Se estiver usando Docker, a plataforma detecta o `Dockerfile`
- Se estiver usando Node.js direto, configure:
  - Build: `npm run build`
  - Start: `npm start`

---

## ✅ Testes

```bash
# Execute os testes unitários
npm test
```

---

## 📂 Estrutura principal

```
prisma/               → schema.prisma e seed
src/
├── controllers/      → lógica das rotas
├── routes/           → endpoints express
├── tests/            → testes com Jest
├── index.ts          → entry point
```

---

## 📦 Scripts úteis

```json
"scripts": {
  "dev": "ts-node-dev src/index.ts",
  "build": "tsc",
  "start": "node build/index.js",
  "test": "jest",
  "lint": "eslint .",
  "prisma": "prisma generate",
  "seed": "ts-node prisma/seed.ts"
}
```

---

Tudo pronto para codar, testar e evoluir!
Se quiser, siga para a criação do frontend ou integração com a OpenAI.
