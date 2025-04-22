// prisma/seed.ts com dados iniciais reais de prompts e respostas esperadas
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
	const skill = await prisma.skillCategory.create({
		data: {
			name: 'Escuta Ativa',
			description: 'Habilidade de ouvir ativamente com empatia e atenção'
		}
	})

	const level = await prisma.difficultyLevel.create({
		data: {
			name: 'Iniciante',
			description: 'Para quem está começando a treinar escuta e acolhimento'
		}
	})

	const user = await prisma.user.upsert({
		where: { email: 'terapeuta@psysimai.com' },
		update: {},
		create: {
			name: 'Terapeuta Padrão',
			email: 'terapeuta@psysimai.com',
			password: 'senha123'
		}
	})

	const config = await prisma.config.create({
		data: {
			userId: user.id,
			name: 'Treinamento Inicial: Escuta Ativa'
		}
	})

	const prompt1 = await prisma.prompt.create({
		data: {
			configId: config.id,
			text: 'Como você tem se sentido ultimamente?',
			order: 1,
			skillCategoryId: skill.id,
			difficultyLevelId: level.id
		}
	})

	await prisma.expectedResponse.createMany({
		data: [
			{ promptId: prompt1.id, text: 'Tenho me sentido sobrecarregado nos últimos dias' },
			{ promptId: prompt1.id, text: 'Estou ansioso e não sei por onde começar' },
			{ promptId: prompt1.id, text: 'Acordar tem sido difícil pra mim' }
		]
	})

	const prompt2 = await prisma.prompt.create({
		data: {
			configId: config.id,
			text: 'Você pode me contar mais sobre o que está dificultando seus dias?',
			order: 2,
			skillCategoryId: skill.id,
			difficultyLevelId: level.id
		}
	})

	await prisma.expectedResponse.createMany({
		data: [
			{ promptId: prompt2.id, text: 'Tenho muita pressão no trabalho e me sinto exausto' },
			{ promptId: prompt2.id, text: 'Estou tendo conflitos com pessoas próximas' },
			{ promptId: prompt2.id, text: 'Não estou conseguindo dormir bem' }
		]
	})

	console.log('Seed de prompts e respostas esperadas finalizado com sucesso!')
}

main().finally(async () => {
	await prisma.$disconnect()
})
