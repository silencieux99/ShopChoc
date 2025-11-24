# 🛍️ ShopChoc - Marketplace Moderne P2P

ShopChoc est une plateforme moderne de vente entre particuliers inspirée de Vinted, construite avec les dernières technologies web 2025.

![ShopChoc](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Firebase](https://img.shields.io/badge/Firebase-10.7-orange)

## ✨ Fonctionnalités

### 🎯 Pour les utilisateurs
- ✅ Inscription et connexion sécurisées avec Firebase Auth
- 🔍 Recherche avancée avec filtres (prix, catégorie, état)
- ❤️ Système de favoris
- 👤 Profils utilisateurs personnalisables
- 📱 Interface responsive et moderne (style Vinted 2025)
- 🖼️ Upload multiple d'images (jusqu'à 5 par produit)
- 💳 Paiement sécurisé avec Stripe
- 📊 Historique des transactions

### 🛠️ Fonctionnalités techniques
- 🔥 Firebase Firestore pour la base de données
- 📦 Firebase Storage pour les images
- 🎨 Interface moderne avec TailwindCSS
- ⚡ React + Vite pour des performances optimales
- 🔐 Authentification JWT via Firebase
- 💰 Intégration Stripe pour les paiements
- 🎭 Gestion d'état avec Zustand
- 📸 Drag & drop pour l'upload d'images

## 🚀 Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte Firebase
- Compte Stripe (pour les paiements)

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/ShopChoc.git
cd ShopChoc
```

### 2. Configuration Firebase

1. Créez un projet sur [Firebase Console](https://console.firebase.google.com/)
2. Activez **Authentication** (Email/Password)
3. Créez une base de données **Firestore**
4. Activez **Storage**
5. Téléchargez la clé privée du service account (Paramètres > Comptes de service)

### 3. Configuration Backend

```bash
cd backend
npm install
```

Créez un fichier `.env` :

```env
PORT=5000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=votre_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVotre clé privée\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@votre-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=votre-project.appspot.com

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 4. Configuration Frontend

```bash
cd frontend
npm install
```

Créez un fichier `.env` :

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre_project_id
VITE_FIREBASE_STORAGE_BUCKET=votre_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# API URL
VITE_API_URL=http://localhost:5000/api
```

### 5. Règles de sécurité Firebase

#### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /products/{productId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /transactions/{transactionId} {
      allow read: if request.auth != null && 
        (resource.data.buyerId == request.auth.uid || 
         resource.data.sellerId == request.auth.uid);
      allow create: if request.auth != null;
    }
  }
}
```

#### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 6. Démarrage

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

L'application sera accessible sur:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## 📁 Structure du projet

```
ShopChoc/
├── backend/
│   ├── config/
│   │   └── firebase.js          # Configuration Firebase Admin
│   ├── controllers/
│   │   ├── productController.js # Logique produits
│   │   ├── userController.js    # Logique utilisateurs
│   │   └── paymentController.js # Logique paiements
│   ├── middleware/
│   │   ├── auth.js              # Vérification JWT
│   │   └── upload.js            # Upload fichiers
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js
│   │   └── paymentRoutes.js
│   ├── utils/
│   │   └── uploadToStorage.js   # Upload Firebase Storage
│   ├── index.js                 # Point d'entrée
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   └── SellProduct.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── productService.js
│   │   │   ├── userService.js
│   │   │   └── paymentService.js
│   │   ├── store/
│   │   │   ├── useAuthStore.js
│   │   │   └── useProductStore.js
│   │   ├── config/
│   │   │   └── firebase.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## 🎨 Technologies utilisées

### Frontend
- **React 18.2** - Framework UI
- **Vite 5** - Build tool ultra-rapide
- **TailwindCSS 3.4** - Framework CSS utility-first
- **React Router 6** - Routing
- **Zustand** - Gestion d'état
- **Axios** - Requêtes HTTP
- **Firebase SDK** - Auth & Storage client
- **Stripe.js** - Paiements
- **React Dropzone** - Upload d'images
- **Swiper** - Carousel d'images
- **Lucide React** - Icônes modernes
- **React Hot Toast** - Notifications

### Backend
- **Node.js + Express** - Serveur API
- **Firebase Admin SDK** - Backend Firebase
- **Firestore** - Base de données NoSQL
- **Firebase Storage** - Stockage d'images
- **Stripe** - Traitement des paiements
- **Multer** - Upload de fichiers
- **Helmet** - Sécurité HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Express Rate Limit** - Protection DDoS

## 🔒 Sécurité

- ✅ Authentification Firebase avec tokens JWT
- ✅ Validation des données côté serveur
- ✅ Protection CSRF
- ✅ Rate limiting sur l'API
- ✅ Headers de sécurité avec Helmet
- ✅ Validation des fichiers uploadés
- ✅ Paiements sécurisés via Stripe

## 📱 Responsive Design

L'interface s'adapte parfaitement à tous les écrans :
- 📱 Mobile (320px+)
- 📱 Tablette (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1440px+)

## 🚀 Déploiement

### Backend (Railway, Render, ou Heroku)

```bash
# Build
npm install
npm start

# Variables d'environnement à configurer
PORT=5000
NODE_ENV=production
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_STORAGE_BUCKET=...
STRIPE_SECRET_KEY=...
FRONTEND_URL=https://votre-frontend.com
```

### Frontend (Vercel, Netlify, ou Firebase Hosting)

```bash
# Build
npm run build

# Variables d'environnement à configurer
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_STRIPE_PUBLISHABLE_KEY=...
VITE_API_URL=https://votre-backend.com/api
```

## 📝 API Endpoints

### Products
- `GET /api/products` - Liste des produits (avec filtres)
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit (auth requise)
- `PUT /api/products/:id` - Modifier un produit (auth requise)
- `DELETE /api/products/:id` - Supprimer un produit (auth requise)
- `POST /api/products/:id/like` - Liker un produit (auth requise)
- `GET /api/products/user/:userId` - Produits d'un utilisateur

### Users
- `GET /api/users/:userId` - Profil utilisateur
- `POST /api/users/profile` - Créer un profil (auth requise)
- `PUT /api/users/profile` - Modifier le profil (auth requise)
- `POST /api/users/follow/:targetUserId` - Suivre un utilisateur (auth requise)
- `GET /api/users/favorites/me` - Mes favoris (auth requise)

### Payment
- `POST /api/payment/create-checkout-session` - Créer une session Stripe (auth requise)
- `GET /api/payment/verify/:sessionId` - Vérifier un paiement (auth requise)
- `GET /api/payment/transactions` - Historique des transactions (auth requise)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails

## 👨‍💻 Auteur

Créé avec ❤️ pour la communauté

## 🙏 Remerciements

- Inspiré par Vinted
- Design moderne 2025
- Communauté open source

---

**Note:** Ce projet est à but éducatif. Pour une utilisation en production, assurez-vous de bien configurer tous les aspects de sécurité et de conformité (RGPD, CGV, etc.).
