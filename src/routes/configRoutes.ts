// src/routes/configRoutes.ts
import express from 'express'
import { getConfigsByUser } from '../controllers/configController'
import { verifyToken } from '../middleware/authMiddleware'

const router = express.Router()

router.get('/', verifyToken, getConfigsByUser)

export default router
