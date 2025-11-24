import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, Truck, Clock, CheckCircle, XCircle, 
  ChevronRight, Calendar, Filter, Download, Eye
} from 'lucide-react';
import Button from '../../shared/ui/Button';
import Badge from '../../shared/ui/Badge';
import Card from '../../shared/ui/Card';
import EmptyState from '../../shared/ui/EmptyState';
import Modal from '../../shared/ui/Modal';
import { cn } from '../../shared/utils/cn';
import { paymentService } from '../../services/paymentService';
import { useAuthStore } from '../../store/useAuthStore';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Mock orders data
  useEffect(() => {
    setOrders([
      {
        id: '2024001',
        date: '2024-01-20',
        status: 'delivered',
        total: 89.99,
        items: [
          {
            id: '1',
            title: 'T-shirt Nike Sportswear',
            quantity: 1,
            price: 29.99,
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100'
          },
          {
            id: '2',
            title: 'Jean Slim Fit',
            quantity: 1,
            price: 60.00,
            image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=100'
          }
        ],
        shipping: {
          address: '12 rue de la Paix, 75002 Paris',
          method: 'Standard',
          trackingNumber: 'FR1234567890',
          deliveredDate: '2024-01-23'
        }
      },
      {
        id: '2024002',
        date: '2024-01-15',
        status: 'shipped',
        total: 45.50,
        items: [
          {
            id: '3',
            title: 'Sweat à capuche',
            quantity: 1,
            price: 45.50,
            image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100'
          }
        ],
        shipping: {
          address: '12 rue de la Paix, 75002 Paris',
          method: 'Express',
          trackingNumber: 'FR0987654321',
          estimatedDelivery: '2024-01-25'
        }
      },
      {
        id: '2024003',
        date: '2024-01-10',
        status: 'processing',
        total: 120.00,
        items: [
          {
            id: '4',
            title: 'Sneakers blanches',
            quantity: 1,
            price: 120.00,
            image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100'
          }
        ],
        shipping: {
          address: '12 rue de la Paix, 75002 Paris',
          method: 'Standard',
          estimatedDelivery: '2024-01-28'
        }
      }
    ]);
    setLoading(false);
  }, []);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'delivered':
        return {
          label: 'Livré',
          variant: 'success',
          icon: CheckCircle,
          color: 'text-green-600'
        };
      case 'shipped':
        return {
          label: 'En transit',
          variant: 'info',
          icon: Truck,
          color: 'text-blue-600'
        };
      case 'processing':
        return {
          label: 'En préparation',
          variant: 'warning',
          icon: Clock,
          color: 'text-yellow-600'
        };
      case 'cancelled':
        return {
          label: 'Annulée',
          variant: 'danger',
          icon: XCircle,
          color: 'text-red-600'
        };
      default:
        return {
          label: 'Inconnue',
          variant: 'default',
          icon: Package,
          color: 'text-gray-600'
        };
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const handleDownloadInvoice = (orderId) => {
    toast.success(`Téléchargement de la facture #${orderId}`);
  };

  const handleTrackShipment = (trackingNumber) => {
    window.open(`https://track.example.com/${trackingNumber}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes commandes</h1>
          <p className="text-gray-600 mt-1">
            Suivez vos achats et gérez vos retours
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                filterStatus === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              )}
            >
              Toutes ({orders.length})
            </button>
            <button
              onClick={() => setFilterStatus('processing')}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                filterStatus === 'processing'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              )}
            >
              En préparation ({orders.filter(o => o.status === 'processing').length})
            </button>
            <button
              onClick={() => setFilterStatus('shipped')}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                filterStatus === 'shipped'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              )}
            >
              En transit ({orders.filter(o => o.status === 'shipped').length})
            </button>
            <button
              onClick={() => setFilterStatus('delivered')}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                filterStatus === 'delivered'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              )}
            >
              Livrées ({orders.filter(o => o.status === 'delivered').length})
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Aucune commande"
            description={
              filterStatus === 'all'
                ? "Vous n'avez pas encore passé de commande"
                : `Aucune commande avec le statut "${getStatusInfo(filterStatus).label}"`
            }
            action={{
              label: 'Commencer mes achats',
              onClick: () => navigate('/catalog')
            }}
          />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <Card key={order.id} padding={false}>
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={cn('p-3 rounded-full bg-opacity-10', 
                          order.status === 'delivered' ? 'bg-green-600' :
                          order.status === 'shipped' ? 'bg-blue-600' :
                          order.status === 'processing' ? 'bg-yellow-600' :
                          'bg-gray-600'
                        )}>
                          <StatusIcon className={cn('h-6 w-6', statusInfo.color)} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Commande #{order.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {formatDate(order.date)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={statusInfo.variant} size="lg">
                        {statusInfo.label}
                      </Badge>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-16 w-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {item.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantité: {item.quantity} • {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-sm text-gray-600">
                          +{order.items.length - 2} autre{order.items.length - 2 > 1 ? 's' : ''} article{order.items.length - 2 > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>

                    {/* Shipping Info */}
                    {order.status !== 'cancelled' && (
                      <div className="p-3 bg-gray-50 rounded-lg mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Truck className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-600">
                              {order.shipping.method} • {order.shipping.address}
                            </span>
                          </div>
                          {order.shipping.trackingNumber && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleTrackShipment(order.shipping.trackingNumber)}
                            >
                              Suivre
                            </Button>
                          )}
                        </div>
                        {order.status === 'delivered' && order.shipping.deliveredDate && (
                          <p className="text-sm text-green-600 mt-2">
                            <CheckCircle className="h-3 w-3 inline mr-1" />
                            Livré le {formatDate(order.shipping.deliveredDate)}
                          </p>
                        )}
                        {order.status === 'shipped' && order.shipping.estimatedDelivery && (
                          <p className="text-sm text-blue-600 mt-2">
                            <Clock className="h-3 w-3 inline mr-1" />
                            Livraison prévue le {formatDate(order.shipping.estimatedDelivery)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Order Footer */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(order)}
                          leftIcon={<Eye className="h-4 w-4" />}
                        >
                          Détails
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadInvoice(order.id)}
                          leftIcon={<Download className="h-4 w-4" />}
                        >
                          Facture
                        </Button>
                        {order.status === 'delivered' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/returns/new?order=${order.id}`)}
                          >
                            Retourner
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Order Details Modal */}
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={`Commande #${selectedOrder?.id}`}
          size="lg"
        >
          {selectedOrder && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Statut</span>
                <Badge variant={getStatusInfo(selectedOrder.status).variant}>
                  {getStatusInfo(selectedOrder.status).label}
                </Badge>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Articles</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-12 w-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium">{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
