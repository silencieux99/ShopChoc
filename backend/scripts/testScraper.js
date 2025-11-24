import scraperService from '../services/scraperService.js';

// Configuration
const SUPPLIER_URL = 'https://votre-fournisseur.com'; // À remplacer
const USERNAME = 'votre-username'; // À remplacer
const PASSWORD = 'votre-password'; // À remplacer
const PRICE_MULTIPLIER = 1.3; // Vos prix = prix fournisseur × 1.3 (30% de marge)

async function testScraper() {
  try {
    console.log('🚀 Début du test de scraping\n');

    // 1. Configurer l'URL
    scraperService.setBaseUrl(SUPPLIER_URL);
    console.log(`✅ URL configurée: ${SUPPLIER_URL}\n`);

    // 2. S'authentifier
    console.log('🔐 Authentification...');
    await scraperService.authenticate(USERNAME, PASSWORD);
    console.log('✅ Authentifié\n');

    // 3. Récupérer les catégories
    console.log('📁 Récupération des catégories...');
    const categories = await scraperService.getCategories();
    console.log(`✅ ${categories.length} catégories trouvées:\n`);
    categories.forEach((cat, i) => {
      console.log(`   ${i + 1}. ${cat.name}`);
      console.log(`      ${cat.url}\n`);
    });

    // 4. Test: Scrapper la première catégorie (limité à 2 produits)
    if (categories.length > 0) {
      console.log(`\n📦 Test: Scraping de la première catégorie (2 produits max)...`);
      const products = await scraperService.scrapeCategory(
        categories[0].url,
        categories[0].name,
        PRICE_MULTIPLIER,
        2 // Limite à 2 produits pour le test
      );
      
      console.log(`\n✅ Test terminé: ${products.length} produits ajoutés`);
      products.forEach((p, i) => {
        console.log(`\n   Produit ${i + 1}:`);
        console.log(`   - Titre: ${p.title}`);
        console.log(`   - Prix: ${p.price}€`);
        console.log(`   - Images: ${p.images.length}`);
      });
    }

    console.log('\n🎉 Test réussi!');
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    console.error(error.stack);
  }
}

// Lancer le test
testScraper();
