import { Router } from 'express';
import { getAllSkills, createSkill, getSkillById, updateSkill, patchSkill } from '../controllers/skillController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', verifyToken, getAllSkills);
router.post('/', verifyToken, createSkill);
router.get('/:id', verifyToken, getSkillById);
router.put('/:id', verifyToken, updateSkill);
router.patch('/:id', verifyToken, patchSkill);

export default router;
