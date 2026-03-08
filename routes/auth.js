import express from 'express';
import { getMe, setAdminLogic } from '../controllers/authController.js';
import { verifyToken, requireAdmin } from '../middleware/verifyToken.js';

const router = express.Router();

// Authenticated User Route
router.get('/me', verifyToken, getMe);

// Admin Only Route
router.post('/set-admin', verifyToken, requireAdmin, setAdminLogic);

export default router;
