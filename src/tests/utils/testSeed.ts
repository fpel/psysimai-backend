// src/tests/utils/testSeed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedTestData = async () => {
	// Apagar registros na ordem correta por causa das FKs
	await prisma.message.deleteMany();
	await prisma.session.deleteMany();
	await prisma.expectedResponse.deleteMany();
	await prisma.prompt.deleteMany();
	await prisma.progress.deleteMany();
	await prisma.config.deleteMany();
	await prisma.user.deleteMany();
	await prisma.skillCategory.deleteMany();
	await prisma.difficultyLevel.deleteMany();

	// Criar usuário
	const user = await prisma.user.create({
		data: {
			id: 'bf1ed6a8-b7fc-47f1-af45-34380ee82ba1',
			name: 'Test User',
			email: 'test@psysimai.com',
			password: '123456'
		}
	});

	// Criar config
	const config = await prisma.config.create({
		data: {
			id: '6fdfed5a-8c43-4dc2-a216-aaec4280c827',
			name: 'Config Test',
			userId: user.id
		}
	});

	// Criar nível de dificuldade
	const difficulty = await prisma.difficultyLevel.create({
		data: {
			id: 'difficulty-level-test',
			name: 'Iniciante',
			description: 'Nível inicial'
		}
	});

	// Criar categoria de habilidade
	const skillCategory = await prisma.skillCategory.create({
		data: {
			id: 'skill-category-test',
			name: 'Escuta Ativa',
			description: 'Habilidade de escutar o paciente'
		}
	});

	// Criar prompt com resposta esperada
	const prompt = await prisma.prompt.create({
		data: {
			configId: config.id,
			difficultyLevelId: difficulty.id,
			skillCategoryId: skillCategory.id,
			order: 1,
			text: 'Tenho me sentido muito ansioso ultimamente, especialmente antes de dormir.',
			expectedResponses: {
				create: [{ text: 'Como você tem lidado com essa ansiedade?' }]
			}
		}
	});

	// Criar sessão
	const session = await prisma.session.create({
		data: {
			userId: user.id,
			configId: config.id,
			startedAt: new Date()
		}
	});

	return {
		userId: user.id,
		configId: config.id,
		sessionId: session.id,
		promptId: prompt.id,
		difficultyLevelId: difficulty.id
	};
};
