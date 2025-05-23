import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createMessage = async (req: Request, res: Response) => {
  const { sessionId, sender, content } = req.body;
  const message = await prisma.message.create({
    data: {
      sessionId,
      sender,
      content,
    },
  });
  res.status(201).json(message);
};
