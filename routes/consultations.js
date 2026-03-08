import express from 'express';
import { body, validationResult } from 'express-validator';
import { 
  createConsultation, 
  getAllConsultations, 
  updateConsultationStatus 
} from '../controllers/consultationsController.js';
import { verifyToken, requireAdmin } from '../middleware/verifyToken.js';
import { sendError } from '../utils/responseHelper.js';

const router = express.Router();

const validateConsultation = [
  body('name').isString().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').isString().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', errors.array(), 400);
    }
    next();
  }
];

// Public Route
router.post('/', validateConsultation, createConsultation);

// Admin Only Routes
router.get('/', verifyToken, requireAdmin, getAllConsultations);
router.patch('/:id/status', verifyToken, requireAdmin, updateConsultationStatus); // Modified to ensure standard pattern

export default router;
