import express from 'express';
import { body, validationResult } from 'express-validator';
import { 
  subscribe, 
  unsubscribe, 
  getAllSubscribers 
} from '../controllers/newsletterController.js';
import { verifyToken, requireAdmin } from '../middleware/verifyToken.js';
import { sendError } from '../utils/responseHelper.js';

const router = express.Router();

const validateEmail = [
  body('email').isEmail().withMessage('Valid email is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', errors.array(), 400);
    }
    next();
  }
];

// Public Routes
router.post('/subscribe', validateEmail, subscribe);
router.delete('/unsubscribe', validateEmail, unsubscribe);

// Admin Only Route
router.get('/', verifyToken, requireAdmin, getAllSubscribers);

export default router;
