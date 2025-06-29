import { Router } from 'express';
import { getAllEstimulos, getEstimulosByUser, getEstimuloById, updateEstimulo } from '../controllers/estimuloController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', verifyToken, getAllEstimulos);
router.get('/usuario/:userId', verifyToken, getEstimulosByUser);
router.get('/:id', verifyToken, getEstimuloById);
router.put('/:id', verifyToken, updateEstimulo);

export default router;
