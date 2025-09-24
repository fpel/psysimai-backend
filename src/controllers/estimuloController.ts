import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();



export const createEstimulo = async (req: Request, res: Response) => {
    const { text, criteriosAvaliacao, feedback, difficultyLevelId, expectedResponses, skillId, habilitado } = req.body;
	const userId = req.user?.id || null; // req.user deve ser preenchido pelo middleware de autenticação
	if (!text || !skillId) {
		res.status(400).json({ message: 'Campos obrigatórios ausentes (text, skillId).' });
		return;
	}
	try {
		// Cria o estímulo principal
		// Busca a última ordem dos estímulos desse skill
		const lastEstimulo = await prisma.estimulo.findFirst({
			where: { skillCategoryId: skillId },
			orderBy: { order: 'desc' },
		});
		const nextOrder = lastEstimulo?.order ? lastEstimulo.order + 1 : 1;

		const estimulo = await prisma.estimulo.create({
			data: {
				text,
				criteriosAvaliacao: criteriosAvaliacao || '',
				feedback: feedback || '',
				difficultyLevelId: difficultyLevelId || null,
				skillCategoryId: skillId,
				createdBy: userId,
				updatedAt: new Date(),
				status: 'active',
				order: nextOrder,
				habilitado: typeof habilitado === 'boolean' ? habilitado : true,
			},
		});

		// Cria as respostas esperadas, se houver
		if (Array.isArray(expectedResponses) && expectedResponses.length > 0) {
			for (const resp of expectedResponses) {
				if (resp.text && resp.text.trim() !== '') {
					await prisma.expectedResponse.create({
						data: {
							text: resp.text,
							notes: resp.notes || null,
							estimuloId: estimulo.id,
						},
					});
				}
			}
		}

		// Retorna o estímulo criado com as respostas esperadas
		const estimuloCompleto = await prisma.estimulo.findUnique({
			where: { id: estimulo.id },
			include: { expectedResponses: true, difficultyLevel: true },
		});
		res.status(201).json(estimuloCompleto);
		return;
	} catch (error) {
		console.error('Erro ao criar estímulo:', error);
		res.status(500).json({ message: 'Erro ao criar estímulo.' });
		return;
	}
};



// Exclusão lógica de Estímulo
export const deleteEstimulo = async (req: Request, res: Response) => {
	const { id } = req.params;
	const userId = req.user?.id || null; // req.user deve ser preenchido pelo middleware de autenticação
	if (!id) {
		res.status(400).json({ message: 'id ausente.' });
		return;
	}
	try {
		const estimulo = await prisma.estimulo.update({
			where: { id },
			data: {
				status: 'deleted',
				deletedBy: userId,
				deletedAt: new Date(),
				updatedAt: new Date(),
			},
		});
		res.status(200).json({ message: 'Estímulo excluído com sucesso.', estimulo });
		return;
	} catch (error) {
		console.error('Erro ao excluir estímulo:', error);
		res.status(500).json({ message: 'Erro ao excluir estímulo.' });
		return;
	}
};

export const getAllEstimulos = async (req: Request, res: Response) => {
	try {
		const estimulos = await prisma.estimulo.findMany({
			where: { status: 'active', habilitado: true },
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
			where: { userId, estimulo: { status: 'active', habilitado: true } },
			include: {
				estimulo: {
					select: {
						id: true,
						text: true,
						order: true,
						difficultyLevel: true,
						habilitado: true,
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
		const estimulo = await prisma.estimulo.findFirst({
			where: { id, status: 'active' },
			select: {
				id: true,
				text: true,
				criteriosAvaliacao: true,
				feedback: true,
				difficultyLevel: true,
				expectedResponses: true,
				habilitado: true,
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
	const { text, criteriosAvaliacao, feedback, difficultyLevelId, expectedResponses, habilitado } = req.body;
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
				habilitado,
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
		return;
	} catch (error) {
		console.error('Erro ao atualizar estímulo:', error);
		res.status(500).json({ message: 'Erro ao atualizar estímulo.' });
		return;
	}
};

export const getEstimulosBySkill = async (req: Request, res: Response) => {
	const { skillId } = req.params;
	if (!skillId) {
		res.status(400).json({ message: 'skillId ausente.' });
		return;
	}
	try {
		const estimulos = await prisma.estimulo.findMany({
			where: { skillCategoryId: skillId, status: 'active' },
			include: {
				skillCategory: true,
				difficultyLevel: true,
				expectedResponses: true,
			},
		});
		res.status(200).json(estimulos);
		return;
	} catch (error) {
		console.error('Erro ao buscar estímulos por skill:', error);
		res.status(500).json({ message: 'Erro ao buscar estímulos por skill.' });
		return;
	}
};
