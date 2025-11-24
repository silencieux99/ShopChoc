import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Camera, Mail, Phone, MapPin, Calendar, 
  Shield, Save, X, Check, Edit2
} from 'lucide-react';
import Button from '../../shared/ui/Button';
import Input from '../../shared/ui/Input';
import Card, { CardHeader, CardTitle, CardContent } from '../../shared/ui/Card';
import Badge from '../../shared/ui/Badge';
import { cn } from '../../shared/utils/cn';
import { useAuthStore } from '../../store/useAuthStore';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    username: userProfile?.username || '',
    email: user?.email || '',
    firstName: userProfile?.firstName || '',
    lastName: userProfile?.lastName || '',
    phone: userProfile?.phone || '',
    bio: userProfile?.bio || '',
    location: userProfile?.location || '',
    birthDate: userProfile?.birthDate || '',
    language: userProfile?.language || 'fr',
    newsletter: userProfile?.newsletter || false,
    publicProfile: userProfile?.publicProfile || true
  });

  const [stats] = useState({
    memberSince: userProfile?.createdAt || new Date().toISOString(),
    totalSales: 42,
    totalPurchases: 18,
    rating: 4.8,
    reviews: 24,
    followers: 156,
    following: 89
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Upload avatar if changed
      if (avatarFile) {
        // Handle avatar upload
        console.log('Uploading avatar...');
      }
      
      // Update profile
      await userService.updateProfile(formData);
      
      toast.success('Profil mis à jour avec succès');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image doit faire moins de 5MB');
        return;
      }
      
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos informations personnelles et votre visibilité
          </p>
        </div>

        {/* Profile Card */}
        <Card className="mb-8">
          <CardContent>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                    {avatarPreview || userProfile?.avatar ? (
                      <img
                        src={avatarPreview || userProfile?.avatar}
                        alt={userProfile?.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-2xl font-bold">
                        {userProfile?.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 p-1.5 bg-primary-600 text-white rounded-full cursor-pointer hover:bg-primary-700">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  {userProfile?.verified && (
                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-1">
                      <Check className="h-5 w-5 text-primary-600" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {userProfile?.username || 'Utilisateur'}
                  </h2>
                  <p className="text-gray-600">
                    {user?.email}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    {userProfile?.verified && (
                      <Badge variant="primary" size="sm">
                        <Check className="h-3 w-3 mr-1" />
                        Vérifié
                      </Badge>
                    )}
                    <Badge variant="default" size="sm">
                      Membre depuis {new Date(stats.memberSince).getFullYear()}
                    </Badge>
                  </div>
                </div>
              </div>

              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  leftIcon={<Edit2 className="h-4 w-4" />}
                >
                  Modifier
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setAvatarPreview(null);
                      setAvatarFile(null);
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    loading={loading}
                    leftIcon={<Save className="h-4 w-4" />}
                  >
                    Enregistrer
                  </Button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
                <p className="text-sm text-gray-600">Ventes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.totalPurchases}</p>
                <p className="text-sm text-gray-600">Achats</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  ⭐ {stats.rating}
                </p>
                <p className="text-sm text-gray-600">{stats.reviews} avis</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.followers}</p>
                <p className="text-sm text-gray-600">Abonnés</p>
              </div>
            </div>

            {/* Form */}
            {isEditing && (
              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Prénom"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    leftIcon={<User className="h-5 w-5 text-gray-400" />}
                  />
                  <Input
                    label="Nom"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    leftIcon={<User className="h-5 w-5 text-gray-400" />}
                  />
                  <Input
                    label="Nom d'utilisateur"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    leftIcon={<User className="h-5 w-5 text-gray-400" />}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    disabled
                    leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
                  />
                  <Input
                    label="Téléphone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    leftIcon={<Phone className="h-5 w-5 text-gray-400" />}
                  />
                  <Input
                    label="Localisation"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    leftIcon={<MapPin className="h-5 w-5 text-gray-400" />}
                    placeholder="Ville, Pays"
                  />
                  <Input
                    label="Date de naissance"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    leftIcon={<Calendar className="h-5 w-5 text-gray-400" />}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Langue
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({...formData, language: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Parlez-nous de vous..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.newsletter}
                      onChange={(e) => setFormData({...formData, newsletter: e.target.checked})}
                      className="h-4 w-4 text-primary-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Recevoir les newsletters et offres promotionnelles
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.publicProfile}
                      onChange={(e) => setFormData({...formData, publicProfile: e.target.checked})}
                      className="h-4 w-4 text-primary-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Profil public (visible par les autres utilisateurs)
                    </span>
                  </label>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-gray-600" />
              Sécurité du compte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Mot de passe</p>
                  <p className="text-sm text-gray-600">
                    Dernière modification il y a 3 mois
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Modifier
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Authentification à deux facteurs</p>
                  <p className="text-sm text-gray-600">
                    Protégez votre compte avec une couche de sécurité supplémentaire
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configurer
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Sessions actives</p>
                  <p className="text-sm text-gray-600">
                    Gérez les appareils connectés à votre compte
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Voir tout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
