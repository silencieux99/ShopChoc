import { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Users, ShoppingCart, ShoppingBag,
  Package, Euro, Eye, Heart, ArrowUpRight,
  Calendar, Download, Filter, MoreVertical
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import Card from '../../shared/ui/Card';
import Button from '../../shared/ui/Button';
import Badge from '../../shared/ui/Badge';
import { cn } from '../../shared/utils/cn';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('7days');
  const [loading, setLoading] = useState(false);

  // Stats Cards Data
  const stats = [
    {
      label: 'Revenus du mois',
      value: '€0',
      change: '+0%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Commandes',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Clients actifs',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Produits',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  // Chart Data - Revenue
  const revenueData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [{
      label: 'Revenus',
      data: [0, 0, 0, 0, 0, 0, 0],
      borderColor: 'rgb(236, 72, 153)',
      backgroundColor: 'rgba(236, 72, 153, 0.1)',
      tension: 0.4
    }]
  };

  const categoryData = {
    labels: ['Femme', 'Homme', 'Accessoires', 'Chaussures', 'Sacs'],
    datasets: [{
      data: [0, 0, 0, 0, 0],
      backgroundColor: [
        'rgba(236, 72, 153, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 146, 60, 0.8)'
      ]
    }]
  };

  const ordersData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [{
      label: 'Commandes',
      data: [0, 0, 0, 0, 0, 0],
      backgroundColor: 'rgba(168, 85, 247, 0.8)'
    }]
  };

  // Recent orders - Empty initially
  const recentOrders = [];

  // Top products - Empty initially
  const topProducts = [];

  // Activity feed - Empty initially
  const activities = [];

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'error'
    };
    const labels = {
      pending: 'En attente',
      processing: 'Traitement',
      shipped: 'Expédié',
      delivered: 'Livré',
      cancelled: 'Annulé'
    };
    return <Badge variant={variants[status]} size="sm">{labels[status]}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600">Vue d'ensemble de votre boutique</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="today">Aujourd'hui</option>
            <option value="7days">7 jours</option>
            <option value="30days">30 jours</option>
            <option value="year">Année</option>
          </select>
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />} className="hidden sm:flex">
            Exporter
          </Button>
          <Button leftIcon={<Filter className="h-4 w-4" />} className="hidden sm:flex">
            Filtrer
          </Button>
          <Button variant="outline" size="sm" className="sm:hidden">
            <Download className="h-4 w-4" />
          </Button>
          <Button size="sm" className="sm:hidden">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center space-x-1">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={cn(
                    "text-sm font-medium",
                    stat.trend === 'up' ? "text-green-600" : "text-red-600"
                  )}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500">vs mois dernier</span>
                </div>
              </div>
              <div className={cn("p-3 rounded-lg", stat.bgColor)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base md:text-lg font-semibold">Évolution des revenus</h2>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="h-48 md:h-64">
            <Line 
              data={revenueData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      font: {
                        size: window.innerWidth < 768 ? 10 : 12
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => '€' + value,
                      font: {
                        size: window.innerWidth < 768 ? 10 : 12
                      }
                    }
                  },
                  x: {
                    ticks: {
                      font: {
                        size: window.innerWidth < 768 ? 10 : 12
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </Card>

        {/* Categories Pie Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base md:text-lg font-semibold">Ventes par catégorie</h2>
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="h-48 md:h-64 flex items-center justify-center">
            <Doughnut 
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      font: {
                        size: window.innerWidth < 768 ? 10 : 12
                      },
                      padding: window.innerWidth < 768 ? 8 : 10
                    }
                  }
                }
              }}
            />
          </div>
        </Card>
      </div>

      {/* Orders Chart */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base md:text-lg font-semibold">Commandes mensuelles</h2>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="h-48 md:h-64">
          <Bar 
            data={ordersData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  ticks: {
                    font: {
                      size: window.innerWidth < 768 ? 10 : 12
                    }
                  }
                },
                x: {
                  ticks: {
                    font: {
                      size: window.innerWidth < 768 ? 10 : 12
                    }
                  }
                }
              }
            }}
          />
        </div>
      </Card>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Orders */}
        <Card padding={false}>
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-semibold">Commandes récentes</h2>
              <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="h-4 w-4" />} className="hidden sm:flex">
                Voir tout
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Client</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600 hidden sm:table-cell">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900">{order.amount}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4">{getStatusBadge(order.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Products */}
        <Card padding={false}>
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-semibold">Produits populaires</h2>
              <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="h-4 w-4" />} className="hidden sm:flex">
                Voir tout
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Ventes</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenus</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topProducts.map((product, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600 hidden sm:table-cell">
                      <div className="flex items-center space-x-2">
                        <span>{product.sales}</span>
                        <span className={cn(
                          "text-xs",
                          product.trend.startsWith('+') ? "text-green-600" : "text-red-600"
                        )}>
                          {product.trend}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900">{product.revenue}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 hidden lg:table-cell">
                      <span className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        product.stock > 20 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      )}>
                        {product.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <h2 className="text-base md:text-lg font-semibold mb-4">Activité récente</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                Nouvelle commande <span className="font-medium">#ORD005</span> reçue
              </p>
              <p className="text-xs text-gray-500">Il y a 5 minutes</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                Nouveau client inscrit: <span className="font-medium">Alice Moreau</span>
              </p>
              <p className="text-xs text-gray-500">Il y a 15 minutes</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                Stock faible pour <span className="font-medium">Sneakers Urban Style</span>
              </p>
              <p className="text-xs text-gray-500">Il y a 1 heure</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                Produit <span className="font-medium">Robe d'été</span> mis à jour
              </p>
              <p className="text-xs text-gray-500">Il y a 2 heures</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
