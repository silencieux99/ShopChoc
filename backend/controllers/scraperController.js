import scraperService from '../services/scraperService.js';

export const scraperController = {
  // Configurer et authentifier
  async authenticate(req, res) {
    try {
      const { baseUrl, username, password } = req.body;

      if (!baseUrl || !username || !password) {
        return res.status(400).json({
          success: false,
          message: 'URL, username et password requis'
        });
      }

      scraperService.setBaseUrl(baseUrl);
      await scraperService.authenticate(username, password);

      res.json({
        success: true,
        message: 'Authentification réussie'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Récupérer les catégories
  async getCategories(req, res) {
    try {
      const categories = await scraperService.getCategories();
      
      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Scrapper une catégorie spécifique
  async scrapeCategory(req, res) {
    try {
      const { categoryUrl, categoryName, priceMultiplier, limit } = req.body;

      if (!categoryUrl || !categoryName) {
        return res.status(400).json({
          success: false,
          message: 'categoryUrl et categoryName requis'
        });
      }

      const products = await scraperService.scrapeCategory(
        categoryUrl,
        categoryName,
        priceMultiplier || 1.3,
        limit || null
      );

      res.json({
        success: true,
        message: `${products.length} produits ajoutés`,
        data: products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Scrapper tout le site
  async scrapeAll(req, res) {
    try {
      const { priceMultiplier, limitPerCategory } = req.body;

      // Lancer le scraping en arrière-plan
      res.json({
        success: true,
        message: 'Scraping lancé en arrière-plan'
      });

      // Exécuter le scraping
      const products = await scraperService.scrapeAllSite(
        priceMultiplier || 1.3,
        limitPerCategory || null
      );

      console.log(`✅ Scraping terminé: ${products.length} produits`);
    } catch (error) {
      console.error('❌ Erreur scraping:', error.message);
    }
  },

  // Scrapper un seul produit
  async scrapeProduct(req, res) {
    try {
      const { albumUrl, category, priceMultiplier } = req.body;

      if (!albumUrl || !category) {
        return res.status(400).json({
          success: false,
          message: 'albumUrl et category requis'
        });
      }

      const product = await scraperService.scrapeAndAddProduct(
        albumUrl,
        category,
        priceMultiplier || 1.3
      );

      if (!product) {
        return res.status(400).json({
          success: false,
          message: 'Impossible de scrapper ce produit'
        });
      }

      res.json({
        success: true,
        message: 'Produit ajouté',
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};
