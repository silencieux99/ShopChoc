import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  createCheckoutSession,
  verifyPayment,
  getTransactions
} from '../controllers/paymentController.js';

const router = express.Router();

// Toutes les routes de paiement nécessitent une authentification
router.post('/create-checkout-session', verifyToken, createCheckoutSession);
router.get('/verify/:sessionId', verifyToken, verifyPayment);
router.get('/transactions', verifyToken, getTransactions);

export default router;
