import { Router } from 'express';
import { getAllEstimulos, getEstimulosByUser } from '../controllers/estimuloController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', verifyToken, getAllEstimulos);
router.get('/usuario/:userId', verifyToken, getEstimulosByUser);

export default router;
