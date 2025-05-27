import { Router } from 'express';
import {
	getConfiguracao,
	updateConfiguracao,
	createConfiguracao,
} from '../controllers/configuracaoController';

const router = Router();

router.get('/', getConfiguracao);
router.patch('/:id', updateConfiguracao);
router.post('/', createConfiguracao);

export default router;