import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Filter,
  X,
  ChevronDown,
  Grid,
  List,
  SlidersHorizontal,
  Search,
  Package,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import ProductCard from '../features/products/components/ProductCard';
import Button from '../shared/ui/Button';
import Input from '../shared/ui/Input';
import Select from '../shared/ui/Select';
import Badge from '../shared/ui/Badge';
import EmptyState from '../shared/ui/EmptyState';
import { SkeletonProductCard } from '../shared/ui/Skeleton';
import { cn } from '../shared/utils/cn';
import { productService } from '../services/productService';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    brand: searchParams.get('brand') || '',
    size: searchParams.get('size') || '',
    color: searchParams.get('color') || '',
    condition: searchParams.get('condition') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1')
  });

  // Categories & Options
  const categories = [
    { value: '', label: 'Toutes les catégories' },
    { value: 'femme', label: 'Femme' },
    { value: 'homme', label: 'Homme' },
    { value: 'enfant', label: 'Enfant' },
    { value: 'maison', label: 'Maison & Déco' },
    { value: 'beaute', label: 'Beauté' },
    { value: 'sport', label: 'Sport' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Plus récents' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
    { value: 'popular', label: 'Plus populaires' },
    { value: 'rating', label: 'Mieux notés' },
  ];

  const conditions = [
    { value: '', label: 'Tous les états' },
    { value: 'new_with_tags', label: 'Neuf avec étiquettes' },
    { value: 'new_without_tags', label: 'Neuf sans étiquettes' },
    { value: 'very_good', label: 'Très bon état' },
    { value: 'good', label: 'Bon état' },
    { value: 'satisfactory', label: 'État satisfaisant' },
  ];

  const sizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '38', '40', '42', '44', '46'
  ];

  const colors = [
    { name: 'Noir', value: '#000000' },
    { name: 'Blanc', value: '#FFFFFF' },
    { name: 'Gris', value: '#9CA3AF' },
    { name: 'Rouge', value: '#EF4444' },
    { name: 'Bleu', value: '#3B82F6' },
    { name: 'Vert', value: '#10B981' },
    { name: 'Jaune', value: '#F59E0B' },
    { name: 'Rose', value: '#EC4899' },
    { name: 'Violet', value: '#8B5CF6' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Marron', value: '#92400E' },
    { name: 'Beige', value: '#D4D4AA' },
  ];

  const brands = [
    'Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Mango', 
    'Pull&Bear', 'Bershka', 'Massimo Dutti', 'COS', 'Other'
  ];

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        limit: 24
      };

      const response = await productService.getProducts(params);
      setProducts(response.products || []);
      setTotalPages(response.totalPages || 1);
      setTotalProducts(response.total || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filter changes
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange('search', filters.search);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      subcategory: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      size: '',
      color: '',
      condition: '',
      sort: 'newest',
      page: 1
    });
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo(0, 0);
  };

  const handleLikeProduct = async (productId) => {
    try {
      await productService.toggleLike(productId);
      // Update local state if needed
    } catch (error) {
      console.error('Error liking product:', error);
    }
  };

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => value && key !== 'sort' && key !== 'page' && key !== 'search'
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder="Rechercher des articles, marques..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </form>

            {/* View Controls */}
            <div className="hidden md:flex items-center space-x-4 ml-6">
              {/* View Mode */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 rounded',
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 rounded',
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Sort */}
              <Select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                options={sortOptions}
                className="w-48"
              />

              {/* Filters Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiltersOpen(!filtersOpen)}
                leftIcon={<SlidersHorizontal className="h-4 w-4" />}
              >
                Filtres
                {activeFiltersCount > 0 && (
                  <Badge variant="primary" size="sm" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden ml-4"
              leftIcon={<Filter className="h-4 w-4" />}
            >
              Filtres
              {activeFiltersCount > 0 && (
                <Badge variant="primary" size="sm" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className={cn(
            'hidden md:block w-64 flex-shrink-0 transition-all duration-300',
            !filtersOpen && 'md:hidden'
          )}>
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900">Filtres</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Réinitialiser
                </button>
              </div>

              <div className="space-y-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <Select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    options={categories}
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full"
                    />
                    <span className="text-gray-500">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marque
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.brand === brand}
                          onChange={(e) => handleFilterChange('brand', e.target.checked ? brand : '')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    État
                  </label>
                  <Select
                    value={filters.condition}
                    onChange={(e) => handleFilterChange('condition', e.target.value)}
                    options={conditions}
                  />
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taille
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleFilterChange('size', filters.size === size ? '' : size)}
                        className={cn(
                          'py-1 px-2 text-sm rounded border',
                          filters.size === size
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Couleur
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleFilterChange('color', filters.color === color.value ? '' : color.value)}
                        className={cn(
                          'h-8 w-8 rounded-full border-2',
                          filters.color === color.value
                            ? 'border-primary-600 ring-2 ring-primary-200'
                            : 'border-gray-300'
                        )}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {totalProducts} articles trouvés
                {filters.search && ` pour "${filters.search}"`}
              </p>

              {/* Mobile Sort */}
              <div className="md:hidden">
                <Select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  options={sortOptions}
                  className="w-40"
                />
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value || key === 'sort' || key === 'page' || key === 'search') return null;
                  
                  let label = value;
                  if (key === 'category') {
                    label = categories.find(c => c.value === value)?.label || value;
                  } else if (key === 'condition') {
                    label = conditions.find(c => c.value === value)?.label || value;
                  } else if (key === 'color') {
                    label = colors.find(c => c.value === value)?.name || 'Couleur';
                  }

                  return (
                    <Badge
                      key={key}
                      variant="secondary"
                      removable
                      onRemove={() => handleFilterChange(key, '')}
                    >
                      {label}
                    </Badge>
                  );
                })}
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Tout effacer
                </button>
              </div>
            )}

            {/* Products */}
            {loading ? (
              <div className={cn(
                'grid gap-4',
                viewMode === 'grid' 
                  ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                  : 'grid-cols-1'
              )}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonProductCard key={i} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={cn(
                'grid gap-4',
                viewMode === 'grid' 
                  ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                  : 'grid-cols-1'
              )}>
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onLike={handleLikeProduct}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Package}
                title="Aucun article trouvé"
                description="Essayez de modifier vos filtres ou votre recherche"
                action={{
                  label: 'Réinitialiser les filtres',
                  onClick: clearFilters
                }}
              />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filters.page === 1}
                  onClick={() => handlePageChange(filters.page - 1)}
                  leftIcon={<ChevronLeft className="h-4 w-4" />}
                >
                  Précédent
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (filters.page <= 3) {
                      pageNum = i + 1;
                    } else if (filters.page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = filters.page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={cn(
                          'h-8 w-8 rounded',
                          filters.page === pageNum
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={filters.page === totalPages}
                  onClick={() => handlePageChange(filters.page + 1)}
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                >
                  Suivant
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Filtres</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              {/* Same filters as desktop but in mobile layout */}
              <div className="space-y-6">
                {/* Copy filter sections from desktop */}
                {/* ... */}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 mt-6 -mx-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Voir {totalProducts} articles
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
