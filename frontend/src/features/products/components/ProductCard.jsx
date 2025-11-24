import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { cn } from '../../../shared/utils/cn';
import Badge from '../../../shared/ui/Badge';
import { auth } from '../../../config/firebase';

export default function ProductCard({ 
  product, 
  onLike, 
  onQuickView,
  className 
}) {
  const [isLiked, setIsLiked] = useState(
    product.likes?.includes(auth.currentUser?.uid)
  );
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!auth.currentUser) {
      // Redirect to login or show modal
      return;
    }

    setIsLiked(!isLiked);
    if (onLike) {
      await onLike(product.id);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <Link
      to={`/product/${product.id}`}
      className={cn(
        'group block bg-white rounded-lg overflow-hidden',
        'border border-gray-200 hover:border-gray-300',
        'transition-all duration-200 hover:shadow-lg',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        {/* Product Image */}
        {!imageError && product.images?.[0] ? (
          <>
            <img
              src={product.images[0]}
              alt={product.title}
              className={cn(
                'w-full h-full object-cover',
                'group-hover:scale-105 transition-transform duration-500',
                imageLoading && 'opacity-0'
              )}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageError(true)}
            />
            {/* Secondary Image on Hover (if available) */}
            {product.images[1] && (
              <img
                src={product.images[1]}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-gray-300" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge variant="primary" size="sm">
              Nouveau
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="danger" size="sm">
              -{discountPercentage}%
            </Badge>
          )}
          {product.stock <= 3 && product.stock > 0 && (
            <Badge variant="warning" size="sm">
              Derniers articles
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={cn(
              'p-2 rounded-full bg-white/90 backdrop-blur-sm',
              'hover:bg-white transition-colors',
              'shadow-md hover:shadow-lg'
            )}
            aria-label="Ajouter aux favoris"
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-colors',
                isLiked 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-600 hover:text-red-500'
              )}
            />
          </button>

          {/* Quick View Button */}
          {onQuickView && (
            <button
              onClick={handleQuickView}
              className={cn(
                'p-2 rounded-full bg-white/90 backdrop-blur-sm',
                'hover:bg-white transition-colors',
                'shadow-md hover:shadow-lg',
                'opacity-0 group-hover:opacity-100 transition-opacity'
              )}
              aria-label="Vue rapide"
            >
              <Eye className="h-4 w-4 text-gray-600 hover:text-gray-900" />
            </button>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-4 py-2 bg-white text-gray-900 font-semibold rounded-lg">
              Rupture de stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            {product.brand}
          </p>
        )}

        {/* Title */}
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">
                {product.rating}
              </span>
            </div>
          )}
        </div>

        {/* Sizes (if available) */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-2 flex gap-1 flex-wrap">
            {product.sizes.slice(0, 3).map((size) => (
              <span
                key={size}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 3 && (
              <span className="text-xs px-2 py-1 text-gray-500">
                +{product.sizes.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Colors (if available) */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-2 flex gap-1">
            {product.colors.slice(0, 5).map((color) => (
              <span
                key={color}
                className="h-4 w-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-xs text-gray-500 ml-1">
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
