import express from 'express';
import { body, validationResult } from 'express-validator';
import { 
  createOrder, 
  getMyOrders, 
  getAllOrders, 
  updateOrderStatus 
} from '../controllers/ordersController.js';
import { verifyToken, requireAdmin } from '../middleware/verifyToken.js';
import { sendError } from '../utils/responseHelper.js';

const router = express.Router();

const validateOrder = [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.productId').isString().notEmpty().withMessage('Product ID is required'),
  body('items.*.name').isString().notEmpty().withMessage('Product name is required'),
  body('items.*.qty').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.price').isNumeric().withMessage('Price must be a valid number'),
  body('total').isNumeric().withMessage('Total is required'),
  body('shippingAddress').isObject().withMessage('Shipping address object is required'),
  body('shippingAddress.line1').isString().notEmpty().withMessage('Address line 1 is required'),
  body('shippingAddress.city').isString().notEmpty().withMessage('City is required'),
  body('shippingAddress.country').isString().notEmpty().withMessage('Country is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', errors.array(), 400);
    }
    next();
  }
];

// Authenticated User Routes
router.post('/', verifyToken, validateOrder, createOrder);
router.get('/my', verifyToken, getMyOrders);

// Admin Only Routes
router.get('/', verifyToken, requireAdmin, getAllOrders);
router.patch('/:id/status', verifyToken, requireAdmin, updateOrderStatus);

export default router;
