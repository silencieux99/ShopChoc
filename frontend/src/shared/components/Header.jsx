import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  ChevronDown,
  ShoppingBag,
  Settings,
  LogOut,
  Plus,
  Bell,
  MapPin,
  HelpCircle,
  Package
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../utils/cn';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function Header() {
  const { user, userProfile, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Mock cart items count (à remplacer par le vrai store)
  const cartItemsCount = 0;
  const notificationsCount = 2;

  const categories = [
    { id: 'femme', name: 'Femme', slug: 'femme' },
    { id: 'homme', name: 'Homme', slug: 'homme' },
    { id: 'enfant', name: 'Enfant', slug: 'enfant' },
    { id: 'maison', name: 'Maison', slug: 'maison' },
    { id: 'beaute', name: 'Beauté', slug: 'beaute' },
    { id: 'sport', name: 'Sport', slug: 'sport' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28 relative">
          {/* Left Section - Menu + Search */}
          <div className="flex items-center flex-1">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 mr-2 relative z-10"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Search Bar */}
            <form 
              onSubmit={handleSearch} 
              className="hidden md:flex flex-1 max-w-md"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des articles, marques..."
                  className={cn(
                    'w-full px-4 py-2 pl-10 pr-4',
                    'text-gray-900 placeholder-gray-400',
                    'border border-gray-300 rounded-lg',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                  )}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <button
                  type="submit"
                  className={cn(
                    'absolute right-2 top-1.5',
                    'px-4 py-1 bg-primary-600 text-white rounded',
                    'hover:bg-primary-700 transition-colors'
                  )}
                >
                  Rechercher
                </button>
              </div>
            </form>
          </div>

          {/* Logo au centre */}
          <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 z-20">
            <img 
              src="/logo.png" 
              alt="ShopChoc" 
              className="h-20 md:h-24 lg:h-24 object-contain"
            />
          </Link>

          {/* Cart Only - Right Section */}
          <div className="flex items-center justify-end flex-1">
            <Link 
              to="/cart"
              className="relative p-3 text-gray-600 hover:text-gray-900"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Categories Nav */}
        <nav className="hidden md:block border-t border-gray-200 -mx-4 px-4">
          <ul className="flex items-center space-x-8 h-12">
            <li>
              <button
                onMouseEnter={() => setCategoriesMenuOpen(true)}
                onMouseLeave={() => setCategoriesMenuOpen(false)}
                className="flex items-center font-medium text-gray-700 hover:text-primary-600"
              >
                Toutes les catégories
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/categories/${category.slug}`}
                  className="text-gray-700 hover:text-primary-600"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/promotions"
                className="text-red-600 font-medium hover:text-red-700"
              >
                Promotions
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                className="text-purple-600 font-medium hover:text-purple-700"
              >
                🔧 Admin
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Menu - Fullscreen Overlay */}
      <div className={cn(
        "fixed inset-0 z-50 md:hidden transition-all duration-300",
        mobileMenuOpen ? "visible" : "invisible"
      )}>
        {/* Backdrop */}
        <div 
          className={cn(
            "absolute inset-0 bg-black transition-opacity duration-300",
            mobileMenuOpen ? "opacity-50" : "opacity-0"
          )}
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white transition-transform duration-300 transform",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold tracking-wider">MENU</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Scrollable Content */}
          <div className="overflow-y-auto h-[calc(100vh-4rem)]">
            {/* Mobile Search */}
            <div className="p-4">
              <form onSubmit={(e) => {
                handleSearch(e);
                setMobileMenuOpen(false);
              }}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full px-4 py-3 pl-10 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </form>
            </div>

            {/* Categories Section */}
            <div className="px-4 pb-4">
              <h3 className="text-xs font-semibold text-gray-500 tracking-wider mb-3">CATÉGORIES</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/categories/${category.slug}`}
                    className="block px-3 py-3 text-gray-900 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
                <Link
                  to="/admin"
                  className="block px-3 py-3 text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🔧 Admin
                </Link>
              </div>
            </div>
            
            {/* Account Section */}
            {user && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 tracking-wider mb-3 mt-4">MON COMPTE</h3>
                <div className="space-y-1">
                  <Link
                    to="/account"
                    className="flex items-center px-3 py-3 text-gray-900 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Mon profil
                  </Link>
                  <Link
                    to="/account/orders"
                    className="flex items-center px-3 py-3 text-gray-900 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className="h-5 w-5 mr-3" />
                    Mes commandes
                  </Link>
                  <Link
                    to="/account/favorites"
                    className="flex items-center px-3 py-3 text-gray-900 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart className="h-5 w-5 mr-3" />
                    Mes favoris
                  </Link>
                  <Link
                    to="/account/settings"
                    className="flex items-center px-3 py-3 text-gray-900 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    Paramètres
                  </Link>
                </div>
                
                {/* Logout */}
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-3 mt-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Déconnexion
                </button>
              </div>
            )}
            
            {/* Login/Register for non-authenticated */}
            {!user && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="mt-4 space-y-2">
                  <Link
                    to="/auth/login"
                    className="block w-full px-4 py-3 text-center text-white bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Se connecter
                  </Link>
                  <Link
                    to="/auth/register"
                    className="block w-full px-4 py-3 text-center text-primary-600 border-2 border-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Créer un compte
                  </Link>
                </div>
              </div>
            )}
            
            {/* Footer Info */}
            <div className="px-4 py-6 mt-auto border-t border-gray-100">
              <div className="space-y-2 text-sm text-gray-500">
                <Link to="/help" className="block hover:text-primary-600">Centre d'aide</Link>
                <Link to="/contact" className="block hover:text-primary-600">Contact</Link>
                <Link to="/about" className="block hover:text-primary-600">À propos</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
