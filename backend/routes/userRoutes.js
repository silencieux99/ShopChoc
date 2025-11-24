import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  toggleFollow,
  getUserFavorites
} from '../controllers/userController.js';

const router = express.Router();

// Routes publiques
router.get('/:userId', getUserProfile);

// Routes protégées
router.post('/profile', verifyToken, createUserProfile);
router.put('/profile', verifyToken, updateUserProfile);
router.post('/follow/:targetUserId', verifyToken, toggleFollow);
router.get('/favorites/me', verifyToken, getUserFavorites);

export default router;
