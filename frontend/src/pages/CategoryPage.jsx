import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from '../features/products/components/ProductCard';
import FilterBar from '../components/FilterBar';
import EmptyState from '../shared/ui/EmptyState';
import { SkeletonProductCard } from '../shared/ui/Skeleton';
import { productService } from '../services/productService';
import { cn } from '../shared/utils/cn';

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  const categoryInfo = {
    femme: {
      title: 'Femme',
      description: 'Mode féminine tendance et élégante',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1600&h=400&fit=crop',
      subcategories: [
        { id: 'robes', name: 'Robes' },
        { id: 'tops', name: 'Tops & T-shirts' },
        { id: 'pantalons', name: 'Pantalons & Jeans' },
        { id: 'vestes', name: 'Vestes & Manteaux' },
        { id: 'chaussures', name: 'Chaussures' },
        { id: 'accessoires', name: 'Accessoires' }
      ]
    },
    homme: {
      title: 'Homme',
      description: 'Collection masculine moderne',
      image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1600&h=400&fit=crop',
      subcategories: [
        { id: 'chemises', name: 'Chemises' },
        { id: 't-shirts', name: 'T-shirts & Polos' },
        { id: 'pantalons', name: 'Pantalons & Jeans' },
        { id: 'vestes', name: 'Vestes & Blazers' },
        { id: 'chaussures', name: 'Chaussures' },
        { id: 'accessoires', name: 'Accessoires' }
      ]
    },
    enfant: {
      title: 'Enfant',
      description: 'Vêtements pour enfants de tous âges',
      image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=1600&h=400&fit=crop',
      subcategories: [
        { id: 'bebe', name: 'Bébé (0-2 ans)' },
        { id: 'fille', name: 'Fille (2-14 ans)' },
        { id: 'garcon', name: 'Garçon (2-14 ans)' },
        { id: 'chaussures', name: 'Chaussures' },
        { id: 'accessoires', name: 'Accessoires' }
      ]
    }
  };

  const currentCategory = categoryInfo[slug] || {
    title: 'Catégorie',
    description: '',
    image: '',
    subcategories: []
  };

  useEffect(() => {
    fetchCategoryProducts();
  }, [slug, selectedSubcategory]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      const params = {
        category: slug,
        subcategory: selectedSubcategory,
        limit: 24
      };
      const data = await productService.getProducts(params);
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching category products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={currentCategory.image}
          alt={currentCategory.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-white/80 mb-4">
              <Link to="/" className="hover:text-white">
                Accueil
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white font-medium">
                {currentCategory.title}
              </span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {currentCategory.title}
            </h1>
            <p className="text-white/90">
              {currentCategory.description}
            </p>
          </div>
        </div>
      </div>

      {/* Subcategories */}
      {currentCategory.subcategories.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setSelectedSubcategory('')}
                className={cn(
                  'px-4 py-2 rounded-full whitespace-nowrap transition-colors',
                  !selectedSubcategory
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                Tout voir
              </button>
              {currentCategory.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(sub.id)}
                  className={cn(
                    'px-4 py-2 rounded-full whitespace-nowrap transition-colors',
                    selectedSubcategory === sub.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar />

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonProductCard key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucun article trouvé"
            description="Aucun article disponible dans cette catégorie pour le moment"
            action={{
              label: 'Explorer d\'autres catégories',
              onClick: () => window.location.href = '/catalog'
            }}
          />
        )}
      </div>
    </div>
  );
}
