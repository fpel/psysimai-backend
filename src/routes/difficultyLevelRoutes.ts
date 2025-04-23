import express from 'express';
import { getAllDifficultyLevels } from '../controllers/difficultyLevelController';

const router = express.Router();

router.get('/', getAllDifficultyLevels);

export default router;
