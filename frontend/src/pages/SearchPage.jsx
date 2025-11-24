import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, TrendingUp } from 'lucide-react';
import ProductCard from '../features/products/components/ProductCard';
import EmptyState from '../shared/ui/EmptyState';
import { SkeletonProductCard } from '../shared/ui/Skeleton';
import FilterBar from '../components/FilterBar';
import { productService } from '../services/productService';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchHistory, setSearchHistory] = useState([
    'Nike Air Max',
    'Jean Levi\'s',
    'Robe d\'été',
    'Sac à main',
    'Sneakers blanches'
  ]);

  const [trendingSearches] = useState([
    'Vintage',
    'Streetwear',
    'Y2K',
    'Nike Dunk',
    'Oversize',
    'Blazer femme',
    'Sac designer',
    'Boots cuir'
  ]);

  useEffect(() => {
    if (query) {
      searchProducts();
      // Add to search history
      if (!searchHistory.includes(query)) {
        setSearchHistory([query, ...searchHistory.slice(0, 4)]);
      }
    } else {
      setLoading(false);
    }
  }, [query]);

  const searchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts({ search: query });
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const q = formData.get('search');
            if (q) handleSearch(q);
          }}>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                name="search"
                type="text"
                defaultValue={query}
                placeholder="Rechercher des articles, marques..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-2 px-4 py-1.5 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                Rechercher
              </button>
            </div>
          </form>

          {query && (
            <p className="mt-4 text-gray-600">
              Résultats pour "<span className="font-semibold text-gray-900">{query}</span>"
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!query ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="font-semibold text-gray-900 mb-4">
                  Recherches récentes
                </h2>
                <div className="space-y-2">
                  {searchHistory.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(term)}
                      className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span className="text-gray-700">{term}</span>
                      <Search className="h-4 w-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
                <h2 className="font-semibold text-gray-900">
                  Tendances du moment
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Filter Bar */}
            <FilterBar />

            {/* Search Results */}
            <div className="mt-8">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <SkeletonProductCard key={i} />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <p className="text-gray-600 mb-6">
                    {products.length} article{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState
                  icon={Search}
                  title="Aucun résultat trouvé"
                  description={`Aucun article ne correspond à "${query}"`}
                  action={{
                    label: 'Essayer une autre recherche',
                    onClick: () => {
                      const input = document.querySelector('input[name="search"]');
                      if (input) {
                        input.value = '';
                        input.focus();
                      }
                    }
                  }}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
