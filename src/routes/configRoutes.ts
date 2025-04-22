import express from 'express'
import { getPromptsByConfig } from '../controllers/configController'
const router = express.Router()

router.get('/:configId/prompts', getPromptsByConfig)

export default router
