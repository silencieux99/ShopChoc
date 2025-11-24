import express from 'express';
import { scraperController } from '../controllers/scraperController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// Authentifier sur le site fournisseur
router.post('/authenticate', scraperController.authenticate);

// Récupérer les catégories
router.get('/categories', scraperController.getCategories);

// Scrapper une catégorie
router.post('/scrape-category', scraperController.scrapeCategory);

// Scrapper tout le site
router.post('/scrape-all', scraperController.scrapeAll);

// Scrapper un produit unique
router.post('/scrape-product', scraperController.scrapeProduct);

export default router;
