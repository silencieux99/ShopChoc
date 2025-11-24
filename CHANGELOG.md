# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.0.0] - 2025-01-23

### Ajouté

#### Backend
- Configuration Firebase Admin SDK
- Authentification avec Firebase Auth
- CRUD complet pour les produits
- Upload d'images vers Firebase Storage
- Système de likes/favoris
- Intégration Stripe pour les paiements
- Gestion des transactions
- Profils utilisateurs
- Système de suivi (follow/unfollow)
- Rate limiting et sécurité avec Helmet
- Middleware d'authentification JWT
- Validation des fichiers uploadés

#### Frontend
- Interface moderne style Vinted 2025
- Design responsive (mobile, tablette, desktop)
- Authentification (inscription/connexion)
- Page d'accueil avec grille de produits
- Système de filtres avancés (catégorie, prix, recherche)
- Tri des produits (prix croissant/décroissant)
- Pagination des résultats
- Page de détails produit avec carousel d'images
- Formulaire de vente avec drag & drop d'images
- Système de likes/favoris
- Intégration Stripe Checkout
- Notifications toast
- State management avec Zustand
- Routes protégées
- Navbar avec recherche
- Thème moderne avec TailwindCSS
- Icônes Lucide React
- Animations et transitions fluides

#### Documentation
- README principal complet
- Guide de configuration détaillé (SETUP_GUIDE.md)
- README backend
- README frontend
- Guide de contribution
- Licence MIT
- Changelog

### Technologies

#### Backend
- Node.js + Express
- Firebase Admin SDK
- Firestore (base de données)
- Firebase Storage (images)
- Stripe (paiements)
- Multer (upload)
- Helmet (sécurité)
- CORS
- Express Rate Limit

#### Frontend
- React 18.2
- Vite 5
- TailwindCSS 3.4
- React Router 6
- Zustand (state management)
- Axios
- Firebase SDK
- Stripe.js
- React Dropzone
- Swiper
- Lucide React
- React Hot Toast

### Sécurité
- Authentification Firebase avec tokens JWT
- Validation des données côté serveur
- Protection CSRF
- Rate limiting (100 req/15min)
- Headers de sécurité avec Helmet
- Validation des fichiers uploadés (type, taille)
- Règles de sécurité Firestore et Storage
- Paiements sécurisés via Stripe

## [À venir]

### Prévu pour v1.1.0
- [ ] Système de messagerie entre acheteur et vendeur
- [ ] Notifications en temps réel
- [ ] Système de notation et avis
- [ ] Historique des achats/ventes
- [ ] Page de profil utilisateur complète
- [ ] Modification/suppression de produits
- [ ] Recherche avancée avec filtres multiples
- [ ] Mode sombre
- [ ] Support multilingue (FR/EN)
- [ ] Application mobile (React Native)

### Prévu pour v1.2.0
- [ ] Système de chat en direct
- [ ] Notifications push
- [ ] Recommandations de produits
- [ ] Statistiques vendeur
- [ ] Export des données
- [ ] API publique
- [ ] Webhooks
- [ ] Tests unitaires et E2E

### Idées futures
- [ ] Programme de parrainage
- [ ] Badges et gamification
- [ ] Vérification des vendeurs
- [ ] Assurance acheteur
- [ ] Livraison intégrée
- [ ] Mode boutique pour les vendeurs professionnels
- [ ] Analytics avancés
- [ ] A/B testing

---

**Note**: Les dates et fonctionnalités sont susceptibles de changer.
