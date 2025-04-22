import express from 'express';
import { validateResponse } from '../controllers/validationController';
const router = express.Router();

router.post('/', validateResponse);

export default router;
