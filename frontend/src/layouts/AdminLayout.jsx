import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  BarChart3, Settings, LogOut, Menu, X, 
  Bell, Search, ChevronDown, Store, 
  FileText, Palette, Shield, CreditCard,
  TrendingUp, AlertCircle, Calendar
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { cn } from '../shared/utils/cn';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Utilisateur par défaut si non connecté (pour démo)
  const displayUser = user || { displayName: 'Admin', email: 'admin@shopchoc.com' };
  
  // Auto-close sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Check if user is admin
  useEffect(() => {
    // TODO: Vérifier si l'utilisateur est admin
    // if (!user || user.role !== 'admin') {
    //   navigate('/');
    // }
  }, [user, navigate]);

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      badge: null
    },
    {
      label: 'Produits',
      icon: Package,
      path: '/admin/products',
      badge: null
    },
    {
      label: 'Commandes',
      icon: ShoppingCart,
      path: '/admin/orders',
      badge: null
    },
    {
      label: 'Clients',
      icon: Users,
      path: '/admin/customers',
      badge: null
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      path: '/admin/analytics',
      badge: null
    },
    {
      label: 'Finances',
      icon: CreditCard,
      path: '/admin/finances',
      badge: null
    },
    {
      label: 'Marketing',
      icon: TrendingUp,
      path: '/admin/marketing',
      badge: null
    },
    {
      label: 'Contenu',
      icon: FileText,
      path: '/admin/content',
      badge: null
    },
    {
      label: 'Design',
      icon: Palette,
      path: '/admin/design',
      badge: null
    },
    {
      label: 'Paramètres',
      icon: Settings,
      path: '/admin/settings',
      badge: null
    }
  ];

  const notifications = [];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300",
        sidebarOpen ? "w-64" : "w-20",
        "hidden md:block"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen ? (
            <>
              <Link to="/admin" className="flex items-center space-x-2">
                <Store className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                  Admin Panel
                </span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg mx-auto"
            >
              <Menu className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg transition-all",
                isActive(item.path) 
                  ? "bg-primary-50 text-primary-600" 
                  : "text-gray-700 hover:bg-gray-100",
                !sidebarOpen && "justify-center"
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={cn("h-5 w-5", !sidebarOpen && "h-6 w-6")} />
                {sidebarOpen && <span>{item.label}</span>}
              </div>
              {sidebarOpen && item.badge && (
                <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">admin@shopchoc.com</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 md:hidden transition-all duration-300",
        mobileMenuOpen ? "visible" : "invisible"
      )}>
        <div 
          className={cn(
            "absolute inset-0 bg-black transition-opacity",
            mobileMenuOpen ? "opacity-50" : "opacity-0"
          )}
          onClick={() => setMobileMenuOpen(false)}
        />
        <aside className={cn(
          "absolute left-0 top-0 bottom-0 w-72 bg-white transition-transform",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* Mobile menu content - same as desktop */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            <Link to="/admin" className="flex items-center space-x-2">
              <Store className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-primary-600">Admin</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg transition-all",
                  isActive(item.path) 
                    ? "bg-primary-50 text-primary-600" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </aside>
      </div>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        sidebarOpen ? "md:ml-64" : "md:ml-20"
      )}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg hidden md:block"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* Search */}
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-64 px-4 py-2 pl-10 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600">En ligne</span>
                </div>
                <div className="text-gray-600">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  {new Date().toLocaleDateString('fr-FR')}
                </div>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                          <div className="flex items-start space-x-3">
                            <div className={cn(
                              "h-2 w-2 rounded-full mt-2",
                              notif.type === 'order' && "bg-green-500",
                              notif.type === 'warning' && "bg-yellow-500",
                              notif.type === 'user' && "bg-blue-500"
                            )} />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                              <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700">
                        Voir toutes les notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
                <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
