import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, Bell, Shield, CreditCard, Globe, Palette, 
  Eye, Lock, Trash2, LogOut, ChevronRight, Check, X,
  Smartphone, Mail, Moon, Sun, Volume2
} from 'lucide-react';
import Button from '../../shared/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../../shared/ui/Card';
import Badge from '../../shared/ui/Badge';
import Modal, { ModalFooter } from '../../shared/ui/Modal';
import { cn } from '../../shared/utils/cn';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  
  const [activeSection, setActiveSection] = useState('notifications');
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: {
        newMessage: true,
        orderUpdate: true,
        promotions: false,
        newsletter: true,
        priceAlerts: true
      },
      push: {
        newMessage: true,
        orderUpdate: true,
        promotions: false,
        priceAlerts: true
      }
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      showPurchases: false,
      allowMessages: true,
      dataCollection: true
    },
    appearance: {
      theme: 'light',
      language: 'fr',
      currency: 'EUR',
      measurementUnit: 'metric'
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
      trustedDevices: 3
    },
    payment: {
      defaultMethod: 'card',
      savePaymentInfo: true,
      autoReload: false
    }
  });

  const sections = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Confidentialité', icon: Eye },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'payment', label: 'Paiement', icon: CreditCard },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'account', label: 'Compte', icon: Settings }
  ];

  const handleToggleSetting = (category, subcategory, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subcategory]: {
          ...prev[category][subcategory],
          [setting]: !prev[category][subcategory][setting]
        }
      }
    }));
    toast.success('Paramètre mis à jour');
  };

  const handleSimpleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
    toast.success('Paramètre mis à jour');
  };

  const handleSelectChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
    toast.success('Paramètre mis à jour');
  };

  const handleDeleteAccount = async () => {
    try {
      // Delete account logic
      toast.success('Compte supprimé');
      await signOut();
      navigate('/');
    } catch (error) {
      toast.error('Erreur lors de la suppression du compte');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    toast.success('Déconnexion réussie');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos préférences et la sécurité de votre compte
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card padding={false}>
              <nav className="space-y-1 p-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
                      activeSection === section.id
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <section.icon className="h-5 w-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Notifications */}
            {activeSection === 'notifications' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mail className="h-5 w-5 mr-2" />
                      Notifications par email
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(settings.notifications.email).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {key === 'newMessage' && 'Nouveaux messages'}
                              {key === 'orderUpdate' && 'Mises à jour de commande'}
                              {key === 'promotions' && 'Promotions et offres'}
                              {key === 'newsletter' && 'Newsletter hebdomadaire'}
                              {key === 'priceAlerts' && 'Alertes de prix'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {key === 'newMessage' && 'Recevez un email quand vous avez un nouveau message'}
                              {key === 'orderUpdate' && 'Suivez vos commandes par email'}
                              {key === 'promotions' && 'Offres exclusives et codes promo'}
                              {key === 'newsletter' && 'Les meilleures trouvailles de la semaine'}
                              {key === 'priceAlerts' && 'Baisse de prix sur vos favoris'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleToggleSetting('notifications', 'email', key)}
                            className={cn(
                              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                              value ? 'bg-primary-600' : 'bg-gray-200'
                            )}
                          >
                            <span
                              className={cn(
                                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                                value ? 'translate-x-6' : 'translate-x-1'
                              )}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Smartphone className="h-5 w-5 mr-2" />
                      Notifications push
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(settings.notifications.push).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {key === 'newMessage' && 'Nouveaux messages'}
                              {key === 'orderUpdate' && 'Mises à jour de commande'}
                              {key === 'promotions' && 'Promotions'}
                              {key === 'priceAlerts' && 'Alertes de prix'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleToggleSetting('notifications', 'push', key)}
                            className={cn(
                              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                              value ? 'bg-primary-600' : 'bg-gray-200'
                            )}
                          >
                            <span
                              className={cn(
                                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                                value ? 'translate-x-6' : 'translate-x-1'
                              )}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Privacy */}
            {activeSection === 'privacy' && (
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de confidentialité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visibilité du profil
                      </label>
                      <select
                        value={settings.privacy.profileVisibility}
                        onChange={(e) => handleSelectChange('privacy', 'profileVisibility', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="public">Public - Visible par tous</option>
                        <option value="friends">Amis uniquement</option>
                        <option value="private">Privé - Visible par moi uniquement</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Afficher mon email</p>
                          <p className="text-sm text-gray-600">Les autres utilisateurs peuvent voir votre email</p>
                        </div>
                        <button
                          onClick={() => handleSimpleToggle('privacy', 'showEmail')}
                          className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                            settings.privacy.showEmail ? 'bg-primary-600' : 'bg-gray-200'
                          )}
                        >
                          <span
                            className={cn(
                              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                              settings.privacy.showEmail ? 'translate-x-6' : 'translate-x-1'
                            )}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Autoriser les messages</p>
                          <p className="text-sm text-gray-600">Les utilisateurs peuvent vous envoyer des messages</p>
                        </div>
                        <button
                          onClick={() => handleSimpleToggle('privacy', 'allowMessages')}
                          className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                            settings.privacy.allowMessages ? 'bg-primary-600' : 'bg-gray-200'
                          )}
                        >
                          <span
                            className={cn(
                              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                              settings.privacy.allowMessages ? 'translate-x-6' : 'translate-x-1'
                            )}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Collecte de données</p>
                          <p className="text-sm text-gray-600">Améliorer l'expérience avec vos données anonymisées</p>
                        </div>
                        <button
                          onClick={() => handleSimpleToggle('privacy', 'dataCollection')}
                          className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                            settings.privacy.dataCollection ? 'bg-primary-600' : 'bg-gray-200'
                          )}
                        >
                          <span
                            className={cn(
                              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                              settings.privacy.dataCollection ? 'translate-x-6' : 'translate-x-1'
                            )}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security */}
            {activeSection === 'security' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Sécurité du compte</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Authentification à deux facteurs</p>
                          <p className="text-sm text-gray-600">
                            {settings.security.twoFactorAuth ? 'Activée' : 'Protégez votre compte avec une double authentification'}
                          </p>
                        </div>
                        <Button
                          variant={settings.security.twoFactorAuth ? 'success' : 'outline'}
                          size="sm"
                          onClick={() => handleSimpleToggle('security', 'twoFactorAuth')}
                        >
                          {settings.security.twoFactorAuth ? 'Activée' : 'Configurer'}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Alertes de connexion</p>
                          <p className="text-sm text-gray-600">Recevez une alerte lors d'une nouvelle connexion</p>
                        </div>
                        <button
                          onClick={() => handleSimpleToggle('security', 'loginAlerts')}
                          className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                            settings.security.loginAlerts ? 'bg-primary-600' : 'bg-gray-200'
                          )}
                        >
                          <span
                            className={cn(
                              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                              settings.security.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                            )}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Appareils de confiance</p>
                          <p className="text-sm text-gray-600">{settings.security.trustedDevices} appareils connectés</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Gérer
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Changer le mot de passe</p>
                          <p className="text-sm text-gray-600">Dernière modification il y a 3 mois</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Modifier
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Payment */}
            {activeSection === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle>Méthodes de paiement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className="text-sm text-gray-600">Expire 12/25</p>
                          </div>
                        </div>
                        {settings.payment.defaultMethod === 'card' && (
                          <Badge variant="primary" size="sm">Par défaut</Badge>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Modifier</Button>
                        <Button variant="outline" size="sm">Supprimer</Button>
                      </div>
                    </div>

                    <Button className="w-full" leftIcon={<Plus className="h-4 w-4" />}>
                      Ajouter une méthode de paiement
                    </Button>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Enregistrer les informations de paiement</p>
                          <p className="text-sm text-gray-600">Pour des achats plus rapides</p>
                        </div>
                        <button
                          onClick={() => handleSimpleToggle('payment', 'savePaymentInfo')}
                          className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                            settings.payment.savePaymentInfo ? 'bg-primary-600' : 'bg-gray-200'
                          )}
                        >
                          <span
                            className={cn(
                              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                              settings.payment.savePaymentInfo ? 'translate-x-6' : 'translate-x-1'
                            )}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Appearance */}
            {activeSection === 'appearance' && (
              <Card>
                <CardHeader>
                  <CardTitle>Préférences d'affichage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thème
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => handleSelectChange('appearance', 'theme', 'light')}
                          className={cn(
                            'p-4 rounded-lg border-2 flex flex-col items-center space-y-2',
                            settings.appearance.theme === 'light'
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <Sun className="h-6 w-6" />
                          <span className="text-sm">Clair</span>
                        </button>
                        <button
                          onClick={() => handleSelectChange('appearance', 'theme', 'dark')}
                          className={cn(
                            'p-4 rounded-lg border-2 flex flex-col items-center space-y-2',
                            settings.appearance.theme === 'dark'
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <Moon className="h-6 w-6" />
                          <span className="text-sm">Sombre</span>
                        </button>
                        <button
                          onClick={() => handleSelectChange('appearance', 'theme', 'auto')}
                          className={cn(
                            'p-4 rounded-lg border-2 flex flex-col items-center space-y-2',
                            settings.appearance.theme === 'auto'
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <Settings className="h-6 w-6" />
                          <span className="text-sm">Auto</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Langue
                      </label>
                      <select
                        value={settings.appearance.language}
                        onChange={(e) => handleSelectChange('appearance', 'language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="de">Deutsch</option>
                        <option value="it">Italiano</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Devise
                      </label>
                      <select
                        value={settings.appearance.currency}
                        onChange={(e) => handleSelectChange('appearance', 'currency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CHF">CHF</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Account */}
            {activeSection === 'account' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Gestion du compte</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Email</p>
                            <p className="text-sm text-gray-600">{user?.email}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Modifier
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-yellow-900">Télécharger mes données</p>
                            <p className="text-sm text-yellow-700">Recevez une copie de toutes vos données</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Télécharger
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-red-900">Supprimer mon compte</p>
                            <p className="text-sm text-red-700">Action irréversible</p>
                          </div>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => setDeleteAccountModalOpen(true)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setLogoutModalOpen(true)}
                      leftIcon={<LogOut className="h-5 w-5" />}
                    >
                      Se déconnecter
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Delete Account Modal */}
        <Modal
          isOpen={deleteAccountModalOpen}
          onClose={() => setDeleteAccountModalOpen(false)}
          title="Supprimer le compte"
        >
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-red-50 rounded-lg">
              <Trash2 className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="font-medium text-red-900">
                  Cette action est irréversible
                </p>
                <p className="text-sm text-red-700">
                  Toutes vos données seront définitivement supprimées
                </p>
              </div>
            </div>
            
            <p className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer votre compte ? Vous perdrez :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Tous vos articles en vente</li>
              <li>Votre historique de commandes</li>
              <li>Vos favoris et alertes</li>
              <li>Vos messages et évaluations</li>
            </ul>
          </div>
          
          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteAccountModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
            >
              Supprimer définitivement
            </Button>
          </ModalFooter>
        </Modal>

        {/* Logout Modal */}
        <Modal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          title="Déconnexion"
        >
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir vous déconnecter ?
          </p>
          
          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => setLogoutModalOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleLogout}>
              Se déconnecter
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}
