import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight, ChevronLeft, ArrowRight,
  Truck, Shield, CreditCard, Heart
} from 'lucide-react';
import ProductCard from '../features/products/components/ProductCard';
import Button from '../shared/ui/Button';
import Badge from '../shared/ui/Badge';
import { SkeletonProductCard } from '../shared/ui/Skeleton';
import { cn } from '../shared/utils/cn';
import { productService } from '../services/productService';

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero Slides
  const heroSlides = [];

  // Categories Grid - Empty initially
  const categories = [];

  // Trending Brands - Empty initially
  const trendingBrands = [];

  useEffect(() => {
    fetchHomeData();

    // Auto-slide for hero (only if slides exist)
    const interval = heroSlides.length > 0 ? setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000) : null;

    return () => clearInterval(interval);
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      // Fetch different product categories
      const [featured, newest, popular] = await Promise.all([
        productService.getProducts({ limit: 8, featured: true }),
        productService.getProducts({ limit: 12, sort: 'newest' }),
        productService.getProducts({ limit: 8, sort: 'popular' })
      ]);

      setFeaturedProducts(featured.products || []);
      setNewProducts(newest.products || []);
      setPopularProducts(popular.products || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeProduct = async (productId) => {
    try {
      await productService.toggleLike(productId);
    } catch (error) {
      console.error('Error liking product:', error);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel - Style Magazine Luxe */}
      <section className="relative h-[70vh] md:h-[85vh] bg-black overflow-hidden">
        <div className="relative h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={cn(
                'absolute inset-0 transition-opacity duration-1000',
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              )}
            >
              <div className="relative h-full">
                <img 
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60">
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                    <div className="max-w-7xl mx-auto">
                      <p className="text-primary-300 text-sm md:text-base tracking-[0.3em] mb-4 font-light">
                        {slide.subtitle}
                      </p>
                      <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
                        {slide.title}
                      </h1>
                      <Link to={slide.link}>
                        <Button 
                          size="lg" 
                          variant="outline"
                          className="border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-3 text-sm tracking-widest"
                        >
                          {slide.cta}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Minimal Carousel Controls */}
        <div className="absolute left-8 md:left-16 bottom-8 md:bottom-16 flex items-center space-x-6 z-20">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <div className="flex items-center space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  'h-[2px] transition-all duration-500',
                  index === currentSlide ? 'w-12 bg-white' : 'w-6 bg-white/30'
                )}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      </section>

      {/* Features Bar - Minimalist */}
      <section className="bg-black text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center space-x-8 md:space-x-12 text-xs tracking-wider">
            <div className="flex items-center space-x-2 opacity-90">
              <Truck className="h-4 w-4" />
              <span>LIVRAISON EXPRESS</span>
            </div>
            <div className="hidden md:flex items-center space-x-2 opacity-90">
              <Shield className="h-4 w-4" />
              <span>PAIEMENT SÉCURISÉ</span>
            </div>
            <div className="hidden md:flex items-center space-x-2 opacity-90">
              <CreditCard className="h-4 w-4" />
              <span>3X SANS FRAIS</span>
            </div>
            <div className="flex items-center space-x-2 opacity-90">
              <Heart className="h-4 w-4" />
              <span>RETOUR 30J</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid - Editorial Style */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
              COLLECTIONS
            </h2>
            <p className="text-gray-600 text-lg">
              Explorez notre univers mode
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className={cn(
                  "group relative overflow-hidden bg-black",
                  index === 0 && "lg:col-span-2 lg:row-span-2",
                  "aspect-square"
                )}
              >
                <img 
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-white text-2xl md:text-3xl font-light tracking-wider mb-2">
                      {category.name.toUpperCase()}
                    </h3>
                    <p className="text-white/60 tracking-wide">{category.count}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section - Minimalist */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-center text-gray-900 mb-2">
              NOUVEAUTÉS
            </h2>
            <p className="text-center text-gray-600">
              Les dernières pièces de la saison
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {loading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <SkeletonProductCard key={i} />
              ))
            ) : (
              newProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onLike={handleLikeProduct}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Brands Section - Minimal Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-light text-center text-gray-900 mb-12">
            MARQUES PARTENAIRES
          </h2>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
            {trendingBrands.map((brand) => (
              <Link
                key={brand.id}
                to={`/brands/${brand.slug}`}
                className="group text-center opacity-60 hover:opacity-100 transition-opacity duration-300"
              >
                <div className="h-20 w-20 bg-gray-100 rounded-full mx-auto mb-3 group-hover:bg-primary-50 transition-colors" />
                <h3 className="text-xs tracking-wider text-gray-700">{brand.name.toUpperCase()}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products - Curated Selection */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">
              SÉLECTION DE LA SEMAINE
            </h2>
            <p className="text-gray-600">
              Les pièces les plus convoitées
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <SkeletonProductCard key={i} />
              ))
            ) : (
              popularProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onLike={handleLikeProduct}
                />
              ))
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
