import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllSkills = async (req: Request, res: Response) => {
  try {
    const skills = await prisma.skillCategory.findMany({
      where: { status: 'active' },
      select: {
        id: true,
        title: true,
        description: true,
      },
      orderBy: { title: 'asc' },
    });
    res.status(200).json(skills);
  } catch (error) {
    console.error('Erro ao buscar habilidades:', error);
    res.status(500).json({ message: 'Erro ao buscar habilidades.' });
  }
};

export const createSkill = async (req: Request, res: Response) => {
  try {
  const { title, description } = req.body;
    if (!title || typeof title !== 'string') {
      res.status(400).json({ message: 'Título é obrigatório.' });
      return;
    }
    const skill = await prisma.skillCategory.create({
      data: {
        title,
        description: description || '',
      },
      select: {
        id: true,
        title: true,
        description: true,
      },
    });
    res.status(201).json(skill);
    return;
  } catch (error) {
    console.error('Erro ao criar habilidade:', error);
    res.status(500).json({ message: 'Erro ao criar habilidade.' });
    return;
  }
};

export const getSkillById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'ID é obrigatório.' });
      return;
    }
    const skill = await prisma.skillCategory.findFirst({
      where: { id, status: 'active' },
      select: {
        id: true,
        title: true,
        description: true,
      },
    });
    if (!skill) {
      res.status(404).json({ message: 'Habilidade não encontrada.' });
      return;
    }
    res.status(200).json(skill);
    return;
  } catch (error) {
    console.error('Erro ao buscar habilidade por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar habilidade.' });
    return;
  }
};

export const updateSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
  const { title, description } = req.body;
    if (!id) {
      res.status(400).json({ message: 'ID é obrigatório.' });
      return;
    }
    if (!title || typeof title !== 'string') {
      res.status(400).json({ message: 'Título é obrigatório.' });
      return;
    }
    // Só permite atualizar se status=active
    const updated = await prisma.skillCategory.updateMany({
      where: { id, status: 'active' },
      data: {
        title,
        description: description || '',
      },
    });
    if (updated.count === 0) {
      res.status(404).json({ message: 'Habilidade não encontrada.' });
      return;
    }
    // Retorna o registro atualizado
    const skill = await prisma.skillCategory.findFirst({
      where: { id, status: 'active' },
      select: {
        id: true,
        title: true,
        description: true,
      },
    });
    res.status(200).json(skill);
    return;
  } catch (error) {
    console.error('Erro ao atualizar habilidade:', error);
    res.status(500).json({ message: 'Erro ao atualizar habilidade.' });
    return;
  }
};

export const patchSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // Usuário autenticado (ajuste conforme payload do seu auth)
    const user = (req as any).user;
    if (!id) {
      res.status(400).json({ message: 'ID é obrigatório.' });
      return;
    }
    if (!status) {
      res.status(400).json({ message: 'Status é obrigatório.' });
      return;
    }
    const data: any = { status };
    if (status === 'deleted') {
      data.deletedBy = user?.name || user?.email || 'unknown';
      data.deletedAt = new Date();
    }
    const updated = await prisma.skillCategory.update({
      where: { id },
      data,
      select: {
        id: true,
        title: true,
        description: true,
        status: true as any,
        deletedBy: true as any,
        deletedAt: true as any,
        updatedAt: true,
      },
    });
    res.status(200).json(updated);
    return;
  } catch (error) {
    console.error('Erro ao atualizar status da habilidade:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'P2025') {
      res.status(404).json({ message: 'Habilidade não encontrada.' });
    } else {
      res.status(500).json({ message: 'Erro ao atualizar status da habilidade.' });
    }
    return;
  }
};
