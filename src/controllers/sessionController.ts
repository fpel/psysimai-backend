import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createSession = async (req: Request, res: Response) => {
  const { userId, configId } = req.body;
  const session = await prisma.session.create({
    data: {
      userId,
      configId,
    },
  });
  res.status(201).json(session);
};
