import { useState } from 'react';
import { Play, Settings, Download, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import Card from '../../shared/ui/Card';
import Button from '../../shared/ui/Button';
import Input from '../../shared/ui/Input';
import Badge from '../../shared/ui/Badge';
import toast from 'react-hot-toast';
import scraperService from '../../services/scraperService';

export default function AdminScraper() {
  const [config, setConfig] = useState({
    baseUrl: '',
    username: '',
    password: '',
    priceMultiplier: 1.3
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [progress, setProgress] = useState([]);
  const [currentProgress, setCurrentProgress] = useState(null);

  // Authentifier et charger les catégories
  const handleAuthenticate = async () => {
    if (!config.baseUrl) {
      toast.error('Veuillez remplir l\'URL du site');
      return;
    }

    try {
      setLoading(true);
      scraperService.setCredentials(config.baseUrl, config.username, config.password);
      
      toast.success('Configuration enregistrée');
      await loadCategories();
      
      setIsAuthenticated(true);
    } catch (error) {
      toast.error('Erreur: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Charger les catégories
  const loadCategories = async () => {
    try {
      setLoading(true);
      const cats = await scraperService.getCategories();
      setCategories(cats);
      toast.success(`${cats.length} catégories trouvées`);
    } catch (error) {
      toast.error('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  // Scrapper une catégorie
  const handleScrapeCategory = async (category, limit = null) => {
    try {
      setScraping(true);
      setProgress(prev => [...prev, { category: category.name, status: 'en cours', count: 0, message: '' }]);
      
      const products = await scraperService.scrapeCategory(
        category.url,
        category.name,
        config.priceMultiplier,
        limit,
        (prog) => {
          setCurrentProgress(prog);
          setProgress(prev => prev.map(p => 
            p.category === category.name 
              ? { ...p, message: prog.message || '', current: prog.current, total: prog.total }
              : p
          ));
        }
      );
      
      setProgress(prev => prev.map(p => 
        p.category === category.name 
          ? { ...p, status: 'terminé', count: products.length, message: 'Terminé' }
          : p
      ));
      toast.success(`${products.length} produits ajoutés`);
    } catch (error) {
      setProgress(prev => prev.map(p => 
        p.category === category.name 
          ? { ...p, status: 'erreur', message: error.message }
          : p
      ));
      toast.error('Erreur: ' + error.message);
    } finally {
      setScraping(false);
      setCurrentProgress(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Scraper Fournisseur</h1>
        <p className="text-sm md:text-base text-gray-600">Importez automatiquement les produits de votre fournisseur</p>
      </div>

      {/* Configuration */}
      {!isAuthenticated ? (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-semibold">Configuration</h2>
            </div>

            <Input
              label="URL du site fournisseur"
              placeholder="https://exemple.com"
              value={config.baseUrl}
              onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
            />

            <Input
              label="Nom d'utilisateur"
              placeholder="Votre username"
              value={config.username}
              onChange={(e) => setConfig({ ...config, username: e.target.value })}
            />

            <Input
              label="Mot de passe"
              type="password"
              placeholder="Votre mot de passe"
              value={config.password}
              onChange={(e) => setConfig({ ...config, password: e.target.value })}
            />

            <Input
              label="Multiplicateur de prix (marge)"
              type="number"
              step="0.1"
              placeholder="1.3"
              value={config.priceMultiplier}
              onChange={(e) => setConfig({ ...config, priceMultiplier: parseFloat(e.target.value) })}
              helperText="Ex: 1.3 = 30% de marge sur le prix fournisseur"
            />

            <Button
              onClick={handleAuthenticate}
              disabled={loading}
              leftIcon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              className="w-full"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Status */}
          <Card className="bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Connecté au fournisseur</p>
                  <p className="text-sm text-green-700">{config.baseUrl}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAuthenticated(false);
                  setCategories([]);
                  setProgress([]);
                }}
              >
                Déconnecter
              </Button>
            </div>
          </Card>

          {/* Actions globales */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Actions</h2>
              <Badge variant="info">{categories.length} catégories</Badge>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={loadCategories}
                disabled={loading}
                leftIcon={<Download className="h-4 w-4" />}
                variant="outline"
              >
                Recharger les catégories
              </Button>

              <Button
                onClick={handleScrapeAll}
                disabled={scraping || categories.length === 0}
                leftIcon={<Play className="h-4 w-4" />}
              >
                Tout scrapper
              </Button>
            </div>
          </Card>

          {/* Catégories */}
          {categories.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold mb-4">Catégories disponibles</h2>
              
              <div className="space-y-3">
                {categories.map((category, index) => {
                  const categoryProgress = progress.find(p => p.category === category.name);
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{category.url}</p>
                        
                        {categoryProgress && (
                          <div className="mt-2 flex items-center space-x-2">
                            {categoryProgress.status === 'en cours' && (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                <span className="text-sm text-blue-600">Scraping en cours...</span>
                              </>
                            )}
                            {categoryProgress.status === 'terminé' && (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-600">
                                  {categoryProgress.count} produits ajoutés
                                </span>
                              </>
                            )}
                            {categoryProgress.status === 'erreur' && (
                              <>
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <span className="text-sm text-red-600">Erreur</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleScrapeCategory(category, 5)}
                          disabled={scraping}
                        >
                          Test (5)
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleScrapeCategory(category)}
                          disabled={scraping}
                          leftIcon={<Play className="h-4 w-4" />}
                        >
                          Scrapper
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Info */}
          <Card className="bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Comment ça marche ?</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Entrez l'URL du site fournisseur</li>
                  <li>Les catégories sont automatiquement détectées</li>
                  <li>Testez avec 5 produits avant de tout scrapper</li>
                  <li>Chaque produit récupère 7-8 images automatiquement</li>
                  <li>Vos prix = Prix fournisseur × {config.priceMultiplier}</li>
                  <li>⚠️ Fonctionne uniquement si le site autorise CORS</li>
                </ul>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
