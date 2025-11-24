import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  user: null,
  userProfile: null,
  loading: false,
  error: null,

  // Initialiser l'écoute de l'état d'authentification
  initAuth: () => {
    set({ loading: true });
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Récupérer le profil utilisateur
          const profile = await userService.getUserProfile(user.uid);
          set({ user, userProfile: profile, loading: false });
        } catch (error) {
          console.error('Erreur lors de la récupération du profil:', error);
          set({ user, userProfile: null, loading: false });
        }
      } else {
        set({ user: null, userProfile: null, loading: false });
      }
    });
  },

  // Inscription
  signUp: async (email, password, username) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Mettre à jour le profil Firebase
      await updateProfile(userCredential.user, {
        displayName: username,
      });

      // Créer le profil dans Firestore via l'API
      const token = await userCredential.user.getIdToken();
      const profile = await userService.createProfile({
        username,
        email,
        displayName: username,
      });

      set({ user: userCredential.user, userProfile: profile, loading: false });
      toast.success('Compte créé avec succès !');
      return userCredential.user;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      set({ error: error.message, loading: false });
      toast.error(error.message);
      throw error;
    }
  },

  // Connexion
  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Récupérer le profil
      const profile = await userService.getUserProfile(userCredential.user.uid);
      
      set({ user: userCredential.user, userProfile: profile, loading: false });
      toast.success('Connexion réussie !');
      return userCredential.user;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      set({ error: error.message, loading: false });
      toast.error('Email ou mot de passe incorrect');
      throw error;
    }
  },

  // Déconnexion
  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null, userProfile: null });
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
      throw error;
    }
  },

  // Mettre à jour le profil
  updateUserProfile: async (data) => {
    try {
      const updatedProfile = await userService.updateProfile(data);
      set({ userProfile: updatedProfile });
      toast.success('Profil mis à jour !');
      return updatedProfile;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error('Erreur lors de la mise à jour');
      throw error;
    }
  },
}));
