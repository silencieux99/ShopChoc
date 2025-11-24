import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Trash2, Plus, Minus, ArrowRight, 
  Package, Tag, Truck, Shield, ChevronLeft
} from 'lucide-react';
import Button from '../shared/ui/Button';
import Input from '../shared/ui/Input';
import Card from '../shared/ui/Card';
import EmptyState from '../shared/ui/EmptyState';
import { cn } from '../shared/utils/cn';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // Mock cart data (à remplacer par un vrai store)
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      productId: 'p1',
      title: 'T-shirt Nike Sportswear',
      brand: 'Nike',
      size: 'M',
      color: 'Noir',
      price: 29.99,
      oldPrice: 39.99,
      quantity: 1,
      stock: 5,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
    },
    {
      id: '2',
      productId: 'p2',
      title: 'Jean Slim Fit',
      brand: 'Levi\'s',
      size: '32',
      color: 'Bleu',
      price: 79.99,
      quantity: 2,
      stock: 3,
      image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400'
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const deliveryFee = 4.99;
  const freeDeliveryThreshold = 50;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * promoDiscount) / 100;
  const deliveryCharge = subtotal >= freeDeliveryThreshold ? 0 : deliveryFee;
  const total = subtotal - discountAmount + deliveryCharge;
  const savings = cartItems.reduce((acc, item) => {
    if (item.oldPrice) {
      return acc + ((item.oldPrice - item.price) * item.quantity);
    }
    return acc;
  }, 0) + discountAmount;

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const quantity = Math.min(newQuantity, item.stock);
        if (quantity < newQuantity) {
          toast.error(`Stock limité à ${item.stock} articles`);
        }
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const removeItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    toast.success('Article retiré du panier');
  };

  const applyPromoCode = () => {
    setIsApplyingPromo(true);
    
    // Simulate promo code validation
    setTimeout(() => {
      if (promoCode.toUpperCase() === 'SHOP10') {
        setPromoDiscount(10);
        toast.success('Code promo appliqué : -10%');
      } else if (promoCode.toUpperCase() === 'SHOP20') {
        setPromoDiscount(20);
        toast.success('Code promo appliqué : -20%');
      } else {
        toast.error('Code promo invalide');
      }
      setIsApplyingPromo(false);
    }, 1000);
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Connectez-vous pour continuer');
      navigate('/auth/login', { state: { from: '/cart' } });
      return;
    }
    navigate('/checkout');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <EmptyState
          icon={ShoppingCart}
          title="Votre panier est vide"
          description="Découvrez nos produits et ajoutez vos articles préférés"
          action={{
            label: 'Continuer mes achats',
            onClick: () => navigate('/catalog'),
            icon: <ArrowRight className="h-5 w-5" />
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon panier</h1>
            <p className="text-gray-600 mt-1">
              {cartItems.length} article{cartItems.length > 1 ? 's' : ''}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('/catalog')}
            leftIcon={<ChevronLeft className="h-4 w-4" />}
          >
            Continuer mes achats
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} padding={false}>
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Image */}
                    <Link
                      to={`/product/${item.productId}`}
                      className="flex-shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            to={`/product/${item.productId}`}
                            className="font-semibold text-gray-900 hover:text-primary-600"
                          >
                            {item.title}
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.brand} • Taille: {item.size} • Couleur: {item.color}
                          </p>
                          {item.stock <= 3 && (
                            <p className="text-sm text-orange-600 mt-2">
                              Plus que {item.stock} en stock
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                            min="1"
                            max={item.stock}
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          {item.oldPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              {formatPrice(item.oldPrice * item.quantity)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Promo Code */}
            <Card>
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Code promo"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={applyPromoCode}
                  loading={isApplyingPromo}
                  disabled={!promoCode || promoDiscount > 0}
                >
                  {promoDiscount > 0 ? 'Appliqué' : 'Appliquer'}
                </Button>
              </div>
              {promoDiscount > 0 && (
                <p className="text-sm text-green-600 mt-2">
                  Code promo appliqué : -{promoDiscount}%
                </p>
              )}
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Résumé de la commande
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Réduction ({promoDiscount}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <span className="text-green-600">Gratuite</span>
                    ) : (
                      formatPrice(deliveryCharge)
                    )}
                  </span>
                </div>

                {deliveryCharge > 0 && (
                  <div className="p-3 bg-primary-50 rounded-lg text-sm">
                    <p className="text-primary-700">
                      Plus que {formatPrice(freeDeliveryThreshold - subtotal)} pour la livraison gratuite !
                    </p>
                    <div className="mt-2 h-2 bg-primary-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-600 rounded-full transition-all"
                        style={{ width: `${Math.min((subtotal / freeDeliveryThreshold) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {savings > 0 && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      Vous économisez {formatPrice(savings)} sur cette commande !
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">TVA incluse</p>
              </div>

              <Button
                size="lg"
                className="w-full mb-3"
                onClick={handleCheckout}
              >
                Passer la commande
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => navigate('/catalog')}
              >
                Continuer mes achats
              </Button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="h-4 w-4 mr-2 text-primary-600" />
                  Livraison rapide en 48h
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 mr-2 text-primary-600" />
                  Paiement 100% sécurisé
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="h-4 w-4 mr-2 text-primary-600" />
                  Retour gratuit sous 30 jours
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
