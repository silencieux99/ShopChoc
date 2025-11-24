import { db, auth } from '../config/firebase.js';
import bcrypt from 'bcrypt';

// Créer un profil utilisateur
export const createUserProfile = async (req, res) => {
  try {
    const { username, email, displayName } = req.body;
    const userId = req.user.uid;

    // Vérifier si le profil existe déjà
    const existingProfile = await db.collection('users').doc(userId).get();
    if (existingProfile.exists) {
      return res.status(400).json({ error: 'Le profil existe déjà' });
    }

    const userProfile = {
      username,
      email,
      displayName: displayName || username,
      createdAt: new Date().toISOString(),
      avatar: '',
      bio: '',
      location: '',
      rating: 0,
      reviewsCount: 0,
      salesCount: 0,
      followers: [],
      following: []
    };

    await db.collection('users').doc(userId).set(userProfile);

    res.status(201).json({
      id: userId,
      ...userProfile
    });
  } catch (error) {
    console.error('Erreur lors de la création du profil:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer un profil utilisateur
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({
      id: userDoc.id,
      ...userDoc.data()
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Mettre à jour le profil utilisateur
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const updates = req.body;

    // Empêcher la modification de certains champs
    delete updates.email;
    delete updates.createdAt;
    delete updates.rating;
    delete updates.reviewsCount;
    delete updates.salesCount;

    await db.collection('users').doc(userId).update(updates);

    const updatedDoc = await db.collection('users').doc(userId).get();
    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Suivre/Ne plus suivre un utilisateur
export const toggleFollow = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const currentUserId = req.user.uid;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ error: 'Vous ne pouvez pas vous suivre vous-même' });
    }

    const currentUserDoc = await db.collection('users').doc(currentUserId).get();
    const targetUserDoc = await db.collection('users').doc(targetUserId).get();

    if (!targetUserDoc.exists) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const following = currentUserDoc.data().following || [];
    const followers = targetUserDoc.data().followers || [];

    const followingIndex = following.indexOf(targetUserId);
    const followersIndex = followers.indexOf(currentUserId);

    if (followingIndex > -1) {
      // Unfollow
      following.splice(followingIndex, 1);
      followers.splice(followersIndex, 1);
    } else {
      // Follow
      following.push(targetUserId);
      followers.push(currentUserId);
    }

    await db.collection('users').doc(currentUserId).update({ following });
    await db.collection('users').doc(targetUserId).update({ followers });

    res.json({ 
      isFollowing: followingIndex === -1,
      followersCount: followers.length
    });
  } catch (error) {
    console.error('Erreur lors du follow/unfollow:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer les favoris d'un utilisateur
export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.uid;

    // Récupérer tous les produits likés par l'utilisateur
    const snapshot = await db.collection('products')
      .where('likes', 'array-contains', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const favorites = [];
    snapshot.forEach(doc => {
      favorites.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(favorites);
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
