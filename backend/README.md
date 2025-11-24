# ShopChoc Backend API

API REST pour la plateforme ShopChoc construite avec Node.js, Express et Firebase.

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Configurer les variables d'environnement dans .env

# Démarrer en mode développement
npm run dev

# Démarrer en mode production
npm start
```

## 📋 Variables d'environnement

Créez un fichier `.env` à la racine du dossier backend :

```env
PORT=5000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=votre_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVotre clé\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@votre-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=votre-project.appspot.com

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## 🔧 Configuration Firebase

1. Créez un projet Firebase
2. Allez dans Paramètres > Comptes de service
3. Cliquez sur "Générer une nouvelle clé privée"
4. Copiez les valeurs dans votre fichier `.env`

## 📚 Documentation API

### Authentication

Toutes les routes protégées nécessitent un header `Authorization` :

```
Authorization: Bearer <firebase_id_token>
```

### Routes disponibles

#### Products

```
GET    /api/products              - Liste des produits
GET    /api/products/:id          - Détails d'un produit
POST   /api/products              - Créer un produit (auth)
PUT    /api/products/:id          - Modifier un produit (auth)
DELETE /api/products/:id          - Supprimer un produit (auth)
POST   /api/products/:id/like     - Liker un produit (auth)
GET    /api/products/user/:userId - Produits d'un utilisateur
```

#### Users

```
GET    /api/users/:userId              - Profil utilisateur
POST   /api/users/profile              - Créer un profil (auth)
PUT    /api/users/profile              - Modifier le profil (auth)
POST   /api/users/follow/:targetUserId - Suivre un utilisateur (auth)
GET    /api/users/favorites/me         - Mes favoris (auth)
```

#### Payment

```
POST   /api/payment/create-checkout-session - Créer une session Stripe (auth)
GET    /api/payment/verify/:sessionId       - Vérifier un paiement (auth)
GET    /api/payment/transactions            - Historique des transactions (auth)
```

## 🗂️ Structure Firestore

### Collection: users

```javascript
{
  username: string,
  email: string,
  displayName: string,
  avatar: string,
  bio: string,
  location: string,
  rating: number,
  reviewsCount: number,
  salesCount: number,
  followers: array,
  following: array,
  createdAt: timestamp
}
```

### Collection: products

```javascript
{
  title: string,
  description: string,
  price: number,
  category: string,
  condition: string,
  brand: string,
  size: string,
  images: array,
  userId: string,
  status: string, // 'available' | 'sold'
  views: number,
  likes: array,
  createdAt: timestamp,
  updatedAt: timestamp,
  soldAt: timestamp (optional),
  buyerId: string (optional)
}
```

### Collection: transactions

```javascript
{
  productId: string,
  buyerId: string,
  sellerId: string,
  amount: number,
  stripeSessionId: string,
  status: string, // 'completed' | 'pending' | 'failed'
  createdAt: timestamp
}
```

## 🔒 Sécurité

- Rate limiting: 100 requêtes par 15 minutes
- Helmet pour les headers de sécurité
- CORS configuré
- Validation des fichiers uploadés
- Authentification Firebase

## 📦 Dépendances principales

- `express` - Framework web
- `firebase-admin` - SDK Firebase Admin
- `stripe` - Paiements
- `multer` - Upload de fichiers
- `helmet` - Sécurité HTTP
- `cors` - Cross-Origin Resource Sharing
- `express-rate-limit` - Rate limiting
- `dotenv` - Variables d'environnement

## 🧪 Tests

```bash
# À venir
npm test
```

## 📝 Logs

Les logs sont affichés dans la console en mode développement.

## 🐛 Debugging

Pour activer les logs détaillés :

```bash
NODE_ENV=development npm run dev
```

## 🚀 Déploiement

### Railway

1. Créez un nouveau projet sur Railway
2. Connectez votre repo GitHub
3. Ajoutez les variables d'environnement
4. Déployez !

### Render

1. Créez un nouveau Web Service
2. Connectez votre repo
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Ajoutez les variables d'environnement

## 📄 Licence

MIT
