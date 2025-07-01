import { Router } from 'express';
import { getAllEstimulos, getEstimulosByUser, getEstimuloById, updateEstimulo, getEstimulosBySkill, deleteEstimulo, createEstimulo } from '../controllers/estimuloController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();
router.post('/', verifyToken, createEstimulo);
router.get('/', verifyToken, getAllEstimulos);
router.get('/usuario/:userId', verifyToken, getEstimulosByUser);
router.get('/:id', verifyToken, getEstimuloById);
router.put('/:id', verifyToken, updateEstimulo);
router.get('/skill/:skillId', verifyToken, getEstimulosBySkill);
router.patch('/:id', verifyToken, deleteEstimulo);

export default router;
