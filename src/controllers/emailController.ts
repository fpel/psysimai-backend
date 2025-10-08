import { Request, Response } from 'express';
import { sendEmail } from '../services/emailService';

// Armazenamento simples em memória para códigos de login
const loginCodes: Record<string, string> = {};

export const sendConfirmationEmail = async (req: Request, res: Response) => {
  const { to, subject, text, html, code } = req.body;
  if (!to || !subject || (!text && !html) ) {
    res.status(400).json({ message: 'Campos obrigatórios: to, subject, text ou html.' });
    return;
  }
  try {
    await sendEmail({ to, subject, text, html });
    loginCodes[to] = code;
    res.status(200).json({ message: 'Email enviado com sucesso.' });
    return;
  } catch (err) {
    console.error('Erro ao enviar email:', err);
    res.status(500).json({ message: 'Erro ao enviar email.' });
    return;
  }
};

export function getLoginCode(email: string): string | undefined {
  return loginCodes[email];
}
