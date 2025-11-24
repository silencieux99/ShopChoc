import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  User, Package, Heart, MapPin, Settings, LogOut, 
  ChevronRight, ShoppingBag, CreditCard, Bell, Shield,
  Star, Truck, Clock, Award
} from 'lucide-react';
import Card from '../../shared/ui/Card';
import Button from '../../shared/ui/Button';
import Badge from '../../shared/ui/Badge';
import { cn } from '../../shared/utils/cn';

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    {
      id: 'profile',
      icon: User,
      title: 'Mon profil',
      description: 'Gérer mes informations personnelles',
      link: '/account/profile',
      badge: null
    },
    {
      id: 'orders',
      icon: Package,
      title: 'Mes commandes',
      description: 'Suivre mes achats et retours',
      link: '/account/orders',
      badge: '3'
    },
    {
      id: 'favorites',
      icon: Heart,
      title: 'Mes favoris',
      description: 'Articles sauvegardés',
      link: '/account/favorites',
      badge: '12'
    },
    {
      id: 'addresses',
      icon: MapPin,
      title: 'Mes adresses',
      description: 'Gérer mes adresses de livraison',
      link: '/account/addresses',
      badge: null
    },
    {
      id: 'settings',
      icon: Settings,
      title: 'Paramètres',
      description: 'Préférences et sécurité',
      link: '/account/settings',
      badge: null
    }
  ];

  const stats = [
    {
      icon: ShoppingBag,
      label: 'Commandes',
      value: '24',
      color: 'text-blue-600'
    },
    {
      icon: Heart,
      label: 'Favoris',
      value: '12',
      color: 'text-red-600'
    },
    {
      icon: Star,
      label: 'Avis donnés',
      value: '18',
      color: 'text-yellow-600'
    },
    {
      icon: Award,
      label: 'Points fidélité',
      value: '450',
      color: 'text-purple-600'
    }
  ];

  const recentOrders = [
    {
      id: '1',
      number: '#2024001',
      date: '15 Jan 2024',
      status: 'delivered',
      statusLabel: 'Livré',
      total: 89.99,
      items: 3
    },
    {
      id: '2',
      number: '#2024002',
      date: '10 Jan 2024',
      status: 'shipped',
      statusLabel: 'En cours',
      total: 45.50,
      items: 1
    },
    {
      id: '3',
      number: '#2024003',
      date: '5 Jan 2024',
      status: 'processing',
      statusLabel: 'Préparation',
      total: 120.00,
      items: 2
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon compte</h1>
          <p className="text-gray-600">
            Bienvenue, {userProfile?.username || user?.email}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <stat.icon className={cn('h-8 w-8 mx-auto mb-2', stat.color)} />
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Menu */}
          <div className="lg:col-span-2">
            <Card padding={false}>
              <div className="divide-y divide-gray-200">
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.link}
                    className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <item.icon className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <Badge variant="primary">{item.badge}</Badge>
                      )}
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </Link>
                ))}

                {/* Logout */}
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-between w-full p-6 hover:bg-red-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <LogOut className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-600">
                        Déconnexion
                      </h3>
                      <p className="text-sm text-gray-600">
                        Se déconnecter de mon compte
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Orders */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">
                  Commandes récentes
                </h2>
                <Link
                  to="/account/orders"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Voir tout
                </Link>
              </div>

              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/account/orders/${order.id}`)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {order.number}
                      </span>
                      <Badge variant={getStatusColor(order.status)} size="sm">
                        {order.statusLabel}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{order.date}</span>
                      <span className="font-medium">
                        {order.total.toFixed(2)}€
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.items} article{order.items > 1 ? 's' : ''}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h2 className="font-semibold text-gray-900 mb-4">
                Actions rapides
              </h2>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  leftIcon={<Truck className="h-4 w-4" />}
                  onClick={() => navigate('/account/orders?filter=shipping')}
                >
                  Suivre mes livraisons
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  leftIcon={<CreditCard className="h-4 w-4" />}
                  onClick={() => navigate('/account/settings#payment')}
                >
                  Gérer mes moyens de paiement
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  leftIcon={<Bell className="h-4 w-4" />}
                  onClick={() => navigate('/account/settings#notifications')}
                >
                  Préférences de notification
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  leftIcon={<Shield className="h-4 w-4" />}
                  onClick={() => navigate('/account/settings#security')}
                >
                  Sécurité du compte
                </Button>
              </div>
            </Card>

            {/* Support */}
            <Card className="bg-primary-50 border-primary-200">
              <div className="text-center">
                <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Besoin d'aide ?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Notre équipe est là pour vous aider
                </p>
                <Button size="sm" className="w-full">
                  Contacter le support
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
