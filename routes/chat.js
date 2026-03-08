import express from 'express';
import { body, validationResult } from 'express-validator';
import { sendChat } from '../controllers/chatController.js';
import { sendError } from '../utils/responseHelper.js';

const router = express.Router();

const validateChat = [
  body('messages').isArray({ min: 1 }).withMessage('messages must be a non-empty array'),
  body('messages.*.role').isIn(['user', 'assistant']).withMessage('Invalid message role'),
  body('messages.*.content').isString().notEmpty().withMessage('Message content required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 'Validation failed', errors.array(), 400);
    next();
  }
];

router.post('/', validateChat, sendChat);

export default router;
