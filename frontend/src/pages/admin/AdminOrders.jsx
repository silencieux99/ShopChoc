import { useState } from 'react';
import { 
  Search, Filter, Download, Eye, 
  Truck, Package, CheckCircle, Clock,
  XCircle, AlertCircle, CreditCard, MapPin,
  Calendar, User, ShoppingBag, MoreVertical,
  MessageSquare, FileText, Printer, Mail
} from 'lucide-react';
import Card from '../../shared/ui/Card';
import Button from '../../shared/ui/Button';
import Badge from '../../shared/ui/Badge';
import Modal from '../../shared/ui/Modal';
import { cn } from '../../shared/utils/cn';

export default function AdminOrders() {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('7days');

  // Orders data - Empty initially
  const orders = [];

  const orderStatuses = {
    all: 'Toutes',
    pending: 'En attente',
    processing: 'En traitement',
    shipped: 'Expédié',
    delivered: 'Livré',
    cancelled: 'Annulé'
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      processing: <Package className="h-4 w-4" />,
      shipped: <Truck className="h-4 w-4" />,
      delivered: <CheckCircle className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />
    };
    return icons[status];
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'error'
    };
    return (
      <Badge variant={variants[status]} size="sm">
        <span className="flex items-center space-x-1">
          {getStatusIcon(status)}
          <span>{orderStatuses[status]}</span>
        </span>
      </Badge>
    );
  };

  const getPaymentBadge = (status) => {
    if (status === 'paid') {
      return <Badge variant="success" size="sm">Payé</Badge>;
    } else if (status === 'refunded') {
      return <Badge variant="default" size="sm">Remboursé</Badge>;
    }
    return <Badge variant="warning" size="sm">En attente</Badge>;
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    console.log(`Update order ${orderId} to status ${newStatus}`);
  };

  // Stats
  const stats = [
    {
      label: 'Total commandes',
      value: orders.length.toString(),
      change: null,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'En traitement',
      value: '0',
      icon: Package,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      label: 'Expédiées',
      value: '0',
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Livrées',
      value: '0',
      change: null,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Commandes</h1>
          <p className="text-sm md:text-base text-gray-600">Gérez et suivez toutes les commandes</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />} className="hidden sm:flex">
            Exporter
          </Button>
          <Button variant="outline" leftIcon={<Printer className="h-4 w-4" />} className="hidden sm:flex">
            Imprimer
          </Button>
          <Button variant="outline" size="sm" className="sm:hidden">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="sm:hidden">
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.change && (
                    <span className="text-sm text-green-600">{stat.change}</span>
                  )}
                </div>
              </div>
              <div className={cn("p-3 rounded-lg", stat.bgColor)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full px-3 md:px-4 py-2 pl-10 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            </div>

            {/* Status Filter */}
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {Object.entries(orderStatuses).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            {/* Date Range */}
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="today">Aujourd'hui</option>
              <option value="7days">7 derniers jours</option>
              <option value="30days">30 derniers jours</option>
              <option value="all">Toutes</option>
            </select>
          </div>

          <Button leftIcon={<Filter className="h-4 w-4" />}>
            Plus de filtres
          </Button>
        </div>
      </Card>

      {/* Orders Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedOrders.length === orders.length}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Articles</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paiement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{order.id}</p>
                    {order.trackingNumber && (
                      <p className="text-xs text-gray-500 mt-1">
                        Track: {order.trackingNumber}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={order.customer.avatar}
                        alt={order.customer.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                        <p className="text-xs text-gray-500">{order.customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    <br />
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} article(s)
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.items[0].name}
                      {order.items.length > 1 && ` +${order.items.length - 1}`}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">€{order.grandTotal.toFixed(2)}</p>
                    {order.shipping > 0 && (
                      <p className="text-xs text-gray-500">Livraison: €{order.shipping}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getPaymentBadge(order.paymentStatus)}
                    <p className="text-xs text-gray-500 mt-1">{order.paymentMethod}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        onClick={() => handleViewDetails(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedOrder(null);
          }}
          title={`Commande ${selectedOrder.id}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <img 
                  src={selectedOrder.customer.avatar}
                  alt={selectedOrder.customer.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customer.email}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customer.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Client depuis</p>
                <p className="font-medium">Janvier 2023</p>
                <p className="text-sm text-primary-600 mt-1">15 commandes</p>
              </div>
            </div>

            {/* Order Status */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Statut de la commande</p>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Statut du paiement</p>
                {getPaymentBadge(selectedOrder.paymentStatus)}
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Historique</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Commande créée</p>
                    <p className="text-xs text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString('fr-FR')}</p>
                  </div>
                </div>
                {selectedOrder.status !== 'pending' && selectedOrder.status !== 'cancelled' && (
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">En préparation</p>
                      <p className="text-xs text-gray-500">20 Jan 2024, 11:00</p>
                    </div>
                  </div>
                )}
                {(selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered') && (
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Truck className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Expédié</p>
                      <p className="text-xs text-gray-500">20 Jan 2024, 14:00</p>
                    </div>
                  </div>
                )}
                {selectedOrder.status === 'delivered' && (
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Livré</p>
                      <p className="text-xs text-gray-500">21 Jan 2024, 10:00</p>
                    </div>
                  </div>
                )}
                {selectedOrder.status === 'cancelled' && (
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Annulé</p>
                      <p className="text-xs text-gray-500">19 Jan 2024, 16:00</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Articles commandés</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-gray-200 rounded"></div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium text-gray-900">€{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Adresse de livraison</h3>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.zipCode} {selectedOrder.shippingAddress.city}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">€{selectedOrder.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium">€{selectedOrder.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>€{selectedOrder.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedOrder.notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">{selectedOrder.notes}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" leftIcon={<Printer className="h-4 w-4" />}>
                  Imprimer
                </Button>
                <Button variant="outline" size="sm" leftIcon={<Mail className="h-4 w-4" />}>
                  Envoyer email
                </Button>
                <Button variant="outline" size="sm" leftIcon={<FileText className="h-4 w-4" />}>
                  Facture
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedOrder(null);
                  }}
                >
                  Fermer
                </Button>
                <Button>Mettre à jour</Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
