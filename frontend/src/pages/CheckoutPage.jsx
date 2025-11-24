import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, MapPin, Truck, Shield, ChevronRight, 
  Check, Package, Clock, Info
} from 'lucide-react';
import Button from '../shared/ui/Button';
import Input from '../shared/ui/Input';
import Select from '../shared/ui/Select';
import Card, { CardHeader, CardTitle, CardContent } from '../shared/ui/Card';
import Badge from '../shared/ui/Badge';
import { cn } from '../shared/utils/cn';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuthStore();
  
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    addressComplement: '',
    city: '',
    postalCode: '',
    country: 'FR',
    phone: ''
  });

  const [billingAddress, setBillingAddress] = useState({
    sameAsShipping: true,
    ...shippingAddress
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Mock cart data
  const cartItems = [
    {
      id: '1',
      title: 'T-shirt Nike Sportswear',
      price: 29.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100'
    },
    {
      id: '2',
      title: 'Jean Slim Fit',
      price: 79.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=100'
    }
  ];

  const shippingMethods = [
    {
      id: 'standard',
      name: 'Livraison Standard',
      description: '3-5 jours ouvrés',
      price: 4.99,
      icon: Truck
    },
    {
      id: 'express',
      name: 'Livraison Express',
      description: '1-2 jours ouvrés',
      price: 9.99,
      icon: Clock
    }
  ];

  const paymentMethods = [
    { id: 'card', name: 'Carte bancaire', icon: CreditCard },
    { id: 'paypal', name: 'PayPal', icon: CreditCard },
    { id: 'klarna', name: 'Klarna - Payer en 3 fois', icon: CreditCard }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = shippingMethods.find(m => m.id === shippingMethod)?.price || 0;
  const total = subtotal + shippingCost;

  const steps = [
    { id: 1, name: 'Adresse', icon: MapPin },
    { id: 2, name: 'Livraison', icon: Truck },
    { id: 3, name: 'Paiement', icon: CreditCard },
    { id: 4, name: 'Confirmation', icon: Check }
  ];

  const handleSubmitOrder = async () => {
    setLoading(true);
    
    // Simulate order submission
    setTimeout(() => {
      setLoading(false);
      toast.success('Commande confirmée !');
      navigate('/account/orders');
    }, 2000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return shippingAddress.firstName && shippingAddress.lastName && 
               shippingAddress.address && shippingAddress.city && 
               shippingAddress.postalCode;
      case 2:
        return shippingMethod;
      case 3:
        return paymentMethod;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Finaliser la commande</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between">
              {steps.map((step, index) => (
                <li key={step.id} className="flex-1">
                  <div className={cn(
                    'flex items-center',
                    index !== steps.length - 1 && 'pr-8 sm:pr-20'
                  )}>
                    <div className="relative flex items-center justify-center">
                      <div className={cn(
                        'h-12 w-12 rounded-full border-2 flex items-center justify-center',
                        step.id < activeStep 
                          ? 'bg-primary-600 border-primary-600'
                          : step.id === activeStep
                          ? 'border-primary-600 bg-white'
                          : 'border-gray-300 bg-white'
                      )}>
                        {step.id < activeStep ? (
                          <Check className="h-5 w-5 text-white" />
                        ) : (
                          <step.icon className={cn(
                            'h-5 w-5',
                            step.id === activeStep ? 'text-primary-600' : 'text-gray-400'
                          )} />
                        )}
                      </div>
                      {index !== steps.length - 1 && (
                        <div className={cn(
                          'absolute left-12 w-full h-0.5',
                          step.id < activeStep ? 'bg-primary-600' : 'bg-gray-300'
                        )} />
                      )}
                    </div>
                    <span className={cn(
                      'ml-3 text-sm font-medium hidden sm:block',
                      step.id <= activeStep ? 'text-gray-900' : 'text-gray-500'
                    )}>
                      {step.name}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Address */}
            {activeStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Adresse de livraison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Prénom"
                      value={shippingAddress.firstName}
                      onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})}
                      required
                    />
                    <Input
                      label="Nom"
                      value={shippingAddress.lastName}
                      onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})}
                      required
                    />
                    <div className="sm:col-span-2">
                      <Input
                        label="Adresse"
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        label="Complément d'adresse"
                        value={shippingAddress.addressComplement}
                        onChange={(e) => setShippingAddress({...shippingAddress, addressComplement: e.target.value})}
                        placeholder="Appartement, étage, etc. (optionnel)"
                      />
                    </div>
                    <Input
                      label="Ville"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      required
                    />
                    <Input
                      label="Code postal"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                      required
                    />
                    <Select
                      label="Pays"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                      options={[
                        { value: 'FR', label: 'France' },
                        { value: 'BE', label: 'Belgique' },
                        { value: 'CH', label: 'Suisse' }
                      ]}
                    />
                    <Input
                      label="Téléphone"
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>

                  <div className="mt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={billingAddress.sameAsShipping}
                        onChange={(e) => setBillingAddress({...billingAddress, sameAsShipping: e.target.checked})}
                        className="h-4 w-4 text-primary-600 rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Utiliser la même adresse pour la facturation
                      </span>
                    </label>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={() => setActiveStep(2)}
                      disabled={!isStepValid(1)}
                      rightIcon={<ChevronRight className="h-4 w-4" />}
                    >
                      Continuer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Shipping Method */}
            {activeStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Mode de livraison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {shippingMethods.map((method) => (
                      <label
                        key={method.id}
                        className={cn(
                          'flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-colors',
                          shippingMethod === method.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            value={method.id}
                            checked={shippingMethod === method.id}
                            onChange={(e) => setShippingMethod(e.target.value)}
                            className="h-4 w-4 text-primary-600"
                          />
                          <method.icon className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">{method.name}</p>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatPrice(method.price)}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setActiveStep(1)}
                    >
                      Retour
                    </Button>
                    <Button
                      onClick={() => setActiveStep(3)}
                      disabled={!isStepValid(2)}
                      rightIcon={<ChevronRight className="h-4 w-4" />}
                    >
                      Continuer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Payment */}
            {activeStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Paiement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={cn(
                          'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors',
                          paymentMethod === method.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <input
                          type="radio"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="h-4 w-4 text-primary-600"
                        />
                        <method.icon className="h-5 w-5 text-gray-600 ml-3 mr-3" />
                        <span className="font-medium text-gray-900">{method.name}</span>
                      </label>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <Input
                        label="Numéro de carte"
                        placeholder="1234 5678 9012 3456"
                        leftIcon={<CreditCard className="h-5 w-5 text-gray-400" />}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Date d'expiration"
                          placeholder="MM/AA"
                        />
                        <Input
                          label="Code de sécurité"
                          placeholder="123"
                        />
                      </div>
                      <Input
                        label="Nom du titulaire"
                        placeholder="John Doe"
                      />
                    </div>
                  )}

                  <div className="mt-6 flex items-center p-3 bg-blue-50 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600 mr-2" />
                    <p className="text-sm text-blue-900">
                      Vos informations de paiement sont sécurisées et cryptées
                    </p>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setActiveStep(2)}
                    >
                      Retour
                    </Button>
                    <Button
                      onClick={handleSubmitOrder}
                      loading={loading}
                      disabled={!isStepValid(3)}
                    >
                      {loading ? 'Traitement...' : 'Confirmer la commande'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantité: {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sous-total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Livraison</span>
                    <span>{formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-gray-600">TVA incluse</p>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="h-4 w-4 mr-2 text-primary-600" />
                    Retour gratuit sous 30 jours
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="h-4 w-4 mr-2 text-primary-600" />
                    Protection acheteur
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
