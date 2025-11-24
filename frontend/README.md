# ShopChoc Frontend

Interface utilisateur moderne pour ShopChoc construite avec React, Vite et TailwindCSS.

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Configurer les variables d'environnement dans .env

# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build de production
npm run preview
```

## 📋 Variables d'environnement

Créez un fichier `.env` à la racine du dossier frontend :

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

## 🎨 Technologies

- **React 18.2** - Bibliothèque UI
- **Vite 5** - Build tool moderne
- **TailwindCSS 3.4** - Framework CSS
- **React Router 6** - Routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Firebase SDK** - Authentication & Storage
- **Stripe.js** - Paiements
- **React Dropzone** - Upload d'images
- **Swiper** - Carousel
- **Lucide React** - Icônes
- **React Hot Toast** - Notifications

## 📁 Structure

```
src/
├── components/          # Composants réutilisables
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   ├── FilterBar.jsx
│   └── ProtectedRoute.jsx
├── pages/              # Pages de l'application
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── ProductDetail.jsx
│   └── SellProduct.jsx
├── services/           # Services API
│   ├── api.js
│   ├── productService.js
│   ├── userService.js
│   └── paymentService.js
├── store/              # State management (Zustand)
│   ├── useAuthStore.js
│   └── useProductStore.js
├── config/             # Configuration
│   └── firebase.js
├── App.jsx             # Composant principal
├── main.jsx            # Point d'entrée
└── index.css           # Styles globaux
```

## 🎯 Fonctionnalités

### Pages

- **Home** - Liste des produits avec filtres et recherche
- **Login** - Connexion utilisateur
- **Signup** - Inscription utilisateur
- **ProductDetail** - Détails d'un produit avec carousel d'images
- **SellProduct** - Formulaire de vente avec upload d'images

### Composants

- **Navbar** - Navigation avec recherche et menu utilisateur
- **ProductCard** - Carte produit avec image, prix et like
- **FilterBar** - Filtres par catégorie, prix et tri
- **ProtectedRoute** - Protection des routes authentifiées

### Services

- **api.js** - Configuration Axios avec intercepteurs
- **productService** - CRUD produits
- **userService** - Gestion utilisateurs
- **paymentService** - Paiements Stripe

### Stores (Zustand)

- **useAuthStore** - Authentification et profil utilisateur
- **useProductStore** - Gestion des produits et filtres

## 🎨 Design System

### Couleurs

```javascript
primary: {
  50: '#f0f9ff',
  500: '#0ea5e9',
  600: '#0284c7',
  700: '#0369a1',
}

secondary: {
  50: '#fdf4ff',
  500: '#d946ef',
  600: '#c026d3',
  700: '#a21caf',
}
```

### Typographie

- Font: Inter (Google Fonts)
- Tailles: text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl

### Espacements

- Padding: p-2, p-4, p-6, p-8
- Margin: m-2, m-4, m-6, m-8
- Gap: gap-2, gap-4, gap-6, gap-8

## 📱 Responsive

L'application est entièrement responsive avec des breakpoints :

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## 🔒 Routes protégées

Les routes suivantes nécessitent une authentification :

- `/sell` - Vendre un produit
- `/profile` - Profil utilisateur
- `/favorites` - Favoris
- `/my-products` - Mes articles

## 🚀 Build & Déploiement

### Build local

```bash
npm run build
```

Le build sera généré dans le dossier `dist/`.

### Déploiement Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Déploiement Netlify

```bash
# Build
npm run build

# Déployer le dossier dist/
netlify deploy --prod --dir=dist
```

### Déploiement Firebase Hosting

```bash
# Installer Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Initialiser
firebase init hosting

# Déployer
firebase deploy --only hosting
```

## 🧪 Tests

```bash
# À venir
npm test
```

## 📝 Scripts disponibles

- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Build pour la production
- `npm run preview` - Prévisualiser le build
- `npm run lint` - Linter le code

## 🎨 Personnalisation

### Modifier les couleurs

Éditez `tailwind.config.js` :

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Vos couleurs
      }
    }
  }
}
```

### Ajouter des polices

Modifiez `src/index.css` :

```css
@import url('https://fonts.googleapis.com/css2?family=VotrePolice&display=swap');
```

## 🐛 Debugging

### React DevTools

Installez l'extension React DevTools pour Chrome/Firefox.

### Vite DevTools

Les erreurs s'affichent directement dans le navigateur en mode dev.

## 📄 Licence

MIT
