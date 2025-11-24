import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, TrendingUp, Search } from 'lucide-react';
import ProductCard from '../../features/products/components/ProductCard';
import EmptyState from '../../shared/ui/EmptyState';
import Button from '../../shared/ui/Button';
import Input from '../../shared/ui/Input';
import Badge from '../../shared/ui/Badge';
import { SkeletonProductCard } from '../../shared/ui/Skeleton';
import { cn } from '../../shared/utils/cn';
import { userService } from '../../services/userService';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [priceAlerts, setPriceAlerts] = useState({});

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await userService.getFavorites();
      setFavorites(data || []);
      
      // Initialize price alerts (mock data)
      const alerts = {};
      data.forEach(item => {
        alerts[item.id] = false;
      });
      setPriceAlerts(alerts);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Erreur lors du chargement des favoris');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId) => {
    try {
      await userService.removeFavorite(productId);
      setFavorites(favorites.filter(f => f.id !== productId));
      toast.success('Retiré des favoris');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleAddToCart = (product) => {
    toast.success(`${product.title} ajouté au panier`);
  };

  const handleTogglePriceAlert = (productId) => {
    setPriceAlerts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
    
    if (!priceAlerts[productId]) {
      toast.success('Alerte prix activée');
    } else {
      toast.info('Alerte prix désactivée');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  // Filter and sort favorites
  const filteredFavorites = favorites
    .filter(product => {
      if (!searchQuery) return true;
      return product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.addedAt || b.createdAt) - new Date(a.addedAt || a.createdAt);
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Calculate stats
  const stats = {
    total: favorites.length,
    totalValue: favorites.reduce((sum, item) => sum + item.price, 0),
    onSale: favorites.filter(item => item.oldPrice && item.oldPrice > item.price).length,
    priceDrops: favorites.filter(item => {
      // Mock: simulate some price drops
      return Math.random() > 0.7 && item.oldPrice;
    }).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mes favoris</h1>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonProductCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes favoris</h1>
          <p className="text-gray-600 mt-1">
            Articles sauvegardés et alertes prix
          </p>
        </div>

        {favorites.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Aucun favori"
            description="Explorez notre catalogue et ajoutez vos articles préférés"
            action={{
              label: 'Explorer le catalogue',
              onClick: () => navigate('/catalog')
            }}
          />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <Heart className="h-8 w-8 text-red-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Articles favoris</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalValue)}</p>
                <p className="text-sm text-gray-600">Valeur totale</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <Badge variant="danger" className="mb-2">-20%</Badge>
                <p className="text-2xl font-bold text-gray-900">{stats.onSale}</p>
                <p className="text-sm text-gray-600">En promotion</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center mb-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2" />
                  <span className="text-sm text-green-600 font-medium">Actif</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.priceDrops}</p>
                <p className="text-sm text-gray-600">Alertes prix</p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Rechercher dans mes favoris..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="h-5 w-5 text-gray-400" />}
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="recent">Plus récents</option>
                  <option value="price_low">Prix croissant</option>
                  <option value="price_high">Prix décroissant</option>
                  <option value="name">Nom A-Z</option>
                </select>
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFavorites.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductCard
                    product={product}
                    onLike={() => handleRemoveFavorite(product.id)}
                  />
                  
                  {/* Quick Actions Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={priceAlerts[product.id] ? 'success' : 'outline'}
                        className="flex-1 bg-white/90"
                        onClick={() => handleTogglePriceAlert(product.id)}
                        title="Alerte baisse de prix"
                      >
                        🔔
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleRemoveFavorite(product.id)}
                        title="Retirer des favoris"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Price Drop Badge */}
                  {product.oldPrice && product.oldPrice > product.price && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge variant="danger" size="sm">
                        -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                      </Badge>
                    </div>
                  )}

                  {/* Price Alert Indicator */}
                  {priceAlerts[product.id] && (
                    <div className="absolute top-2 right-12 z-10">
                      <div className="bg-green-500 text-white p-1.5 rounded-full animate-pulse">
                        <span className="text-xs">🔔</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Empty Search Results */}
            {filteredFavorites.length === 0 && searchQuery && (
              <EmptyState
                icon={Search}
                title="Aucun résultat"
                description={`Aucun favori ne correspond à "${searchQuery}"`}
                action={{
                  label: 'Réinitialiser la recherche',
                  onClick: () => setSearchQuery('')
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
