# 🚀 Guide de Configuration ShopChoc

Ce guide vous accompagne pas à pas pour configurer et démarrer ShopChoc.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir :

- ✅ Node.js 18+ installé ([Télécharger](https://nodejs.org/))
- ✅ npm ou yarn
- ✅ Un compte Firebase ([Créer un compte](https://firebase.google.com/))
- ✅ Un compte Stripe ([Créer un compte](https://stripe.com/))
- ✅ Git installé

## 🔥 Étape 1 : Configuration Firebase

### 1.1 Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Nommez votre projet (ex: shopchoc-prod)
4. Désactivez Google Analytics (optionnel)
5. Cliquez sur "Créer le projet"

### 1.2 Activer l'authentification

1. Dans le menu latéral, cliquez sur "Authentication"
2. Cliquez sur "Commencer"
3. Activez "E-mail/Mot de passe"
4. Cliquez sur "Enregistrer"

### 1.3 Créer une base de données Firestore

1. Dans le menu latéral, cliquez sur "Firestore Database"
2. Cliquez sur "Créer une base de données"
3. Choisissez "Démarrer en mode test" (nous configurerons les règles plus tard)
4. Sélectionnez une région proche de vos utilisateurs
5. Cliquez sur "Activer"

### 1.4 Activer Storage

1. Dans le menu latéral, cliquez sur "Storage"
2. Cliquez sur "Commencer"
3. Acceptez les règles par défaut
4. Cliquez sur "Terminer"

### 1.5 Obtenir les clés Firebase (Frontend)

1. Cliquez sur l'icône ⚙️ > "Paramètres du projet"
2. Faites défiler jusqu'à "Vos applications"
3. Cliquez sur l'icône Web `</>`
4. Nommez votre app (ex: shopchoc-web)
5. Copiez les valeurs de `firebaseConfig`

### 1.6 Obtenir la clé privée (Backend)

1. Dans "Paramètres du projet" > "Comptes de service"
2. Cliquez sur "Générer une nouvelle clé privée"
3. Téléchargez le fichier JSON
4. Gardez ce fichier en sécurité (ne le commitez JAMAIS !)

## 💳 Étape 2 : Configuration Stripe

### 2.1 Créer un compte Stripe

1. Allez sur [Stripe](https://stripe.com/)
2. Créez un compte
3. Activez le mode Test

### 2.2 Obtenir les clés API

1. Dans le dashboard Stripe, cliquez sur "Développeurs" > "Clés API"
2. Copiez la "Clé publiable" (pk_test_...)
3. Copiez la "Clé secrète" (sk_test_...)
4. **Important** : Utilisez les clés de TEST pour le développement

## 💻 Étape 3 : Installation du projet

### 3.1 Cloner le repository

```bash
git clone https://github.com/votre-username/ShopChoc.git
cd ShopChoc
```

### 3.2 Configuration Backend

```bash
cd backend
npm install
```

Créez un fichier `.env` dans le dossier `backend/` :

```env
PORT=5000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=votre-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nCopiez la clé privée du fichier JSON téléchargé\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@votre-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=votre-project.appspot.com

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Note** : Pour `FIREBASE_PRIVATE_KEY`, ouvrez le fichier JSON téléchargé et copiez la valeur de `private_key`. Assurez-vous de garder les guillemets et les `\n`.

### 3.3 Configuration Frontend

```bash
cd ../frontend
npm install
```

Créez un fichier `.env` dans le dossier `frontend/` :

```env
# Firebase Configuration (copiez depuis firebaseConfig)
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre-project-id
VITE_FIREBASE_STORAGE_BUCKET=votre-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique

# API URL
VITE_API_URL=http://localhost:5000/api
```

## 🔒 Étape 4 : Configurer les règles de sécurité Firebase

### 4.1 Règles Firestore

1. Allez dans Firebase Console > Firestore Database > Règles
2. Remplacez le contenu par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Transactions collection
    match /transactions/{transactionId} {
      allow read: if request.auth != null && 
        (resource.data.buyerId == request.auth.uid || 
         resource.data.sellerId == request.auth.uid);
      allow create: if request.auth != null;
    }
  }
}
```

3. Cliquez sur "Publier"

### 4.2 Règles Storage

1. Allez dans Firebase Console > Storage > Règles
2. Remplacez le contenu par :

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

3. Cliquez sur "Publier"

## 🚀 Étape 5 : Démarrer l'application

### 5.1 Démarrer le Backend

Ouvrez un terminal :

```bash
cd backend
npm run dev
```

Vous devriez voir :
```
🚀 Serveur ShopChoc démarré sur le port 5000
📍 Environnement: development
🌐 API disponible sur: http://localhost:5000/api
```

### 5.2 Démarrer le Frontend

Ouvrez un NOUVEAU terminal :

```bash
cd frontend
npm run dev
```

Vous devriez voir :
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 5.3 Accéder à l'application

Ouvrez votre navigateur et allez sur : **http://localhost:5173**

## ✅ Étape 6 : Tester l'application

### 6.1 Créer un compte

1. Cliquez sur "Inscription"
2. Remplissez le formulaire
3. Cliquez sur "S'inscrire"
4. Vous devriez être redirigé vers la page d'accueil

### 6.2 Publier un produit

1. Cliquez sur "Vendre"
2. Uploadez des images
3. Remplissez les informations
4. Cliquez sur "Publier l'article"

### 6.3 Tester un paiement

1. Cliquez sur un produit
2. Cliquez sur "Acheter maintenant"
3. Utilisez la carte de test Stripe :
   - Numéro : `4242 4242 4242 4242`
   - Date : n'importe quelle date future
   - CVC : n'importe quel 3 chiffres
   - Code postal : n'importe quel code

## 🐛 Dépannage

### Erreur "Firebase: Error (auth/...)"

- Vérifiez que l'authentification Email/Password est activée dans Firebase
- Vérifiez vos clés Firebase dans le fichier `.env`

### Erreur "Network Error"

- Vérifiez que le backend est bien démarré sur le port 5000
- Vérifiez que `VITE_API_URL` dans frontend/.env pointe vers `http://localhost:5000/api`

### Erreur lors de l'upload d'images

- Vérifiez que Storage est activé dans Firebase
- Vérifiez les règles Storage
- Vérifiez que `FIREBASE_STORAGE_BUCKET` est correct dans backend/.env

### Erreur Stripe

- Vérifiez que vous utilisez les clés de TEST (pk_test_ et sk_test_)
- Vérifiez que les clés sont correctes dans les fichiers .env

## 📚 Prochaines étapes

1. ✅ Personnaliser les couleurs dans `tailwind.config.js`
2. ✅ Ajouter votre logo
3. ✅ Configurer un nom de domaine
4. ✅ Déployer en production (voir README.md)
5. ✅ Configurer les webhooks Stripe pour la production

## 🆘 Besoin d'aide ?

- 📖 Consultez la [documentation Firebase](https://firebase.google.com/docs)
- 💳 Consultez la [documentation Stripe](https://stripe.com/docs)
- 🐛 Ouvrez une issue sur GitHub

---

**Félicitations ! 🎉** Votre plateforme ShopChoc est maintenant opérationnelle !
