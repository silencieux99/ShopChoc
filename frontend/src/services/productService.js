import { db, storage } from '../config/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth } from '../config/firebase';

export const productService = {
  // Upload d'images vers Firebase Storage
  uploadImages: async (files) => {
    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    });
    return Promise.all(uploadPromises);
  },

  // Supprimer une image de Firebase Storage
  deleteImage: async (imageUrl) => {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
    }
  },

  // Récupérer tous les produits avec filtres avancés
  getProducts: async (filters = {}) => {
    try {
      let q = query(collection(db, 'products'));
      
      // Filtres de base
      if (filters.category && filters.category !== 'all') {
        q = query(q, where('category', '==', filters.category));
      }
      
      if (filters.subcategory) {
        q = query(q, where('subcategory', '==', filters.subcategory));
      }
      
      if (filters.userId) {
        q = query(q, where('userId', '==', filters.userId));
      }
      
      if (filters.brand) {
        q = query(q, where('brand', '==', filters.brand));
      }
      
      if (filters.size) {
        q = query(q, where('sizes', 'array-contains', filters.size));
      }
      
      if (filters.color) {
        q = query(q, where('colors', 'array-contains', filters.color));
      }
      
      if (filters.condition) {
        q = query(q, where('condition', '==', filters.condition));
      }
      
      if (filters.featured) {
        q = query(q, where('isFeatured', '==', true));
      }
      
      if (filters.status && filters.status !== 'all') {
        q = query(q, where('status', '==', filters.status));
      } else if (!filters.status) {
        // Par défaut, ne montrer que les articles disponibles
        q = query(q, where('status', '==', 'available'));
      }
      // Si status === 'all', ne pas filtrer par status
      
      // Prix
      if (filters.minPrice) {
        q = query(q, where('price', '>=', parseFloat(filters.minPrice)));
      }
      
      if (filters.maxPrice) {
        q = query(q, where('price', '<=', parseFloat(filters.maxPrice)));
      }
      
      // Tri
      switch (filters.sort) {
        case 'price_asc':
          q = query(q, orderBy('price', 'asc'));
          break;
        case 'price_desc':
          q = query(q, orderBy('price', 'desc'));
          break;
        case 'newest':
          q = query(q, orderBy('createdAt', 'desc'));
          break;
        case 'oldest':
          q = query(q, orderBy('createdAt', 'asc'));
          break;
        case 'popular':
          q = query(q, orderBy('views', 'desc'));
          break;
        case 'rating':
          q = query(q, orderBy('rating', 'desc'));
          break;
        default:
          q = query(q, orderBy('createdAt', 'desc'));
      }
      
      // Pagination
      const pageSize = filters.limit || 24;
      const page = filters.page || 1;
      
      if (filters.limit) {
        q = query(q, limit(pageSize));
      }
      
      // Si pagination avec curseur
      if (filters.lastDoc) {
        q = query(q, startAfter(filters.lastDoc));
      }
      
      const querySnapshot = await getDocs(q);
      const products = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
        });
      });
      
      // Recherche textuelle (côté client pour l'instant)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const filtered = products.filter(product => 
          product.title?.toLowerCase().includes(searchTerm) ||
          product.description?.toLowerCase().includes(searchTerm) ||
          product.brand?.toLowerCase().includes(searchTerm)
        );
        
        return {
          products: filtered,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / pageSize)
        };
      }
      
      return {
        products,
        total: products.length,
        totalPages: Math.ceil(products.length / pageSize)
      };
    } catch (error) {
      console.error('Erreur Firestore:', error);
      throw error;
    }
  },

  // Récupérer un produit par ID
  getProductById: async (id) => {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Produit non trouvé');
    }

    // Incrémenter les vues
    await updateDoc(docRef, {
      views: increment(1)
    });

    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  },

  // Créer un nouveau produit
  createProduct: async (formData) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Vous devez être connecté');
    }

    // Upload des images
    let imageUrls = [];
    if (formData.images && formData.images.length > 0) {
      imageUrls = await productService.uploadImages(formData.images);
    }

    // Créer le produit
    const productData = {
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      condition: formData.condition,
      brand: formData.brand || '',
      size: formData.size || '',
      images: imageUrls,
      userId: user.uid,
      status: 'available',
      likes: [],
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'products'), productData);
    
    return {
      id: docRef.id,
      ...productData
    };
  },

  // Mettre à jour un produit
  updateProduct: async (id, formData) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Vous devez être connecté');
    }

    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Produit non trouvé');
    }

    if (docSnap.data().userId !== user.uid) {
      throw new Error('Non autorisé');
    }

    // Upload de nouvelles images si présentes
    let newImageUrls = [];
    if (formData.images && formData.images.length > 0) {
      newImageUrls = await productService.uploadImages(formData.images);
    }

    const updates = {
      ...formData,
      images: newImageUrls.length > 0 ? [...(docSnap.data().images || []), ...newImageUrls] : docSnap.data().images,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(docRef, updates);

    const updatedDoc = await getDoc(docRef);
    return {
      id: updatedDoc.id,
      ...updatedDoc.data()
    };
  },

  // Supprimer un produit
  deleteProduct: async (id) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Vous devez être connecté');
    }

    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Produit non trouvé');
    }

    if (docSnap.data().userId !== user.uid) {
      throw new Error('Non autorisé');
    }

    // Supprimer les images
    const images = docSnap.data().images || [];
    for (const imageUrl of images) {
      await productService.deleteImage(imageUrl);
    }

    await deleteDoc(docRef);
    return { message: 'Produit supprimé avec succès' };
  },

  // Liker/Unliker un produit
  toggleLike: async (id) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Vous devez être connecté');
    }

    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Produit non trouvé');
    }

    const likes = docSnap.data().likes || [];
    const isLiked = likes.includes(user.uid);

    if (isLiked) {
      await updateDoc(docRef, {
        likes: arrayRemove(user.uid)
      });
    } else {
      await updateDoc(docRef, {
        likes: arrayUnion(user.uid)
      });
    }

    const updatedDoc = await getDoc(docRef);
    return { likes: updatedDoc.data().likes };
  },

  // Récupérer les produits d'un utilisateur
  getUserProducts: async (userId) => {
    const q = query(
      collection(db, 'products'),
      where('userId', '==', userId)
    );

    const snapshot = await getDocs(q);
    const products = [];

    snapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Tri par date
    products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return products;
  },
};
