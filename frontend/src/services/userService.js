import { db } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, getDocs, query, where, collection } from 'firebase/firestore';
import { auth } from '../config/firebase';
import { productService } from './productService';

export const userService = {
  // Récupérer le profil utilisateur
  getUserProfile: async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Créer le profil s'il n'existe pas
        const defaultProfile = {
          uid: uid,
          email: auth.currentUser?.email,
          username: auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0],
          avatar: auth.currentUser?.photoURL || '',
          bio: '',
          location: '',
          favorites: [],
          rating: 0,
          reviewsCount: 0,
          createdAt: new Date().toISOString()
        };
        await setDoc(docRef, defaultProfile);
        return defaultProfile;
      }

      return {
        uid: docSnap.id,
        ...docSnap.data()
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  // Récupérer le profil utilisateur
  getProfile: async () => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Vous devez être connecté');
    }

    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Créer le profil s'il n'existe pas
      const defaultProfile = {
        uid: user.uid,
        email: user.email,
        username: user.displayName || user.email?.split('@')[0],
        avatar: user.photoURL || '',
        bio: '',
        location: '',
        favorites: [],
        rating: 0,
        reviewsCount: 0,
        createdAt: new Date().toISOString()
      };
      await setDoc(docRef, defaultProfile);
      return defaultProfile;
    }

    return {
      uid: docSnap.id,
      ...docSnap.data()
    };
  },

  // Mettre à jour le profil
  updateProfile: async (data) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Vous devez être connecté');
    }

    const docRef = doc(db, 'users', user.uid);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });

    const updatedDoc = await getDoc(docRef);
    return {
      uid: updatedDoc.id,
      ...updatedDoc.data()
    };
  },

  // Récupérer les favoris
  getFavorites: async () => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Vous devez être connecté');
    }

    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || !docSnap.data().favorites) {
      return [];
    }

    const favoriteIds = docSnap.data().favorites || [];
    
    // Récupérer les produits favoris
    const favoriteProducts = await Promise.all(
      favoriteIds.map(async (productId) => {
        try {
          return await productService.getProductById(productId);
        } catch (error) {
          return null;
        }
      })
    );

    return favoriteProducts.filter(p => p !== null);
  },

  // Ajouter aux favoris
  addFavorite: async (productId) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Vous devez être connecté');
    }

    const docRef = doc(db, 'users', user.uid);
    await updateDoc(docRef, {
      favorites: arrayUnion(productId)
    });

    return { message: 'Ajouté aux favoris' };
  },

  // Retirer des favoris
  removeFavorite: async (productId) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Vous devez être connecté');
    }

    const docRef = doc(db, 'users', user.uid);
    await updateDoc(docRef, {
      favorites: arrayRemove(productId)
    });

    return { message: 'Retiré des favoris' };
  },
};
