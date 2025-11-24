import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';

const CATEGORIES = [
  'Tous',
  'Vêtements',
  'Chaussures',
  'Accessoires',
  'Électronique',
  'Maison',
  'Sport',
  'Autre',
];

export default function FilterBar() {
  const { filters, setFilters, fetchProducts } = useProductStore();
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    minPrice: filters.minPrice || '',
    maxPrice: filters.maxPrice || '',
    category: filters.category || 'all',
  });

  const handleCategoryChange = (category) => {
    const categoryValue = category === 'Tous' ? 'all' : category;
    setLocalFilters({ ...localFilters, category: categoryValue });
    setFilters({ category: categoryValue, page: 1 });
    fetchProducts({ category: categoryValue, page: 1 });
  };

  const handleSortChange = (sort) => {
    setFilters({ sort, page: 1 });
    fetchProducts({ sort, page: 1 });
  };

  const handlePriceFilter = () => {
    const priceFilters = {
      minPrice: localFilters.minPrice ? parseFloat(localFilters.minPrice) : null,
      maxPrice: localFilters.maxPrice ? parseFloat(localFilters.maxPrice) : null,
      page: 1,
    };
    setFilters(priceFilters);
    fetchProducts(priceFilters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setLocalFilters({ minPrice: '', maxPrice: '', category: 'all' });
    setFilters({ minPrice: null, maxPrice: null, category: 'all', page: 1 });
    fetchProducts({ minPrice: null, maxPrice: null, category: 'all', page: 1 });
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-14 sm:top-16 z-40">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
        {/* Catégories */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
          {CATEGORIES.map((category) => {
            const isActive =
              (category === 'Tous' && localFilters.category === 'all') ||
              category === localFilters.category;

            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-full whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Filtres et tri */}
        <div className="flex items-center justify-between mt-2 sm:mt-4 gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Filtres</span>
          </button>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">Trier:</span>
            <select
              value={filters.sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="desc">Prix ↓</option>
              <option value="asc">Prix ↑</option>
            </select>
          </div>
        </div>

        {/* Panel de filtres */}
        {showFilters && (
          <div className="mt-2 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filtres de prix</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Min (€)
                </label>
                <input
                  type="number"
                  value={localFilters.minPrice}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, minPrice: e.target.value })
                  }
                  placeholder="0"
                  min="0"
                  className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Max (€)
                </label>
                <input
                  type="number"
                  value={localFilters.maxPrice}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, maxPrice: e.target.value })
                  }
                  placeholder="1000"
                  min="0"
                  className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-2 mt-3 sm:mt-4">
              <button
                onClick={handlePriceFilter}
                className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Appliquer
              </button>
              <button
                onClick={clearFilters}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Réinit.
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
