import axios from 'axios';
import * as cheerio from 'cheerio';
import FormData from 'form-data';
import { db, storage } from '../config/firebase.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

class ScraperService {
  constructor() {
    this.baseUrl = '';
    this.session = null;
    this.isAuthenticated = false;
  }

  // Configurer l'URL du site fournisseur
  setBaseUrl(url) {
    this.baseUrl = url;
  }

  // Authentification sur le site protégé
  async authenticate(username, password) {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post(`${this.baseUrl}/login`, formData, {
        headers: formData.getHeaders(),
        maxRedirects: 5,
        withCredentials: true
      });

      // Récupérer les cookies de session
      this.session = response.headers['set-cookie'];
      this.isAuthenticated = true;
      
      console.log('✅ Authentification réussie');
      return true;
    } catch (error) {
      console.error('❌ Erreur d\'authentification:', error.message);
      throw error;
    }
  }

  // Récupérer une page avec authentification
  async fetchPage(url) {
    if (!this.isAuthenticated) {
      throw new Error('Non authentifié. Appelez authenticate() d\'abord.');
    }

    try {
      const response = await axios.get(url, {
        headers: {
          'Cookie': this.session ? this.session.join('; ') : '',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la page:', error.message);
      throw error;
    }
  }

  // Récupérer toutes les catégories
  async getCategories() {
    try {
      const html = await this.fetchPage(this.baseUrl);
      const $ = cheerio.load(html);
      const categories = [];

      // Adapter les sélecteurs selon la structure du site
      $('.category-item, .category, [class*="category"]').each((i, elem) => {
        const name = $(elem).find('a, .category-name').text().trim();
        const link = $(elem).find('a').attr('href');
        
        if (name && link) {
          categories.push({
            name,
            url: link.startsWith('http') ? link : `${this.baseUrl}${link}`
          });
        }
      });

      console.log(`✅ ${categories.length} catégories trouvées`);
      return categories;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des catégories:', error.message);
      throw error;
    }
  }

  // Récupérer tous les albums (produits) d'une catégorie
  async getAlbumsFromCategory(categoryUrl) {
    try {
      const html = await this.fetchPage(categoryUrl);
      const $ = cheerio.load(html);
      const albums = [];

      // Adapter les sélecteurs selon la structure du site
      $('.album-item, .product-item, [class*="album"], [class*="product"]').each((i, elem) => {
        const title = $(elem).find('.title, .name, h2, h3').text().trim();
        const link = $(elem).find('a').attr('href');
        const price = $(elem).find('.price, [class*="price"]').text().trim();
        
        if (title && link) {
          albums.push({
            title,
            url: link.startsWith('http') ? link : `${this.baseUrl}${link}`,
            originalPrice: price
          });
        }
      });

      console.log(`✅ ${albums.length} albums trouvés dans la catégorie`);
      return albums;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des albums:', error.message);
      throw error;
    }
  }

  // Récupérer toutes les images d'un album
  async getImagesFromAlbum(albumUrl) {
    try {
      const html = await this.fetchPage(albumUrl);
      const $ = cheerio.load(html);
      const images = [];

      // Adapter les sélecteurs selon la structure du site
      $('img[src*="product"], img[src*="album"], .gallery img, [class*="image"] img').each((i, elem) => {
        let src = $(elem).attr('src') || $(elem).attr('data-src');
        
        if (src && !src.includes('logo') && !src.includes('icon')) {
          // Convertir en URL absolue si nécessaire
          if (!src.startsWith('http')) {
            src = src.startsWith('/') ? `${this.baseUrl}${src}` : `${this.baseUrl}/${src}`;
          }
          images.push(src);
        }
      });

      // Limiter à 8 images max
      const uniqueImages = [...new Set(images)].slice(0, 8);
      console.log(`✅ ${uniqueImages.length} images trouvées dans l'album`);
      return uniqueImages;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des images:', error.message);
      throw error;
    }
  }

  // Télécharger une image et l'uploader sur Firebase Storage
  async downloadAndUploadImage(imageUrl, productId, index) {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        headers: {
          'Cookie': this.session ? this.session.join('; ') : '',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const buffer = Buffer.from(response.data);
      const extension = imageUrl.split('.').pop().split('?')[0] || 'jpg';
      const filename = `products/${productId}/${Date.now()}_${index}.${extension}`;
      
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, buffer, {
        contentType: response.headers['content-type'] || 'image/jpeg'
      });

      const downloadUrl = await getDownloadURL(storageRef);
      console.log(`✅ Image ${index + 1} uploadée`);
      return downloadUrl;
    } catch (error) {
      console.error(`❌ Erreur upload image ${index + 1}:`, error.message);
      return null;
    }
  }

  // Scrapper un produit complet et l'ajouter à Firebase
  async scrapeAndAddProduct(albumUrl, category, priceMultiplier = 1.3) {
    try {
      console.log(`\n📦 Scraping: ${albumUrl}`);
      
      // Récupérer les détails de l'album
      const html = await this.fetchPage(albumUrl);
      const $ = cheerio.load(html);
      
      const title = $('h1, .product-title, .album-title').first().text().trim();
      const description = $('.description, .product-description, p').first().text().trim();
      const originalPriceText = $('.price, .product-price, [class*="price"]').first().text().trim();
      
      // Extraire le prix numérique
      const priceMatch = originalPriceText.match(/[\d.,]+/);
      const originalPrice = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : 0;
      const myPrice = Math.round(originalPrice * priceMultiplier * 100) / 100;

      // Récupérer toutes les images
      const imageUrls = await this.getImagesFromAlbum(albumUrl);
      
      if (imageUrls.length === 0) {
        console.log('⚠️ Aucune image trouvée, produit ignoré');
        return null;
      }

      // Créer un ID temporaire pour le produit
      const tempId = Date.now().toString();
      
      // Uploader toutes les images sur Firebase
      console.log(`📸 Upload de ${imageUrls.length} images...`);
      const uploadedImages = [];
      for (let i = 0; i < imageUrls.length; i++) {
        const uploadedUrl = await this.downloadAndUploadImage(imageUrls[i], tempId, i);
        if (uploadedUrl) {
          uploadedImages.push(uploadedUrl);
        }
      }

      if (uploadedImages.length === 0) {
        console.log('⚠️ Aucune image uploadée, produit ignoré');
        return null;
      }

      // Créer le produit dans Firestore
      const productData = {
        title: title || 'Produit sans titre',
        description: description || 'Description à compléter',
        price: myPrice,
        originalPrice: originalPrice,
        category: category,
        images: uploadedImages,
        status: 'available',
        condition: 'new',
        brand: 'Importé',
        sourceUrl: albumUrl,
        views: 0,
        likes: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'products'), productData);
      console.log(`✅ Produit ajouté: ${docRef.id} - ${title} - ${myPrice}€`);
      
      return {
        id: docRef.id,
        ...productData
      };
    } catch (error) {
      console.error('❌ Erreur lors du scraping du produit:', error.message);
      return null;
    }
  }

  // Scrapper toute une catégorie
  async scrapeCategory(categoryUrl, categoryName, priceMultiplier = 1.3, limit = null) {
    try {
      console.log(`\n🔍 Scraping catégorie: ${categoryName}`);
      
      const albums = await this.getAlbumsFromCategory(categoryUrl);
      const albumsToScrape = limit ? albums.slice(0, limit) : albums;
      
      console.log(`📦 ${albumsToScrape.length} produits à scrapper`);
      
      const results = [];
      for (let i = 0; i < albumsToScrape.length; i++) {
        console.log(`\n[${i + 1}/${albumsToScrape.length}]`);
        const product = await this.scrapeAndAddProduct(
          albumsToScrape[i].url,
          categoryName,
          priceMultiplier
        );
        
        if (product) {
          results.push(product);
        }
        
        // Pause entre chaque produit pour ne pas surcharger le serveur
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      console.log(`\n✅ Catégorie terminée: ${results.length}/${albumsToScrape.length} produits ajoutés`);
      return results;
    } catch (error) {
      console.error('❌ Erreur lors du scraping de la catégorie:', error.message);
      throw error;
    }
  }

  // Scrapper tout le site
  async scrapeAllSite(priceMultiplier = 1.3, limitPerCategory = null) {
    try {
      console.log('\n🚀 Début du scraping complet du site');
      
      const categories = await this.getCategories();
      const allResults = [];
      
      for (let i = 0; i < categories.length; i++) {
        console.log(`\n📁 [${i + 1}/${categories.length}] ${categories[i].name}`);
        
        const products = await this.scrapeCategory(
          categories[i].url,
          categories[i].name,
          priceMultiplier,
          limitPerCategory
        );
        
        allResults.push(...products);
        
        // Pause entre chaque catégorie
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      console.log(`\n🎉 Scraping terminé: ${allResults.length} produits ajoutés au total`);
      return allResults;
    } catch (error) {
      console.error('❌ Erreur lors du scraping complet:', error.message);
      throw error;
    }
  }
}

export default new ScraperService();
