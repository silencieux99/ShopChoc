import express from 'express';
import { verifyToken, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleLike,
  getUserProducts
} from '../controllers/productController.js';

const router = express.Router();

// Routes publiques
router.get('/', optionalAuth, getProducts);
router.get('/:id', optionalAuth, getProductById);
router.get('/user/:userId', getUserProducts);

// Routes protégées
router.post('/', verifyToken, upload.array('images', 5), createProduct);
router.put('/:id', verifyToken, upload.array('images', 5), updateProduct);
router.delete('/:id', verifyToken, deleteProduct);
router.post('/:id/like', verifyToken, toggleLike);

export default router;
