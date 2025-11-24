import { db, storage } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

class ScraperService {
  constructor() {
    this.baseUrl = '';
    this.username = '';
    this.password = '';
    this.isAuthenticated = false;
  }

  // Configurer les credentials
  setCredentials(baseUrl, username, password) {
    this.baseUrl = baseUrl;
    this.username = username;
    this.password = password;
  }

  // Récupérer une page via proxy CORS
  async fetchPage(url) {
    try {
      // Utiliser un proxy CORS public
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Erreur fetch:', error);
      throw error;
    }
  }

  // Parser le HTML et extraire les catégories
  async getCategories() {
    try {
      const html = await this.fetchPage(this.baseUrl);
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const categories = [];

      // Adapter ces sélecteurs selon la structure du site
      const categoryElements = doc.querySelectorAll('.category-item, .category, [class*="category"], a[href*="category"]');
      
      categoryElements.forEach((elem) => {
        const name = elem.textContent.trim();
        const link = elem.getAttribute('href');
        
        if (name && link && !categories.find(c => c.url === link)) {
          categories.push({
            name,
            url: link.startsWith('http') ? link : `${this.baseUrl}${link}`
          });
        }
      });

      console.log(`✅ ${categories.length} catégories trouvées`);
      return categories;
    } catch (error) {
      console.error('❌ Erreur catégories:', error);
      throw error;
    }
  }

  // Récupérer les albums d'une catégorie
  async getAlbumsFromCategory(categoryUrl) {
    try {
      const html = await this.fetchPage(categoryUrl);
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const albums = [];

      // Adapter ces sélecteurs
      const albumElements = doc.querySelectorAll('.album-item, .product-item, [class*="album"], [class*="product"], a[href*="product"]');
      
      albumElements.forEach((elem) => {
        const title = elem.querySelector('.title, .name, h2, h3, h4')?.textContent.trim() || elem.textContent.trim();
        const link = elem.getAttribute('href') || elem.querySelector('a')?.getAttribute('href');
        const priceElem = elem.querySelector('.price, [class*="price"]');
        const price = priceElem?.textContent.trim();
        
        if (title && link && !albums.find(a => a.url === link)) {
          albums.push({
            title,
            url: link.startsWith('http') ? link : `${this.baseUrl}${link}`,
            originalPrice: price
          });
        }
      });

      console.log(`✅ ${albums.length} albums trouvés`);
      return albums;
    } catch (error) {
      console.error('❌ Erreur albums:', error);
      throw error;
    }
  }

  // Récupérer les images d'un album
  async getImagesFromAlbum(albumUrl) {
    try {
      const html = await this.fetchPage(albumUrl);
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const images = [];

      // Adapter ces sélecteurs
      const imgElements = doc.querySelectorAll('img[src*="product"], img[src*="album"], .gallery img, [class*="image"] img, img');
      
      imgElements.forEach((img) => {
        let src = img.getAttribute('src') || img.getAttribute('data-src');
        
        if (src && !src.includes('logo') && !src.includes('icon') && !src.includes('placeholder')) {
          if (!src.startsWith('http')) {
            src = src.startsWith('/') ? `${this.baseUrl}${src}` : `${this.baseUrl}/${src}`;
          }
          if (!images.includes(src)) {
            images.push(src);
          }
        }
      });

      const uniqueImages = images.slice(0, 8);
      console.log(`✅ ${uniqueImages.length} images trouvées`);
      return uniqueImages;
    } catch (error) {
      console.error('❌ Erreur images:', error);
      return [];
    }
  }

  // Télécharger et uploader une image
  async downloadAndUploadImage(imageUrl, productId, index) {
    try {
      // Utiliser un proxy CORS pour télécharger l'image
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`;
      
      const response = await fetch(proxyUrl);
      const blob = await response.blob();
      
      const extension = imageUrl.split('.').pop().split('?')[0] || 'jpg';
      const filename = `products/${productId}/${Date.now()}_${index}.${extension}`;
      
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, blob);
      
      const downloadUrl = await getDownloadURL(storageRef);
      console.log(`✅ Image ${index + 1} uploadée`);
      return downloadUrl;
    } catch (error) {
      console.error(`❌ Erreur upload image ${index + 1}:`, error);
      return null;
    }
  }

  // Scrapper et ajouter un produit
  async scrapeAndAddProduct(albumUrl, category, priceMultiplier = 1.3, onProgress) {
    try {
      if (onProgress) onProgress({ status: 'fetching', message: 'Récupération des données...' });
      
      const html = await this.fetchPage(albumUrl);
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extraire les infos (adapter les sélecteurs)
      const title = doc.querySelector('h1, .product-title, .album-title')?.textContent.trim() || 'Produit sans titre';
      const description = doc.querySelector('.description, .product-description, p')?.textContent.trim() || 'Description à compléter';
      const priceText = doc.querySelector('.price, .product-price, [class*="price"]')?.textContent.trim() || '0';
      
      const priceMatch = priceText.match(/[\d.,]+/);
      const originalPrice = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : 0;
      const myPrice = Math.round(originalPrice * priceMultiplier * 100) / 100;

      if (onProgress) onProgress({ status: 'images', message: 'Récupération des images...' });
      const imageUrls = await this.getImagesFromAlbum(albumUrl);
      
      if (imageUrls.length === 0) {
        throw new Error('Aucune image trouvée');
      }

      const tempId = Date.now().toString();
      
      if (onProgress) onProgress({ status: 'uploading', message: `Upload de ${imageUrls.length} images...` });
      const uploadedImages = [];
      
      for (let i = 0; i < imageUrls.length; i++) {
        if (onProgress) onProgress({ status: 'uploading', message: `Upload image ${i + 1}/${imageUrls.length}...` });
        const uploadedUrl = await this.downloadAndUploadImage(imageUrls[i], tempId, i);
        if (uploadedUrl) {
          uploadedImages.push(uploadedUrl);
        }
      }

      if (uploadedImages.length === 0) {
        throw new Error('Aucune image uploadée');
      }

      if (onProgress) onProgress({ status: 'saving', message: 'Enregistrement du produit...' });
      
      const productData = {
        title,
        description,
        price: myPrice,
        originalPrice,
        category,
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
      
      if (onProgress) onProgress({ status: 'success', message: 'Produit ajouté !' });
      
      return {
        id: docRef.id,
        ...productData
      };
    } catch (error) {
      if (onProgress) onProgress({ status: 'error', message: error.message });
      throw error;
    }
  }

  // Scrapper une catégorie complète
  async scrapeCategory(categoryUrl, categoryName, priceMultiplier = 1.3, limit = null, onProgress) {
    try {
      const albums = await this.getAlbumsFromCategory(categoryUrl);
      const albumsToScrape = limit ? albums.slice(0, limit) : albums;
      
      const results = [];
      
      for (let i = 0; i < albumsToScrape.length; i++) {
        if (onProgress) {
          onProgress({
            current: i + 1,
            total: albumsToScrape.length,
            album: albumsToScrape[i].title
          });
        }
        
        try {
          const product = await this.scrapeAndAddProduct(
            albumsToScrape[i].url,
            categoryName,
            priceMultiplier,
            (progress) => {
              if (onProgress) {
                onProgress({
                  current: i + 1,
                  total: albumsToScrape.length,
                  album: albumsToScrape[i].title,
                  ...progress
                });
              }
            }
          );
          
          if (product) {
            results.push(product);
          }
        } catch (error) {
          console.error(`Erreur produit ${i + 1}:`, error);
        }
        
        // Pause entre chaque produit
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      return results;
    } catch (error) {
      console.error('Erreur scraping catégorie:', error);
      throw error;
    }
  }
}

export default new ScraperService();
