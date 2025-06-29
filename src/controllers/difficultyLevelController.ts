import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllDifficultyLevels = async (req: Request, res: Response) => {
  try {
    const levels = await prisma.difficultyLevel.findMany({
      select: {
        id: true,
        name: true,
        order: true,
      },
      orderBy: { order: 'asc' },
    });
    res.status(200).json(levels);
  } catch (error) {
    console.error('Erro ao buscar níveis de dificuldade:', error);
    res.status(500).json({ message: 'Erro ao buscar níveis de dificuldade.' });
  }
};
