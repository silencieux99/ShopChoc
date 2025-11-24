import { create } from 'zustand';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

export const useProductStore = create((set, get) => ({
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  filters: {
    page: 1,
    limit: 25,
    sort: 'desc',
    minPrice: null,
    maxPrice: null,
    category: 'all',
    search: '',
  },
  totalPages: 1,

  // Récupérer les produits
  fetchProducts: async (filters = {}) => {
    try {
      set({ loading: true, error: null });
      const mergedFilters = { ...get().filters, ...filters };
      const data = await productService.getProducts(mergedFilters);
      
      set({
        products: data.products || [],
        totalPages: data.totalPages || 1,
        filters: mergedFilters,
        loading: false,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      console.error('Détails:', error.response?.data || error.message);
      
      set({ 
        error: error.message, 
        loading: false,
        products: [] // Assurer qu'on a un tableau vide en cas d'erreur
      });
      
      const errorMessage = error.response?.data?.error || 'Erreur lors du chargement des produits';
      toast.error(errorMessage);
    }
  },

  // Récupérer un produit par ID
  fetchProductById: async (id) => {
    try {
      set({ loading: true, error: null });
      const product = await productService.getProductById(id);
      set({ currentProduct: product, loading: false });
      return product;
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      set({ error: error.message, loading: false });
      toast.error('Produit non trouvé');
      throw error;
    }
  },

  // Créer un produit
  createProduct: async (formData) => {
    try {
      set({ loading: true, error: null });
      const product = await productService.createProduct(formData);
      set({ loading: false });
      toast.success('Produit publié avec succès !');
      return product;
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      set({ error: error.message, loading: false });
      toast.error('Erreur lors de la publication');
      throw error;
    }
  },

  // Mettre à jour un produit
  updateProduct: async (id, formData) => {
    try {
      set({ loading: true, error: null });
      const product = await productService.updateProduct(id, formData);
      set({ currentProduct: product, loading: false });
      toast.success('Produit mis à jour !');
      return product;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      set({ error: error.message, loading: false });
      toast.error('Erreur lors de la mise à jour');
      throw error;
    }
  },

  // Supprimer un produit
  deleteProduct: async (id) => {
    try {
      set({ loading: true, error: null });
      await productService.deleteProduct(id);
      set({ loading: false });
      toast.success('Produit supprimé');
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      set({ error: error.message, loading: false });
      toast.error('Erreur lors de la suppression');
      throw error;
    }
  },

  // Liker/Unliker un produit
  toggleLike: async (id) => {
    try {
      await productService.toggleLike(id);
      // Mettre à jour le produit courant si c'est celui-ci
      if (get().currentProduct?.id === id) {
        const updated = await productService.getProductById(id);
        set({ currentProduct: updated });
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast.error('Erreur lors du like');
    }
  },

  // Mettre à jour les filtres
  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  // Réinitialiser les filtres
  resetFilters: () => {
    set({
      filters: {
        page: 1,
        limit: 25,
        sort: 'desc',
        minPrice: null,
        maxPrice: null,
        category: 'all',
        search: '',
      },
    });
  },
}));
