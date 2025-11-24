import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { useAuthStore } from '../store/useAuthStore';
import { paymentService } from '../services/paymentService';
import { Heart, MapPin, Eye, Loader2, ShoppingCart, User } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentProduct, loading, fetchProductById, toggleLike } = useProductStore();
  const [isLiked, setIsLiked] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchProductById(id);
  }, [id]);

  useEffect(() => {
    if (currentProduct) {
      setIsLiked(currentProduct.likes?.includes(user?.uid) || false);
    }
  }, [currentProduct, user]);

  const handleLike = async () => {
    if (!user) {
      toast.error('Connectez-vous pour aimer ce produit');
      navigate('/login');
      return;
    }
    setIsLiked(!isLiked);
    await toggleLike(id);
  };

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Connectez-vous pour acheter');
      navigate('/login');
      return;
    }

    if (currentProduct.userId === user.uid) {
      toast.error('Vous ne pouvez pas acheter votre propre produit');
      return;
    }

    try {
      setPurchasing(true);
      const { url } = await paymentService.createCheckoutSession(id);
      window.location.href = url;
    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
      toast.error('Erreur lors du paiement');
      setPurchasing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Produit non trouvé</h2>
          <Link to="/" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const serviceFee = currentProduct.price * 0.05;
  const totalPrice = currentProduct.price + serviceFee;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-soft">
            {currentProduct.images && currentProduct.images.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="aspect-square"
              >
                {currentProduct.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`${currentProduct.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">Pas d'image</span>
              </div>
            )}
          </div>

          {/* Informations */}
          <div className="space-y-6">
            {/* Prix et actions */}
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentProduct.title}
                  </h1>
                  <p className="text-4xl font-bold text-primary-600">
                    {formatPrice(currentProduct.price)}
                  </p>
                </div>
                <button
                  onClick={handleLike}
                  className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>

              {currentProduct.status === 'available' ? (
                <button
                  onClick={handlePurchase}
                  disabled={purchasing || currentProduct.userId === user?.uid}
                  className="w-full py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {purchasing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Redirection...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Acheter maintenant
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full py-4 bg-gray-200 text-gray-600 rounded-xl font-semibold text-center">
                  Article vendu
                </div>
              )}

              {/* Détails du prix */}
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Prix de l'article</span>
                  <span>{formatPrice(currentProduct.price)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frais de service (5%)</span>
                  <span>{formatPrice(serviceFee)}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {currentProduct.description}
              </p>
            </div>

            {/* Détails du produit */}
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Détails du produit
              </h2>
              <div className="space-y-3">
                {currentProduct.category && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Catégorie</span>
                    <span className="font-medium text-gray-900">
                      {currentProduct.category}
                    </span>
                  </div>
                )}
                {currentProduct.condition && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">État</span>
                    <span className="font-medium text-gray-900">
                      {currentProduct.condition}
                    </span>
                  </div>
                )}
                {currentProduct.brand && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Marque</span>
                    <span className="font-medium text-gray-900">
                      {currentProduct.brand}
                    </span>
                  </div>
                )}
                {currentProduct.size && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taille</span>
                    <span className="font-medium text-gray-900">
                      {currentProduct.size}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Vues</span>
                  <span className="font-medium text-gray-900 flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {currentProduct.views || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Vendeur */}
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Vendeur</h2>
              <Link
                to={`/user/${currentProduct.userId}`}
                className="flex items-center space-x-3 hover:bg-gray-50 p-3 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Voir le profil</p>
                  <p className="text-sm text-gray-600">
                    Publié le{' '}
                    {new Date(currentProduct.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
