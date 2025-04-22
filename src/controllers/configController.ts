import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getPromptsByConfig = async (req: Request, res: Response) => {
	const { configId } = req.params

	try {
		const prompts = await prisma.prompt.findMany({
			where: { configId },
			orderBy: { order: 'asc' },
			select: { id: true, text: true }
		})

		res.status(200).json(prompts)
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Erro ao buscar prompts' })
	}
}
