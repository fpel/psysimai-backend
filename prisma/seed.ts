// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    // Limpeza da base antes de popular
    await prisma.message.deleteMany()
    await prisma.session.deleteMany()
    await prisma.expectedResponse.deleteMany()
    await prisma.userEstimulo.deleteMany()
    await prisma.estimulo.deleteMany()
    await prisma.user.deleteMany()
    await prisma.skillCategory.deleteMany()
    await prisma.difficultyLevel.deleteMany()
    // Criação do usuário padrão
    const user = await prisma.user.upsert({
        where: { email: 'felipe.pellegrini@gmail.com' },
        update: {},
        create: {
            name: 'Felipe Pellegrini',
            email: 'felipe.pellegrini@gmail.com',
        }
    })

	//Constantes
	const criteriosAvaliacao = `Critérios de avaliação:
- Validar a experiência do paciente.
- Explicar a lógica de como a TCC pode ser utilizada para abordar as preocupações.
- Promover esperança quanto ao uso eficaz da TCC.
- Estabelecer expectativas adequadas sobre a natureza e o impacto da TCC.`;
	const feedbackInstrucao = `Forneça um feedback mais rigoroso e um percentual de adequação, só considerar a resposta adequada quando cumpriu todos os critérios acima.`;


    // Criação de categorias e níveis
    const skill = await prisma.skillCategory.create({
        data: {
            title: 'Terapia Cognitivo-Comportamental',
            description: 'Explicar a fundamentação do tratamento com terapia cognitivo-comportamental',
            promptIntro: 'Você é um avaliador especializado em Terapia Cognitivo-Comportamental (TCC).\n\nSua tarefa é avaliar se uma resposta de terapeuta cumpre todos os critérios técnicos esperados.',
            promptFormat: 'Responda exclusivamente com JSON puro, sem formatação, sem blocos de código e sem explicações externas. Use estritamente o formato: {"isValid": boolean, "score": number, "feedback": "texto breve, gentil e profissional"}',
            promptTemperature: 7 // Exemplo: 7 (corresponde a 0.7 na API)
        }
    })

    const levelBasic = await prisma.difficultyLevel.create({
        data: {
            name: 'Iniciante',
            order: 1
        }
    })
    const levelIntermediate = await prisma.difficultyLevel.create({
        data: {
            name: 'Intermediário',
            order: 2
        }
    })

    const levelAdvanced = await prisma.difficultyLevel.create({
        data: {
            name: 'Avançado',
            order: 3
        }
    })

    // Dados de seed: array de estímulos e respostas esperadas (1-1)
    const seedData = [
        {
            text: 'Esse tipo de abordagem ajuda pessoas como eu?',
            criteriosAvaliacao: criteriosAvaliacao,
            feedback: feedbackInstrucao,
            order: 1,
            skillCategoryId: skill.id,
            difficultyLevelId: levelBasic.id,
            responseText: 'Sim, essa abordagem costuma ser bastante útil para pessoas como você. É uma abordagem bem pesquisada, com muito suporte científico quanto à sua eficácia para diferentes tipos de pessoas e problemas. Claro, cada pessoa é única e vivencia as coisas de maneira própria. Por isso, vamos adaptar o que fizermos para atender melhor às suas necessidades e preferências, sempre priorizando verificar o que parece estar funcionando — ou não — para você.'
        },
        {
            text: 'Como a terapia funciona?',
            criteriosAvaliacao: criteriosAvaliacao,
            feedback: feedbackInstrucao,
            order: 2,
            skillCategoryId: skill.id,
            difficultyLevelId: levelBasic.id,
            responseText: 'Essa é uma ótima pergunta! Na terapia cognitivo-comportamental, vamos olhar para suas cognições — ou seja, seus pensamentos — e para seus comportamentos, para ver se consigo te ensinar algumas habilidades que ajudem a lidar com eles de forma mais eficaz em relação aos problemas que você quer trabalhar. Isso ajuda a responder sua dúvida?'
        },
        {
            text: 'Nunca fiz terapia antes. Sobre o que a gente conversa aqui?',
            criteriosAvaliacao: criteriosAvaliacao,
            feedback: feedbackInstrucao,
            order: 3,
            skillCategoryId: skill.id,
            difficultyLevelId: levelBasic.id,
            responseText: 'Provavelmente vamos falar sobre várias coisas. No fim das contas, queremos focar no que for mais importante para você. Vamos definir metas para o tratamento; eu vou te ensinar habilidades para perceber e modificar pensamentos e comportamentos; você vai praticar isso em casa; no início de cada sessão vamos montar uma pauta com os temas mais relevantes para você naquele momento; e vamos acompanhar o progresso ao longo do tempo, ajustando o plano se não estivermos avançando como gostaríamos.'
        },
        {
            text: 'Nunca fiz terapia antes. A gente só fala sobre meu passado ou criação?',
            criteriosAvaliacao: criteriosAvaliacao,
            feedback: feedbackInstrucao,
            order: 4,
            skillCategoryId: skill.id,
            difficultyLevelId: levelBasic.id,
            responseText: 'Entendo que a terapia ainda possa ser um pouco misteriosa para você. Tenho sim interesse na sua história. De forma geral, a TCC dá ênfase às experiências atuais e futuras, mas em alguns momentos pode ser importante olharmos para o passado para entender melhor o que está acontecendo no presente.'
        },
        // Adicione mais objetos aqui conforme necessário
    ]
    const seedDataIntermediate = [
        {
            text: 'Não tenho certeza se entendo como falar sobre meus sentimentos vai ajudar.',
            criteriosAvaliacao: criteriosAvaliacao,
            feedback: feedbackInstrucao,
            order: 1,
            skillCategoryId: skill.id,
            difficultyLevelId: levelIntermediate.id,
            responseText: 'Essa é uma preocupação muito comum, e agradeço por compartilhar. A ideia não é falar sobre seus sentimentos apenas por falar. O objetivo é te ajudar a vivenciá-los de maneiras novas, que permitam refletir sobre eles de forma mais objetiva e responder de forma mais adaptativa — para que você consiga atender suas necessidades e viver a vida que deseja.'
        },
        {
            text: 'Tenho dificuldade com organização, então estou preocupado em fazer todas as tarefas de casa corretamente.',
            criteriosAvaliacao: criteriosAvaliacao,
            feedback: feedbackInstrucao,
            order: 2,
            skillCategoryId: skill.id,
            difficultyLevelId: levelIntermediate.id,
            responseText: 'Entendo a sua preocupação, e gostaria primeiro de esclarecer exatamente do que se trata. Em geral, antes de propor qualquer tarefa para você fazer fora das sessões, vamos pensar juntos sobre o que pode tornar essa tarefa difícil e elaborar estratégias para facilitar sua realização. O que acha disso?'
        },
        {
            text: 'Não sei se isso é o certo para mim.',
            criteriosAvaliacao: criteriosAvaliacao,
            feedback: feedbackInstrucao,
            order: 3,
            skillCategoryId: skill.id,
            difficultyLevelId: levelIntermediate.id,
            responseText: 'Acho muito importante reconhecer esse tipo de dúvida. Gostaria de entender melhor o que está por trás das suas preocupações. É bastante comum as pessoas se sentirem inseguras sobre se a terapia — seja em geral ou de um tipo específico — é a escolha certa. Pelo que ouvi até agora, acredito que a terapia pode te ajudar, mas quero te apoiar para que você tome uma decisão bem informada e que atenda às suas necessidades neste momento.'
        },
        {
            text: 'O que você está dizendo faz sentido. Consigo ver como esse jeito de trabalhar pode ajudar outras pessoas, mas não sei se combina comigo.',
            criteriosAvaliacao: criteriosAvaliacao,
            feedback: feedbackInstrucao,
            order: 4,
            skillCategoryId: skill.id,
            difficultyLevelId: levelIntermediate.id,
            responseText: 'Agradeço por compartilhar sua incerteza. Se estiver tudo bem para você, gostaria de explorar um pouco o que, especificamente, te faz sentir que essa abordagem pode não ser adequada. Me parece uma boa ideia conversarmos sobre diferentes tipos de terapia para que você possa escolher o que faz mais sentido. Podemos incluir isso na nossa pauta da sessão de hoje? O que acha?'
        },
        {
            text: 'Já tive experiências ruins com terapia antes, e não sei se isso realmente ajuda. Como isso vai ser diferente?',
            criteriosAvaliacao: criteriosAvaliacao,
            feedback: feedbackInstrucao,
            order: 5,
            skillCategoryId: skill.id,
            difficultyLevelId: levelIntermediate.id,
            responseText: 'Dadas as experiências ruins que você teve, entendo por que pode estar cético. Para ser honesto, cada processo terapêutico é diferente, e há bastante potencial para que essa experiência seja diferente para você. Acho importante conversarmos sobre suas experiências anteriores com terapia — especialmente o que não foi útil, e o que, se houver, foi pelo menos um pouco útil. O que você pensa sobre isso?'
        },
        {
            text: 'Quanto tempo vai levar para isso funcionar? Não tenho muito tempo nem dinheiro.',
            criteriosAvaliacao: criteriosAvaliacao,
            feedback: feedbackInstrucao,
            order: 6,
            skillCategoryId: skill.id,
            difficultyLevelId: levelIntermediate.id,
            responseText: 'Essa é uma pergunta importante, mas um pouco difícil de responder com precisão. Sei que pode ser frustrante ouvir isso, mas... depende. Essa abordagem terapêutica é, em geral, estruturada para ser de curto prazo e tem bons resultados comprovados. Mas cada pessoa é única. Vamos monitorar o progresso a cada sessão e, normalmente, esperamos ver melhorias em torno da sexta a oitava sessão. Se isso não acontecer, vamos conversar sobre possíveis mudanças.'
        },
        // Adicione mais objetos aqui conforme necessário
    ]
    const seedDataAdvanced = [
        {
            text: 'Já tive experiências ruins com terapia antes. Meu último terapeuta tentou me fazer falar e visualizar meus traumas do passado. Acabei sendo internado! Como posso saber se posso confiar em você?',
            criteriosAvaliacao: criteriosAvaliacao,
            feedback: feedbackInstrucao,
            order: 1,
            skillCategoryId: skill.id,
            difficultyLevelId: levelAdvanced.id,
            responseText: 'Sinto muito por saber que você teve experiências negativas. Isso soa realmente difícil, e acho totalmente compreensível que você esteja se perguntando isso. Em primeiro lugar, é importante deixar claro que você nunca será "forçado" a fazer nada no nosso trabalho juntos. Sem entrarmos necessariamente no conteúdo dos seus traumas passados, seria útil entender um pouco mais sobre o tipo de trabalho que você fazia com seu terapeuta anterior e as circunstâncias da sua hospitalização. Também sugiro que hoje a gente dê prioridade a conversar sobre como construir e manter confiança entre nós. O que acha?'
        },
        {
            text: 'Fui abusado quando era criança e, recentemente, não consigo parar de pensar nisso. Meu namorado tenta me ajudar a ser mais positivo, mas não consigo parar de me sentir deprimido. Às vezes penso que seria mais fácil para todos se eu estivesse morto.',
            criteriosAvaliacao: criteriosAvaliacao,
            feedback: feedbackInstrucao,
            order: 2,
            skillCategoryId: skill.id,
            difficultyLevelId: levelAdvanced.id,
            responseText: 'Imagino que isso tudo esteja sendo muito avassalador. Às vezes, você pensa que seria mais fácil para todos se você estivesse morto. Não quero colocar palavras na sua boca, mas me parece que talvez existam outros momentos em que ainda há alguma esperança — por exemplo, o fato de você ter vindo aqui hoje. Podemos explorar esse pensamento de que seria mais fácil para todos se você não estivesse aqui?'
        },
        {
            text: 'Meu médico disse que eu tenho que te procurar por causa do meu “problema com raiva”. Às vezes, quando fico muito irritado, perco o controle e agrido as pessoas. Fico com muita raiva quando dizem coisas idiotas! Você tem certeza de que consegue me ajudar com isso?',
            criteriosAvaliacao: criteriosAvaliacao,
            feedback: feedbackInstrucao,
            order: 3,
            skillCategoryId: skill.id,
            difficultyLevelId: levelAdvanced.id,
            responseText: 'Parece que você está com raiva agora. Vamos falar sobre suas preocupações em relação a receber a ajuda que deseja. Podemos incluir isso na nossa pauta de hoje. Também gostaria de conversar com você sobre como podemos fazer um plano para lidar com situações em que você sinta raiva durante as sessões. Podemos tratar disso hoje também? Mas antes, queria entender melhor até que ponto você considera que tem um problema com raiva.'
        },
        {
            text: 'Eu realmente preciso entender por que sou do jeito que sou hoje. Acho que compreender meu passado e minha infância é muito importante, mas parece que essa abordagem não trabalha com isso?',
            criteriosAvaliacao: criteriosAvaliacao,
            feedback: feedbackInstrucao,
            order: 4,
            skillCategoryId: skill.id,
            difficultyLevelId: levelAdvanced.id,
            responseText: 'Esse é um ponto importante de esclarecimento. Na verdade, concordo que o passado é importante, e ele também tem lugar dentro desta abordagem. Embora a TCC foque principalmente no presente e no que está acontecendo agora, seu passado definitivamente não está “fora dos limites”. Provavelmente vamos precisar falar sobre suas experiências passadas para compreendermos melhor sua vida atual. Quando isso for relevante, vamos abordar — sempre conectando com o que for mais útil para você no momento. Isso parece fazer sentido para você?'
        },
        // Adicione mais objetos aqui conforme necessário
    ]

    // Criação dos estímulos e respostas esperadas
	//Nivel basico
	for (const stim of seedData) {
        const estimulo = await prisma.estimulo.create({
            data: {
                text: stim.text,
                criteriosAvaliacao: stim.criteriosAvaliacao,
                feedback: stim.feedback,
                order: stim.order,
                skillCategoryId: stim.skillCategoryId,
                difficultyLevelId: stim.difficultyLevelId
            }
        })
        await prisma.userEstimulo.create({
            data: {
                userId: user.id,
                estimuloId: estimulo.id
            }
        })
        await prisma.expectedResponse.create({
            data: {
                estimuloId: estimulo.id,
                text: stim.responseText
            }
        })
    }
	//Nivel intermediario
	for (const stim of seedDataIntermediate) {
        const estimulo = await prisma.estimulo.create({
            data: {
                text: stim.text,
                criteriosAvaliacao: stim.criteriosAvaliacao,
                feedback: stim.feedback,
                order: stim.order,
                skillCategoryId: stim.skillCategoryId,
                difficultyLevelId: stim.difficultyLevelId
            }
        })
        await prisma.userEstimulo.create({
            data: {
                userId: user.id,
                estimuloId: estimulo.id
            }
        })
        await prisma.expectedResponse.create({
            data: {
                estimuloId: estimulo.id,
                text: stim.responseText
            }
        })
    }
	//Nivel avancado
	for (const stim of seedDataAdvanced) {
        const estimulo = await prisma.estimulo.create({
            data: {
                text: stim.text,
                criteriosAvaliacao: stim.criteriosAvaliacao,
                feedback: stim.feedback,
                order: stim.order,
                skillCategoryId: stim.skillCategoryId,
                difficultyLevelId: stim.difficultyLevelId
            }
        })
        await prisma.userEstimulo.create({
            data: {
                userId: user.id,
                estimuloId: estimulo.id
            }
        })
        await prisma.expectedResponse.create({
            data: {
                estimuloId: estimulo.id,
                text: stim.responseText
            }
        })
    }



    console.log('Seed atualizado com base no novo schema (Estimulo, UserEstimulo, etc).')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
