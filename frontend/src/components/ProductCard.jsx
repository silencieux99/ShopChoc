import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useProductStore } from '../store/useProductStore';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const { user } = useAuthStore();
  const { toggleLike } = useProductStore();
  const [isLiked, setIsLiked] = useState(
    product.likes?.includes(user?.uid) || false
  );

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) {
      return;
    }
    setIsLiked(!isLiked);
    await toggleLike(product.id);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span>Pas d'image</span>
          </div>
        )}

        {/* Bouton like */}
        {user && (
          <button
            onClick={handleLike}
            className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1.5 sm:p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>
        )}

        {/* Badge statut */}
        {product.status === 'sold' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="px-4 py-2 bg-white text-gray-900 font-semibold rounded-lg">
              VENDU
            </span>
          </div>
        )}
      </div>

      {/* Informations */}
      <div className="p-2 sm:p-4">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 mb-1 sm:mb-2">
          {product.title}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-base sm:text-lg font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>

          {product.condition && (
            <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
              {product.condition}
            </span>
          )}
        </div>

        {product.brand && (
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 truncate">{product.brand}</p>
        )}
      </div>
    </Link>
  );
}
