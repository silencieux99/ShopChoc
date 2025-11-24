import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { userService } from '../services/userService';
import { productService } from '../services/productService';
import { paymentService } from '../services/paymentService';
import { 
  User, 
  Mail, 
  MapPin, 
  Edit2, 
  Save, 
  X, 
  Camera,
  Package,
  ShoppingBag,
  Heart,
  Star,
  TrendingUp,
  Calendar,
  Eye,
  Loader2,
  Settings,
  Bell,
  Shield,
  CreditCard,
  Users,
  MessageSquare,
  Award,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  DollarSign,
  Phone,
  Globe,
  Lock,
  LogOut,
  Download,
  Upload,
  AlertCircle
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, userProfile, updateUserProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myProducts, setMyProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [transactions, setTransactions] = useState({ purchases: [], sales: [] });
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalPurchases: 0,
    totalSpent: 0,
    totalEarned: 0,
    totalViews: 0,
    totalLikes: 0,
    avgRating: 0,
    responseTime: '< 1h'
  });
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'sale', message: 'Votre article "Nike Air Max" a été vendu', time: '2h', read: false },
    { id: 2, type: 'message', message: 'Nouveau message de @user123', time: '5h', read: false },
    { id: 3, type: 'like', message: '3 personnes ont liké vos articles', time: '1j', read: true }
  ]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    avatar: ''
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        bio: userProfile.bio || '',
        location: userProfile.location || '',
        avatar: userProfile.avatar || ''
      });
    }
  }, [userProfile]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Charger mes produits
      const products = await productService.getUserProducts(user.uid);
      setMyProducts(products);

      // Charger mes favoris
      const favs = await userService.getFavorites();
      setFavorites(favs);

      // Charger les transactions
      const trans = await paymentService.getTransactions();
      setTransactions(trans);

      // Charger les achats
      const purchasedProducts = await Promise.all(
        trans.purchases.map(async (t) => {
          try {
            const product = await productService.getProductById(t.productId);
            return { ...product, transaction: t };
          } catch (error) {
            return null;
          }
        })
      );
      setPurchases(purchasedProducts.filter(p => p !== null));

      // Calculer les stats
      const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);
      const totalLikes = products.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
      const totalSpent = trans.purchases.reduce((sum, t) => sum + (t.amount || 0), 0);
      const totalEarned = trans.sales.reduce((sum, t) => sum + (t.amount || 0), 0);

      setStats({
        totalProducts: products.length,
        totalSales: trans.sales.length,
        totalPurchases: trans.purchases.length,
        totalSpent,
        totalEarned,
        totalViews,
        totalLikes,
        avgRating: userProfile?.rating || 0,
        responseTime: '< 1h'
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateUserProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: userProfile?.displayName || '',
      bio: userProfile?.bio || '',
      location: userProfile?.location || '',
      avatar: userProfile?.avatar || ''
    });
    setIsEditing(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: User },
    { id: 'products', label: 'Mes articles', icon: Package, count: myProducts.length },
    { id: 'purchases', label: 'Mes achats', icon: ShoppingBag, count: purchases.length },
    { id: 'sales', label: 'Mes ventes', icon: TrendingUp, count: transactions.sales.length },
    { id: 'favorites', label: 'Favoris', icon: Heart, count: favorites.length },
    { id: 'wallet', label: 'Portefeuille', icon: CreditCard },
    { id: 'reviews', label: 'Avis', icon: Star },
    { id: 'followers', label: 'Abonnés', icon: Users },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header avec photo de profil */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt={formData.displayName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    userProfile.username?.[0]?.toUpperCase() || 'U'
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Infos utilisateur */}
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="text-2xl font-bold text-gray-900 border-b-2 border-primary-500 focus:outline-none mb-2"
                    placeholder="Nom d'affichage"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">
                    {userProfile.displayName || userProfile.username}
                  </h1>
                )}
                <p className="text-gray-600 flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  {userProfile.email}
                </p>
                {(formData.location || isEditing) && (
                  <div className="flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="text-gray-600 border-b border-gray-300 focus:outline-none focus:border-primary-500"
                        placeholder="Ville, Pays"
                      />
                    ) : (
                      <span className="text-gray-600">{formData.location}</span>
                    )}
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Membre depuis {formatDate(userProfile.createdAt)}
                </p>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Enregistrer
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Modifier le profil
                </button>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6">
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Parlez-nous de vous..."
              />
            ) : formData.bio ? (
              <p className="text-gray-700">{formData.bio}</p>
            ) : (
              <p className="text-gray-400 italic">Aucune biographie</p>
            )}
          </div>
        </div>

        {/* Notifications badge */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-gray-700">
              Vous avez {notifications.filter(n => !n.read).length} nouvelles notifications
            </span>
          </div>
          <button className="text-primary-600 text-sm font-semibold hover:underline">
            Voir tout
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Articles</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalProducts}
                </p>
              </div>
              <Package className="w-10 h-10 text-primary-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Achats</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalPurchases}
                </p>
              </div>
              <ShoppingBag className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ventes</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalSales}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gains</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatPrice(stats.totalEarned)}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Note</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1 flex items-center">
                  {stats.avgRating.toFixed(1)}
                  <Star className="w-5 h-5 ml-1 fill-yellow-400 text-yellow-400" />
                </p>
              </div>
              <Award className="w-10 h-10 text-yellow-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          {/* Tab headers */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex space-x-1 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === tab.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {/* Vue d'ensemble */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Activité récente
                  </h3>
                  <div className="space-y-3">
                    {myProducts.slice(0, 3).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={product.images?.[0] || '/placeholder.png'}
                            alt={product.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {product.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {product.views || 0} vues
                          </p>
                          <p className="text-sm text-gray-600">
                            {product.likes?.length || 0} likes
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Évaluation
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-6 h-6 ${
                            star <= (userProfile.rating || 0)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {userProfile.rating || 0}/5 ({userProfile.reviewsCount || 0} avis)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Mes articles */}
            {activeTab === 'products' && (
              <div>
                {myProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">
                      Vous n'avez pas encore d'articles
                    </p>
                    <button
                      onClick={() => window.location.href = '/sell'}
                      className="mt-4 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Vendre un article
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {myProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Favoris */}
            {activeTab === 'favorites' && (
              <div>
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">
                      Aucun favori pour le moment
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {favorites.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Mes achats */}
            {activeTab === 'purchases' && (
              <div>
                {purchases.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">
                      Aucun achat pour le moment
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchases.map((item) => (
                      <div
                        key={item.transaction.id}
                        className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start space-x-4">
                          <img
                            src={item.images?.[0] || '/placeholder.png'}
                            alt={item.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-900 text-lg">
                                  {item.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  Acheté le {formatDate(item.transaction.createdAt)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Transaction #{item.transaction.id.slice(0, 8)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">
                                  {formatPrice(item.transaction.amount)}
                                </p>
                                <span className={`inline-block px-3 py-1 text-xs rounded-full mt-2 ${
                                  item.transaction.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : item.transaction.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {item.transaction.status === 'completed' ? 'Livré' : 
                                   item.transaction.status === 'pending' ? 'En cours' : 'Annulé'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 mt-4">
                              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
                                <MessageSquare className="w-4 h-4 inline mr-2" />
                                Contacter le vendeur
                              </button>
                              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                <Star className="w-4 h-4 inline mr-2" />
                                Laisser un avis
                              </button>
                              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                                <Download className="w-4 h-4 inline mr-2" />
                                Facture
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Ventes */}
            {activeTab === 'sales' && (
              <div>
                {transactions.sales.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-600">
                      Aucune vente pour le moment
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.sales.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            Transaction #{transaction.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(transaction.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            {formatPrice(transaction.amount)}
                          </p>
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Portefeuille */}
            {activeTab === 'wallet' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 text-white">
                  <h3 className="text-lg font-semibold mb-2">Solde disponible</h3>
                  <p className="text-4xl font-bold">{formatPrice(stats.totalEarned)}</p>
                  <div className="flex space-x-4 mt-6">
                    <button className="px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                      <Download className="w-4 h-4 inline mr-2" />
                      Retirer
                    </button>
                    <button className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                      Historique
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Revenus totaux</h4>
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">{formatPrice(stats.totalEarned)}</p>
                    <p className="text-sm text-gray-600 mt-2">{stats.totalSales} ventes</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Dépenses totales</h4>
                      <ShoppingBag className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{formatPrice(stats.totalSpent)}</p>
                    <p className="text-sm text-gray-600 mt-2">{stats.totalPurchases} achats</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Moyens de paiement</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Carte •••• 4242</p>
                          <p className="text-sm text-gray-600">Expire 12/25</p>
                        </div>
                      </div>
                      <button className="text-primary-600 text-sm font-semibold">Modifier</button>
                    </div>
                    <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-600 hover:text-primary-600 transition-colors">
                      + Ajouter un moyen de paiement
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Avis */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {stats.avgRating.toFixed(1)} / 5.0
                      </h3>
                      <div className="flex items-center mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-6 h-6 ${
                              star <= stats.avgRating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Basé sur {userProfile?.reviewsCount || 0} avis
                      </p>
                    </div>
                    <Award className="w-16 h-16 text-yellow-400 opacity-50" />
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { user: 'Marie D.', rating: 5, comment: 'Vendeur très sérieux, article conforme !', date: '2 jours' },
                    { user: 'Thomas L.', rating: 5, comment: 'Envoi rapide, bien emballé. Merci !', date: '1 semaine' },
                    { user: 'Sophie M.', rating: 4, comment: 'Bon article, quelques traces d\'usage mais correct.', date: '2 semaines' }
                  ].map((review, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                            {review.user[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{review.user}</p>
                            <div className="flex items-center mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">Il y a {review.date}</span>
                      </div>
                      <p className="text-gray-700 mt-3">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Abonnés */}
            {activeTab === 'followers' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-gray-900">{followers.length || 156}</p>
                    <p className="text-sm text-gray-600 mt-1">Abonnés</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-gray-900">{following.length || 89}</p>
                    <p className="text-sm text-gray-600 mt-1">Abonnements</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Vos abonnés</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Julie Martin', username: '@julie_m', followers: 234 },
                      { name: 'Alex Dubois', username: '@alex_d', followers: 567 },
                      { name: 'Emma Laurent', username: '@emma_l', followers: 123 }
                    ].map((follower, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                            {follower.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{follower.name}</p>
                            <p className="text-sm text-gray-600">{follower.username} • {follower.followers} abonnés</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
                          Suivre
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Paramètres */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Informations personnelles
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={userProfile?.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                      <input
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notifications
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Nouveaux messages', enabled: true },
                      { label: 'Ventes et achats', enabled: true },
                      { label: 'Nouveaux abonnés', enabled: false },
                      { label: 'Promotions', enabled: false }
                    ].map((notif, index) => (
                      <div key={index} className="flex items-center justify-between py-3">
                        <span className="text-gray-700">{notif.label}</span>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notif.enabled ? 'bg-primary-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notif.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Sécurité et confidentialité
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-gray-700">Changer le mot de passe</span>
                      <Lock className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-gray-700">Authentification à deux facteurs</span>
                      <Shield className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-gray-700">Télécharger mes données</span>
                      <Download className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-red-200 rounded-xl p-6">
                  <h3 className="font-semibold text-red-600 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Zone de danger
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-red-600">
                      <span>Désactiver mon compte</span>
                      <XCircle className="w-5 h-5" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-red-600">
                      <span>Supprimer mon compte</span>
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <button className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center">
                  <LogOut className="w-5 h-5 mr-2" />
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
