import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  CreditCard,
  Shield,
  Truck,
  RotateCcw,
  Heart
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: {
      title: 'Acheter',
      links: [
        { label: 'Femme', href: '/categories/femme' },
        { label: 'Homme', href: '/categories/homme' },
        { label: 'Enfant', href: '/categories/enfant' },
        { label: 'Maison', href: '/categories/maison' },
        { label: 'Beauté', href: '/categories/beaute' },
        { label: 'Sport', href: '/categories/sport' },
        { label: 'Promotions', href: '/promotions' },
        { label: 'Nouveautés', href: '/new' },
      ]
    },
    help: {
      title: 'Aide',
      links: [
        { label: 'Centre d\'aide', href: '/help' },
        { label: 'Contact', href: '/contact' },
        { label: 'Retours', href: '/returns' },
        { label: 'Guide des tailles', href: '/size-guide' },
        { label: 'FAQ', href: '/faq' },
      ]
    },
    about: {
      title: 'À propos',
      links: [
        { label: 'Qui sommes-nous', href: '/about' },
        { label: 'Carrières', href: '/careers' },
        { label: 'Presse', href: '/press' },
        { label: 'Blog', href: '/blog' },
        { label: 'Développement durable', href: '/sustainability' },
      ]
    },
    legal: {
      title: 'Légal',
      links: [
        { label: 'CGU', href: '/legal/terms' },
        { label: 'CGV', href: '/legal/sales-terms' },
        { label: 'Confidentialité', href: '/legal/privacy' },
        { label: 'Cookies', href: '/legal/cookies' },
      ]
    }
  };

  const features = [
    {
      icon: Truck,
      title: 'Livraison rapide',
      description: 'Expédition sous 24h'
    },
    {
      icon: Shield,
      title: 'Paiement sécurisé',
      description: '100% sécurisé'
    },
    {
      icon: RotateCcw,
      title: 'Retours gratuits',
      description: 'Sous 30 jours'
    },
    {
      icon: Heart,
      title: 'Satisfaction client',
      description: 'Vous allez adorer'
    }
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Features */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <feature.icon className="h-8 w-8 text-primary-600 mb-2" />
                <h3 className="font-medium text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-8">
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-semibold text-gray-900 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <h3 className="font-semibold text-gray-900 mb-4">
              Newsletter
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Inscrivez-vous pour recevoir nos offres exclusives
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Votre email"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          {/* Social & Contact */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
              <a href="tel:+33123456789" className="flex items-center hover:text-primary-600">
                <Phone className="h-4 w-4 mr-1" />
                01 23 45 67 89
              </a>
              <a href="mailto:contact@shopchoc.com" className="flex items-center hover:text-primary-600">
                <Mail className="h-4 w-4 mr-1" />
                contact@shopchoc.com
              </a>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <img src="/images/payment/visa.svg" alt="Visa" className="h-8" />
            <img src="/images/payment/mastercard.svg" alt="Mastercard" className="h-8" />
            <img src="/images/payment/paypal.svg" alt="PayPal" className="h-8" />
            <img src="/images/payment/stripe.svg" alt="Stripe" className="h-8" />
            <CreditCard className="h-8 w-8 text-gray-400" />
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-600">
            <p>
              © {currentYear} ShopChoc. Tous droits réservés. 
              {' '}
              <Link to="/legal/terms" className="hover:text-primary-600">
                CGU
              </Link>
              {' · '}
              <Link to="/legal/privacy" className="hover:text-primary-600">
                Confidentialité
              </Link>
              {' · '}
              <Link to="/legal/cookies" className="hover:text-primary-600">
                Cookies
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
