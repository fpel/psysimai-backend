// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
	// Limpeza da base antes de popular
	await prisma.message.deleteMany()
	await prisma.session.deleteMany()
	await prisma.expectedResponse.deleteMany()
	await prisma.prompt.deleteMany()
	await prisma.userConfig.deleteMany()
	await prisma.config.deleteMany()
	await prisma.user.deleteMany()
	await prisma.skillCategory.deleteMany()
	await prisma.difficultyLevel.deleteMany()

	// Criação de categorias e níveis
	const skill = await prisma.skillCategory.create({
		data: {
			name: 'Esse nome nao precisa',
			description: 'Explicar a fundamentação do tratamento com terapia cognitivo-comportamental'
		}
	})

	const level = await prisma.difficultyLevel.create({
		data: {
			name: 'Iniciante',
			description: 'Modo iniciante para o terapeuta',
			order: 1
		}
	})

	// Criação de configuração vinculada a skillCategory e difficultyLevel
	const config = await prisma.config.create({
		data: {
			name: 'Exercício 1',
			skillCategoryId: skill.id,
			difficultyLevelId: level.id,
			createdAt: new Date()
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

	// Criação do vinculo entre o usuário e a configuração
	await prisma.userConfig.create({
		data: {
			userId: user.id,
			configId: config.id,
			createdAt: new Date()
		}
	})

	// Dados de seed: array de prompts e respostas esperadas (1-1)
	const seedData = [
		{
			promptText: 'Esse tipo de abordagem ajuda pessoas como eu?',
			responseText: 'Sim, essa abordagem costuma ser bastante útil para pessoas como você. É uma abordagem bem pesquisada, com muito suporte científico quanto à sua eficácia para diferentes tipos de pessoas e problemas. Claro, cada pessoa é única e vivencia as coisas de maneira própria. Por isso, vamos adaptar o que fizermos para atender melhor às suas necessidades e preferências, sempre priorizando verificar o que parece estar funcionando — ou não — para você.'
		},
		{
			promptText: 'Como a terapia funciona?',
			responseText: 'Essa é uma ótima pergunta! Na terapia cognitivo-comportamental, vamos olhar para suas cognições — ou seja, seus pensamentos — e para seus comportamentos, para ver se consigo te ensinar algumas habilidades que ajudem a lidar com eles de forma mais eficaz em relação aos problemas que você quer trabalhar. Isso ajuda a responder sua dúvida?'
		},
		{
			promptText: 'Nunca fiz terapia antes. Sobre o que a gente conversa aqui?',
			responseText: 'Provavelmente vamos falar sobre várias coisas. No fim das contas, queremos focar no que for mais importante para você. Vamos definir metas para o tratamento; eu vou te ensinar habilidades para perceber e modificar pensamentos e comportamentos; você vai praticar isso em casa; no início de cada sessão vamos montar uma pauta com os temas mais relevantes para você naquele momento; e vamos acompanhar o progresso ao longo do tempo, ajustando o plano se não estivermos avançando como gostaríamos.'
		},
		{
			promptText: 'Nunca fiz terapia antes. A gente só fala sobre meu passado ou criação?',
			responseText: 'Entendo que a terapia ainda possa ser um pouco misteriosa para você. Tenho sim interesse na sua história. De forma geral, a TCC dá ênfase às experiências atuais e futuras, mas em alguns momentos pode ser importante olharmos para o passado para entender melhor o que está acontecendo no presente.'
		},
		// Adicione mais objetos aqui conforme necessário
	]

	// Loop para criar prompts e expectedResponses
	for (let i = 0; i < seedData.length; i++) {
		const { promptText, responseText } = seedData[i]

		const prompt = await prisma.prompt.create({
			data: {
				configId: config.id,
				text: promptText,
				order: i + 1
			}
		})

		await prisma.expectedResponse.create({
			data: {
				promptId: prompt.id,
				text: responseText
			}
		})
	}

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
