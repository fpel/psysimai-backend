import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllEstimulos = async (req: Request, res: Response) => {
	try {
		const estimulos = await prisma.estimulo.findMany({
			include: {
				skillCategory: true,
				difficultyLevel: true,
				expectedResponses: true,
			},
		});
		res.status(200).json(estimulos);
		return;
	} catch (error) {
		console.error('Erro ao buscar estímulos:', error);
		res.status(500).json({ message: 'Erro ao buscar estímulos.' });
		return;
	}
};

export const getEstimulosByUser = async (req: Request, res: Response) => {
	const { userId } = req.params;
	if (!userId) {
		res.status(400).json({ message: 'userId ausente.' });
		return;
	}
	try {
		const userEstimulos = await prisma.userEstimulo.findMany({
			where: { userId },
			include: {
				estimulo: {
					select: {
						id: true,
						text: true,
						order: true,
						difficultyLevel: true,
					},
				},
			},
		});
		// Retorna apenas os estímulos já filtrados
		const estimulos = userEstimulos.map(ue => ue.estimulo);
		res.status(200).json(estimulos);
		return;
	} catch (error) {
		console.error('Erro ao buscar estímulos do usuário:', error);
		res.status(500).json({ message: 'Erro ao buscar estímulos do usuário.' });
		return;
	}
};

export const getEstimuloById = async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!id) {
		res.status(400).json({ message: 'id ausente.' });
		return;
	}
	try {
		const estimulo = await prisma.estimulo.findUnique({
			where: { id },
			select: {
				id: true,
				text: true,
				criteriosAvaliacao: true,
				feedback: true,
				difficultyLevel: true,
				expectedResponses: true,
			},
		});
		if (!estimulo) {
			res.status(404).json({ message: 'Estímulo não encontrado.' });
			return;
		}
		res.status(200).json(estimulo);
		return;
	} catch (error) {
		console.error('Erro ao buscar estímulo por id:', error);
		res.status(500).json({ message: 'Erro ao buscar estímulo.' });
		return;
	}
};

export const updateEstimulo = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { text, criteriosAvaliacao, feedback, difficultyLevelId, expectedResponses } = req.body;
	if (!id) {
		res.status(400).json({ message: 'id ausente.' });
		return;
	}
	try {
		// Atualiza o estímulo principal
		const estimulo = await prisma.estimulo.update({
			where: { id },
			data: {
				text,
				criteriosAvaliacao,
				feedback,
				difficultyLevelId,
			},
		});

		// Busca as respostas esperadas atuais
		const currentResponses = await prisma.expectedResponse.findMany({ where: { estimuloId: id } });
		const currentIds = currentResponses.map(r => r.id);
		const receivedIds = expectedResponses.map((r: any) => r.id).filter(Boolean);

		// Remove respostas que não estão mais presentes
		const toDelete = currentIds.filter(id => !receivedIds.includes(id));
		await prisma.expectedResponse.deleteMany({ where: { id: { in: toDelete } } });

		// Atualiza ou cria respostas esperadas
		for (const resp of expectedResponses) {
			if (resp.id && currentIds.includes(resp.id)) {
				await prisma.expectedResponse.update({
					where: { id: resp.id },
					data: { text: resp.text, notes: resp.notes || null },
				});
			} else {
				await prisma.expectedResponse.create({
					data: { text: resp.text, notes: resp.notes || null, estimuloId: id },
				});
			}
		}

		// Retorna o estímulo atualizado
		const updated = await prisma.estimulo.findUnique({
			where: { id },
			include: { expectedResponses: true, difficultyLevel: true },
		});
		res.status(200).json(updated);
	} catch (error) {
		console.error('Erro ao atualizar estímulo:', error);
		res.status(500).json({ message: 'Erro ao atualizar estímulo.' });
	}
};
