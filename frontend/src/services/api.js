import axios from 'axios';
import { auth } from '../config/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      // Continue sans token pour les routes publiques
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    
    // Ne pas rediriger vers login pour les routes publiques
    const publicRoutes = ['/products', '/products/'];
    const isPublicRoute = publicRoutes.some(route => 
      error.config?.url?.includes(route)
    );
    
    if (error.response?.status === 401 && !isPublicRoute) {
      // Rediriger vers la page de connexion uniquement pour les routes protégées
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
