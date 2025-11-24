import { useState } from 'react';
import { 
  Search, Filter, Download, Eye, Edit, 
  User, Users, Mail, Phone, MapPin,
  ShoppingBag, TrendingUp, UserPlus, Award
} from 'lucide-react';
import Card from '../../shared/ui/Card';
import Button from '../../shared/ui/Button';
import Badge from '../../shared/ui/Badge';
import Modal from '../../shared/ui/Modal';
import Input from '../../shared/ui/Input';
import { cn } from '../../shared/utils/cn';

export default function AdminCustomers() {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Customers data - Empty initially
  const customers = [];

  // Stats - Empty initially
  const stats = [
    {
      label: 'Total clients',
      value: '0',
      change: '+0%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Nouveaux (30j)',
      value: '0',
      change: '+0%',
      icon: UserPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Clients VIP',
      value: '0',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Taux rétention',
      value: '0%',
      change: '+0%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const getTierBadge = (tier) => {
    const config = {
      vip: { variant: 'primary', label: 'VIP' },
      gold: { variant: 'warning', label: 'Gold' },
      silver: { variant: 'default', label: 'Silver' },
      bronze: { variant: 'default', label: 'Bronze' }
    }[tier];
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const getStatusBadge = (status) => {
    const config = {
      active: { variant: 'success', label: 'Actif' },
      inactive: { variant: 'warning', label: 'Inactif' },
      blocked: { variant: 'error', label: 'Bloqué' }
    }[status];
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm md:text-base text-gray-600">Gérez votre base de clients</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />} className="hidden sm:flex">
            Exporter
          </Button>
          <Button variant="outline" size="sm" className="sm:hidden">
            <Download className="h-4 w-4" />
          </Button>
          <Button leftIcon={<UserPlus className="h-4 w-4" />}>
            <span className="hidden sm:inline">Nouveau client</span>
            <span className="sm:hidden">Nouveau</span>
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
        <div className="flex flex-col md:flex-row md:items-center gap-4">
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

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>

          <Button leftIcon={<Filter className="h-4 w-4" />}>
            Filtrer
          </Button>
        </div>
      </Card>

      {/* Customers Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commandes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dépenses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={customer.avatar}
                        alt={customer.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">
                          Depuis {new Date(customer.joinedDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{customer.email}</p>
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                  </td>
                  <td className="px-6 py-4">{getTierBadge(customer.tier)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.totalOrders}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">€{customer.totalSpent.toFixed(2)}</td>
                  <td className="px-6 py-4">{getStatusBadge(customer.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        onClick={() => handleViewDetails(customer)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Customer Details Modal */}
      {showDetailsModal && selectedCustomer && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedCustomer(null);
          }}
          title="Détails du client"
          size="lg"
        >
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
              <img 
                src={selectedCustomer.avatar}
                alt={selectedCustomer.name}
                className="h-16 w-16 rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{selectedCustomer.name}</h3>
                <p className="text-gray-600">{selectedCustomer.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  {getTierBadge(selectedCustomer.tier)}
                  {getStatusBadge(selectedCustomer.status)}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center">
                <ShoppingBag className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{selectedCustomer.totalOrders}</p>
                <p className="text-sm text-gray-600">Commandes</p>
              </Card>
              <Card className="text-center">
                <TrendingUp className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">€{selectedCustomer.totalSpent.toFixed(0)}</p>
                <p className="text-sm text-gray-600">Total dépensé</p>
              </Card>
              <Card className="text-center">
                <MapPin className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{selectedCustomer.city}</p>
                <p className="text-sm text-gray-600">Ville</p>
              </Card>
            </div>

            {/* Contact Info */}
            <Card>
              <h4 className="font-semibold text-gray-900 mb-3">Informations de contact</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>Client depuis le {new Date(selectedCustomer.joinedDate).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedCustomer(null);
                }}
              >
                Fermer
              </Button>
              <Button>
                Envoyer un message
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
