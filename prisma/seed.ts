// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
	// Limpeza da base antes de popular
	await prisma.message.deleteMany()
	await prisma.session.deleteMany()
	await prisma.expectedResponse.deleteMany()
	await prisma.prompt.deleteMany()
	await prisma.config.deleteMany()
	await prisma.user.deleteMany()
	await prisma.skillCategory.deleteMany()
	await prisma.difficultyLevel.deleteMany()

	// Criação de categorias e níveis
	const skill = await prisma.skillCategory.create({
		data: {
			name: 'Formulação de Perguntas',
			description: 'Habilidade de investigar e explorar com perguntas adequadas'
		}
	})

	const level = await prisma.difficultyLevel.create({
		data: {
			name: 'Iniciante',
			description: 'Começando a formular perguntas exploratórias',
			order: 1
		}
	})

	// Criação do usuário padrão
	const user = await prisma.user.upsert({
		where: { email: 'terapeuta@psysimai.com' },
		update: {},
		create: {
			name: 'Terapeuta Padrão',
			email: 'terapeuta@psysimai.com',
			password: 'senha123'
		}
	})

	// Criação de configuração vinculada a skillCategory e difficultyLevel
	const config = await prisma.config.create({
		data: {
			userId: user.id,
			name: 'Paciente: Ansiedade Leve',
			skillCategoryId: skill.id,
			difficultyLevelId: level.id,
			createdAt: new Date()
		}
	})

	// Prompts e respostas esperadas
	const prompt1 = await prisma.prompt.create({
		data: {
			configId: config.id,
			text: 'Tenho sentido um aperto no peito, principalmente à noite.',
			order: 1
		}
	})

	await prisma.expectedResponse.createMany({
		data: [
			{ promptId: prompt1.id, text: 'Você tem notado algum padrão nesses episódios?' },
			{ promptId: prompt1.id, text: 'Quando começou a perceber esse aperto?' },
			{ promptId: prompt1.id, text: 'Esse aperto te lembra alguma situação específica?' }
		]
	})

	const prompt2 = await prisma.prompt.create({
		data: {
			configId: config.id,
			text: 'Às vezes, minha mente corre tão rápido que não consigo dormir.',
			order: 2
		}
	})

	await prisma.expectedResponse.createMany({
		data: [
			{ promptId: prompt2.id, text: 'Você poderia me dizer sobre o que geralmente pensa nessas horas?' },
			{ promptId: prompt2.id, text: 'Isso acontece com frequência ou em momentos específicos?' },
			{ promptId: prompt2.id, text: 'Já tentou algo para acalmar a mente nesses momentos?' }
		]
	})

	console.log('Seed atualizado com foco no terapeuta formulando perguntas.')
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
