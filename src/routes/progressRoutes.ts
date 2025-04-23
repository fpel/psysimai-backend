import express from 'express';
import { saveProgress, getUserProgress } from '../controllers/progressController';

const router = express.Router();

router.post('/', saveProgress);
router.get('/:userId', getUserProgress);

export default router;
