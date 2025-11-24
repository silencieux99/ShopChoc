import { useState } from 'react';
import { 
  MapPin, Plus, Edit2, Trash2, Check, Home, Briefcase 
} from 'lucide-react';
import Button from '../../shared/ui/Button';
import Input from '../../shared/ui/Input';
import Select from '../../shared/ui/Select';
import Card from '../../shared/ui/Card';
import Modal, { ModalFooter } from '../../shared/ui/Modal';
import EmptyState from '../../shared/ui/EmptyState';
import Badge from '../../shared/ui/Badge';
import { cn } from '../../shared/utils/cn';
import toast from 'react-hot-toast';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      type: 'home',
      name: 'Domicile',
      firstName: 'Jean',
      lastName: 'Dupont',
      address: '12 rue de la Paix',
      addressComplement: 'Appartement 3B',
      city: 'Paris',
      postalCode: '75002',
      country: 'France',
      phone: '+33 6 12 34 56 78',
      isDefault: true
    },
    {
      id: '2',
      type: 'work',
      name: 'Bureau',
      firstName: 'Jean',
      lastName: 'Dupont',
      address: '45 avenue des Champs',
      addressComplement: '',
      city: 'Paris',
      postalCode: '75008',
      country: 'France',
      phone: '+33 1 23 45 67 89',
      isDefault: false
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    type: 'home',
    name: '',
    firstName: '',
    lastName: '',
    address: '',
    addressComplement: '',
    city: '',
    postalCode: '',
    country: 'FR',
    phone: '',
    isDefault: false
  });

  const [errors, setErrors] = useState({});

  const countries = [
    { value: 'FR', label: 'France' },
    { value: 'BE', label: 'Belgique' },
    { value: 'CH', label: 'Suisse' },
    { value: 'DE', label: 'Allemagne' },
    { value: 'ES', label: 'Espagne' },
    { value: 'IT', label: 'Italie' },
    { value: 'UK', label: 'Royaume-Uni' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Le nom est requis';
    if (!formData.firstName) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName) newErrors.lastName = 'Le nom est requis';
    if (!formData.address) newErrors.address = 'L\'adresse est requise';
    if (!formData.city) newErrors.city = 'La ville est requise';
    if (!formData.postalCode) newErrors.postalCode = 'Le code postal est requis';
    if (!formData.phone) newErrors.phone = 'Le téléphone est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      setEditingAddress(null);
      setFormData({
        type: 'home',
        name: '',
        firstName: '',
        lastName: '',
        address: '',
        addressComplement: '',
        city: '',
        postalCode: '',
        country: 'FR',
        phone: '',
        isDefault: addresses.length === 0
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editingAddress) {
      // Update existing address
      setAddresses(addresses.map(addr => {
        if (addr.id === editingAddress.id) {
          return { ...formData, id: addr.id };
        }
        // If setting as default, remove default from others
        if (formData.isDefault && addr.isDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      }));
      toast.success('Adresse modifiée avec succès');
    } else {
      // Add new address
      const newAddress = {
        ...formData,
        id: Date.now().toString()
      };
      
      // If setting as default, remove default from others
      if (newAddress.isDefault) {
        setAddresses([
          ...addresses.map(addr => ({ ...addr, isDefault: false })),
          newAddress
        ]);
      } else {
        setAddresses([...addresses, newAddress]);
      }
      toast.success('Adresse ajoutée avec succès');
    }
    
    setIsModalOpen(false);
  };

  const handleSetDefault = (addressId) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
    toast.success('Adresse par défaut modifiée');
  };

  const handleDeleteAddress = () => {
    if (!addressToDelete) return;
    
    setAddresses(addresses.filter(addr => addr.id !== addressToDelete.id));
    
    // If deleted address was default, set first remaining as default
    if (addressToDelete.isDefault && addresses.length > 1) {
      const remaining = addresses.filter(addr => addr.id !== addressToDelete.id);
      if (remaining.length > 0) {
        remaining[0].isDefault = true;
      }
    }
    
    toast.success('Adresse supprimée');
    setDeleteModalOpen(false);
    setAddressToDelete(null);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'home':
        return <Home className="h-5 w-5" />;
      case 'work':
        return <Briefcase className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes adresses</h1>
            <p className="text-gray-600 mt-1">
              Gérez vos adresses de livraison et facturation
            </p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            leftIcon={<Plus className="h-5 w-5" />}
          >
            Ajouter une adresse
          </Button>
        </div>

        {/* Addresses Grid */}
        {addresses.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="Aucune adresse"
            description="Ajoutez une adresse pour faciliter vos commandes"
            action={{
              label: 'Ajouter une adresse',
              onClick: () => handleOpenModal(),
              icon: <Plus className="h-5 w-5" />
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <Card
                key={address.id}
                className={cn(
                  'relative',
                  address.isDefault && 'ring-2 ring-primary-600'
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getTypeIcon(address.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {address.name}
                      </h3>
                      {address.isDefault && (
                        <Badge variant="primary" size="sm">
                          Par défaut
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleOpenModal(address)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setAddressToDelete(address);
                        setDeleteModalOpen(true);
                      }}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <p className="font-medium text-gray-900">
                    {address.firstName} {address.lastName}
                  </p>
                  <p className="text-gray-600">
                    {address.address}
                  </p>
                  {address.addressComplement && (
                    <p className="text-gray-600">
                      {address.addressComplement}
                    </p>
                  )}
                  <p className="text-gray-600">
                    {address.postalCode} {address.city}
                  </p>
                  <p className="text-gray-600">
                    {address.country}
                  </p>
                  <p className="text-gray-600">
                    {address.phone}
                  </p>
                </div>

                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Définir par défaut
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'adresse
              </label>
              <div className="flex space-x-3">
                <button
                  onClick={() => setFormData({...formData, type: 'home'})}
                  className={cn(
                    'flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors',
                    formData.type === 'home'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <Home className="h-5 w-5" />
                  <span>Domicile</span>
                </button>
                <button
                  onClick={() => setFormData({...formData, type: 'work'})}
                  className={cn(
                    'flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors',
                    formData.type === 'work'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <Briefcase className="h-5 w-5" />
                  <span>Bureau</span>
                </button>
                <button
                  onClick={() => setFormData({...formData, type: 'other'})}
                  className={cn(
                    'flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors',
                    formData.type === 'other'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <MapPin className="h-5 w-5" />
                  <span>Autre</span>
                </button>
              </div>
            </div>

            <Input
              label="Nom de l'adresse"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: Domicile, Bureau..."
              error={errors.name}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                error={errors.firstName}
                required
              />
              <Input
                label="Nom"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                error={errors.lastName}
                required
              />
            </div>

            <Input
              label="Adresse"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              error={errors.address}
              required
            />

            <Input
              label="Complément d'adresse"
              value={formData.addressComplement}
              onChange={(e) => setFormData({...formData, addressComplement: e.target.value})}
              placeholder="Appartement, étage, etc. (optionnel)"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Code postal"
                value={formData.postalCode}
                onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                error={errors.postalCode}
                required
              />
              <Input
                label="Ville"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                error={errors.city}
                required
              />
            </div>

            <Select
              label="Pays"
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              options={countries}
            />

            <Input
              label="Téléphone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              error={errors.phone}
              placeholder="+33 6 12 34 56 78"
              required
            />

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                className="h-4 w-4 text-primary-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Utiliser comme adresse par défaut
              </span>
            </label>
          </div>

          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {editingAddress ? 'Modifier' : 'Ajouter'}
            </Button>
          </ModalFooter>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Confirmer la suppression"
        >
          <p className="text-gray-600">
            Êtes-vous sûr de vouloir supprimer l'adresse "{addressToDelete?.name}" ?
            Cette action est irréversible.
          </p>
          
          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAddress}
            >
              Supprimer
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}
