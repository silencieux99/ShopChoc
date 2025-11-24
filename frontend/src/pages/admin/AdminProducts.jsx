import { useState } from 'react';
import { 
  Plus, Search, Filter, Download, Upload, 
  Edit, Trash2, Eye, MoreVertical, Image,
  Package, AlertCircle, Check, X, Copy
} from 'lucide-react';
import Card from '../../shared/ui/Card';
import Button from '../../shared/ui/Button';
import Badge from '../../shared/ui/Badge';
import Modal from '../../shared/ui/Modal';
import Input from '../../shared/ui/Input';
import { cn } from '../../shared/utils/cn';

export default function AdminProducts() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Products data - Empty initially
  const products = [];

  const categories = ['all', 'Femme', 'Homme', 'Enfant', 'Accessoires', 'Maison'];

  const getStatusBadge = (status, stock) => {
    if (status === 'out_of_stock' || stock === 0) {
      return <Badge variant="error" size="sm">Rupture</Badge>;
    }
    if (status === 'low_stock' || stock < 10) {
      return <Badge variant="warning" size="sm">Stock faible</Badge>;
    }
    if (status === 'inactive') {
      return <Badge variant="default" size="sm">Inactif</Badge>;
    }
    return <Badge variant="success" size="sm">Actif</Badge>;
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} on products:`, selectedProducts);
    setSelectedProducts([]);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleDuplicateProduct = (product) => {
    console.log('Duplicate product:', product);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Produits</h1>
          <p className="text-sm md:text-base text-gray-600">Gérez votre catalogue de produits</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" leftIcon={<Upload className="h-4 w-4" />} className="hidden sm:flex">
            Importer
          </Button>
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />} className="hidden sm:flex">
            Exporter
          </Button>
          <Button variant="outline" size="sm" className="sm:hidden">
            <Upload className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="sm:hidden">
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setShowAddModal(true)}
          >
            <span className="hidden sm:inline">Nouveau produit</span>
            <span className="sm:hidden">Nouveau</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-blue-600">Total produits</p>
              <p className="text-xl md:text-2xl font-bold text-blue-900">{products.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-green-600">Actifs</p>
              <p className="text-xl md:text-2xl font-bold text-green-900">0</p>
            </div>
            <Check className="h-6 w-6 md:h-8 md:w-8 text-green-500" />
          </div>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-yellow-600">Stock faible</p>
              <p className="text-xl md:text-2xl font-bold text-yellow-900">0</p>
            </div>
            <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-red-600">Rupture stock</p>
              <p className="text-xl md:text-2xl font-bold text-red-900">0</p>
            </div>
            <X className="h-6 w-6 md:h-8 md:w-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {/* Search */}
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

            {/* Category Filter */}
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Toutes catégories' : cat}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="newest">Plus récent</option>
              <option value="oldest">Plus ancien</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="stock_asc">Stock croissant</option>
              <option value="stock_desc">Stock décroissant</option>
              <option value="sales">Meilleures ventes</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-lg",
                viewMode === 'grid' ? "bg-primary-100 text-primary-600" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" strokeWidth="2" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-lg",
                viewMode === 'list' ? "bg-primary-100 text-primary-600" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" />
                <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" />
                <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Card className="bg-primary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-primary-900">
              {selectedProducts.length} produit(s) sélectionné(s)
            </p>
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleBulkAction('activate')}
              >
                Activer
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleBulkAction('deactivate')}
              >
                Désactiver
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => handleBulkAction('delete')}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map(product => (
            <Card key={product.id} padding={false} className="overflow-hidden">
              <div className="relative">
                {/* Checkbox */}
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
                
                {/* Actions Menu */}
                <div className="absolute top-2 right-2 z-10">
                  <button className="p-1 bg-white rounded-lg shadow hover:bg-gray-50">
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Image */}
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                
                {/* Status Badge */}
                <div className="absolute bottom-2 right-2">
                  {getStatusBadge(product.status, product.stock)}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500">{product.sku}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    €{product.price}
                  </span>
                  <Badge variant="default" size="sm">{product.category}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="text-gray-500">Stock:</span> {product.stock}
                  </div>
                  <div>
                    <span className="text-gray-500">Ventes:</span> {product.sales}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDuplicateProduct(product)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteProduct(product)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedProducts.length === products.length}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ventes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.createdAt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                    <td className="px-6 py-4">
                      <Badge variant="default" size="sm">{product.category}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">€{product.price}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.sales}</td>
                    <td className="px-6 py-4">{getStatusBadge(product.status, product.stock)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add/Edit Product Modal */}
      {(showAddModal || showEditModal) && (
        <Modal
          isOpen={showAddModal || showEditModal}
          onClose={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          title={showEditModal ? 'Modifier le produit' : 'Nouveau produit'}
          size="lg"
        >
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Nom du produit"
                placeholder="Ex: Robe d'été"
                defaultValue={selectedProduct?.name}
                required
              />
              <Input 
                label="SKU"
                placeholder="Ex: SKU001"
                defaultValue={selectedProduct?.sku}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Prix"
                type="number"
                placeholder="0.00"
                defaultValue={selectedProduct?.price}
                leftIcon={<span className="text-gray-500">€</span>}
                required
              />
              <Input 
                label="Stock"
                type="number"
                placeholder="0"
                defaultValue={selectedProduct?.stock}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Femme</option>
                <option>Homme</option>
                <option>Enfant</option>
                <option>Accessoires</option>
                <option>Maison</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Description du produit..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer">
                <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Cliquez pour télécharger ou glissez-déposez
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG jusqu'à 10MB
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedProduct(null);
                }}
              >
                Annuler
              </Button>
              <Button type="submit">
                {showEditModal ? 'Enregistrer' : 'Créer le produit'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedProduct(null);
          }}
          title="Supprimer le produit"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer <strong>{selectedProduct?.name}</strong> ?
              Cette action est irréversible.
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProduct(null);
                }}
              >
                Annuler
              </Button>
              <Button 
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  console.log('Delete product:', selectedProduct);
                  setShowDeleteModal(false);
                  setSelectedProduct(null);
                }}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
