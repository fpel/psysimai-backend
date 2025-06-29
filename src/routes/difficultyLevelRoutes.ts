import { Router } from 'express';
import { getAllDifficultyLevels } from '../controllers/difficultyLevelController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', verifyToken, getAllDifficultyLevels);

export default router;
