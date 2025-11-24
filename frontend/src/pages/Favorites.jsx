import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { userService } from '../services/userService';
import ProductCard from '../components/ProductCard';
import { Heart, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Favorites() {
  const { user } = useAuthStore();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await userService.getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Heart className="w-8 h-8 mr-3 text-red-500 fill-red-500" />
            Mes favoris
          </h1>
          <p className="text-gray-600 mt-2">
            {favorites.length} article{favorites.length !== 1 ? 's' : ''} sauvegardé{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Liste des favoris */}
        {favorites.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun favori
            </h3>
            <p className="text-gray-600">
              Ajoutez des articles à vos favoris en cliquant sur le cœur
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
