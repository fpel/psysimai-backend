import express from 'express';
import { sendConfirmationEmail } from '../controllers/emailController';

const router = express.Router();

router.post('/send-confirmation', sendConfirmationEmail);

export default router;

// No frontend, envie também o campo 'code' no body do POST para /api/email/send-confirmation
