import express from 'express';
import { body, validationResult } from 'express-validator';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productsController.js';
import { verifyToken, requireAdmin } from '../middleware/verifyToken.js';
import { sendError } from '../utils/responseHelper.js';

const router = express.Router();

// Validation middleware for product creation/updates
const validateProduct = [
  body('name').notEmpty().withMessage('Name is required').isString(),
  body('category').notEmpty().withMessage('Category is required').isString(),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('currency').optional().isString(),
  body('description').optional().isString(),
  body('images').optional().isArray().withMessage('Images must be an array of URLs'),
  body('inStock').optional().isBoolean(),
  body('featured').optional().isBoolean(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Validation failed', errors.array(), 400);
    }
    next();
  }
];

// Public Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin Only Routes
router.post('/', verifyToken, requireAdmin, validateProduct, createProduct);
router.put('/:id', verifyToken, requireAdmin, validateProduct, updateProduct);
router.delete('/:id', verifyToken, requireAdmin, deleteProduct);

export default router;
