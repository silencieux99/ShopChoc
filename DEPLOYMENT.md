# 🚀 Guide de Déploiement ShopChoc

Ce guide vous aide à déployer ShopChoc en production.

## 📋 Checklist avant déploiement

- [ ] Compte Firebase configuré en production
- [ ] Compte Stripe en mode Live
- [ ] Règles de sécurité Firebase configurées
- [ ] Variables d'environnement de production prêtes
- [ ] Tests effectués en local
- [ ] Nom de domaine configuré (optionnel)

## 🔥 Configuration Firebase Production

### 1. Créer un projet de production

1. Créez un nouveau projet Firebase pour la production
2. Activez Authentication, Firestore et Storage
3. Configurez les règles de sécurité (voir SETUP_GUIDE.md)

### 2. Configurer les quotas

1. Allez dans Firebase Console > Usage and billing
2. Passez au plan Blaze (pay-as-you-go) pour la production
3. Configurez des alertes de budget

### 3. Configurer les index Firestore

Créez les index nécessaires :

```javascript
// Index pour les produits
products:
  - userId (Ascending), createdAt (Descending)
  - category (Ascending), price (Ascending)
  - status (Ascending), createdAt (Descending)

// Index pour les transactions
transactions:
  - buyerId (Ascending), createdAt (Descending)
  - sellerId (Ascending), createdAt (Descending)
```

## 💳 Configuration Stripe Production

### 1. Activer le compte Live

1. Complétez les informations de votre entreprise
2. Activez votre compte Stripe
3. Récupérez les clés Live (pk_live_ et sk_live_)

### 2. Configurer les webhooks

1. Allez dans Stripe Dashboard > Développeurs > Webhooks
2. Ajoutez un endpoint : `https://votre-api.com/api/webhooks/stripe`
3. Sélectionnez les événements :
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

## 🌐 Déploiement Backend

### Option 1 : Railway

#### Installation

```bash
npm install -g @railway/cli
railway login
```

#### Déploiement

```bash
cd backend
railway init
railway up
```

#### Configuration

1. Ajoutez les variables d'environnement dans Railway Dashboard
2. Configurez le domaine personnalisé (optionnel)
3. Activez le monitoring

#### Variables d'environnement

```env
NODE_ENV=production
PORT=5000
FIREBASE_PROJECT_ID=votre-project-prod
FIREBASE_PRIVATE_KEY="..."
FIREBASE_CLIENT_EMAIL=...
FIREBASE_STORAGE_BUCKET=...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
FRONTEND_URL=https://votre-frontend.com
```

### Option 2 : Render

#### Configuration

1. Créez un compte sur [Render](https://render.com)
2. Connectez votre repository GitHub
3. Créez un nouveau Web Service

#### Settings

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: Node
- **Plan**: Starter (gratuit) ou Pro

#### Variables d'environnement

Ajoutez les mêmes variables que Railway dans l'onglet Environment.

### Option 3 : Heroku

#### Installation

```bash
npm install -g heroku
heroku login
```

#### Déploiement

```bash
cd backend
heroku create shopchoc-api
git push heroku main
```

#### Configuration

```bash
heroku config:set NODE_ENV=production
heroku config:set FIREBASE_PROJECT_ID=...
# Ajoutez toutes les autres variables
```

### Option 4 : VPS (DigitalOcean, AWS, etc.)

#### Prérequis

- Serveur Ubuntu 22.04
- Node.js 18+ installé
- Nginx installé
- Certificat SSL (Let's Encrypt)

#### Installation

```bash
# Cloner le repo
git clone https://github.com/votre-username/ShopChoc.git
cd ShopChoc/backend

# Installer les dépendances
npm install --production

# Installer PM2
npm install -g pm2

# Créer le fichier .env
nano .env
# Coller les variables de production

# Démarrer avec PM2
pm2 start index.js --name shopchoc-api
pm2 save
pm2 startup
```

#### Configuration Nginx

```nginx
server {
    listen 80;
    server_name api.votre-domaine.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### SSL avec Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.votre-domaine.com
```

## 🎨 Déploiement Frontend

### Option 1 : Vercel (Recommandé)

#### Installation

```bash
npm install -g vercel
```

#### Déploiement

```bash
cd frontend
vercel
```

#### Configuration

1. Suivez les instructions
2. Ajoutez les variables d'environnement dans Vercel Dashboard
3. Configurez le domaine personnalisé

#### Variables d'environnement

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_API_URL=https://votre-api.com/api
```

### Option 2 : Netlify

#### Déploiement via GitHub

1. Connectez votre repo GitHub à Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Ajoutez les variables d'environnement

#### Déploiement via CLI

```bash
npm install -g netlify-cli
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

### Option 3 : Firebase Hosting

#### Installation

```bash
npm install -g firebase-tools
firebase login
```

#### Configuration

```bash
cd frontend
firebase init hosting
```

Sélectionnez :
- Public directory: `dist`
- Single-page app: `Yes`
- GitHub integration: `Optional`

#### Build et déploiement

```bash
npm run build
firebase deploy --only hosting
```

### Option 4 : Cloudflare Pages

1. Connectez votre repo GitHub
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Ajoutez les variables d'environnement

## 🔒 Sécurité en Production

### Backend

1. **Variables d'environnement**
   - Ne commitez JAMAIS les fichiers `.env`
   - Utilisez des secrets managers en production

2. **Rate Limiting**
   - Ajustez les limites selon votre trafic
   - Utilisez Redis pour le rate limiting distribué

3. **CORS**
   - Configurez CORS uniquement pour votre domaine frontend
   ```javascript
   app.use(cors({
     origin: 'https://votre-domaine.com',
     credentials: true
   }));
   ```

4. **Monitoring**
   - Configurez des alertes pour les erreurs
   - Utilisez Sentry ou LogRocket

### Frontend

1. **Variables d'environnement**
   - Préfixez avec `VITE_` pour les exposer
   - Ne stockez JAMAIS de secrets côté client

2. **Build optimisé**
   ```bash
   npm run build
   ```

3. **CDN**
   - Utilisez un CDN pour les assets statiques
   - Configurez le cache

## 📊 Monitoring

### Backend

#### Logs

```bash
# PM2
pm2 logs shopchoc-api

# Railway
railway logs

# Render
Voir les logs dans le dashboard
```

#### Monitoring

- **Uptime**: UptimeRobot, Pingdom
- **Errors**: Sentry
- **Performance**: New Relic, DataDog

### Frontend

- **Analytics**: Google Analytics, Plausible
- **Errors**: Sentry
- **Performance**: Lighthouse CI

## 🔄 CI/CD

### GitHub Actions

Créez `.github/workflows/deploy.yml` :

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 🧪 Tests avant production

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
npm run build
```

## 📝 Checklist finale

- [ ] Backend déployé et accessible
- [ ] Frontend déployé et accessible
- [ ] Variables d'environnement configurées
- [ ] Règles Firebase configurées
- [ ] Stripe en mode Live
- [ ] Webhooks Stripe configurés
- [ ] SSL/HTTPS activé
- [ ] Monitoring configuré
- [ ] Logs accessibles
- [ ] Backups configurés
- [ ] Tests de bout en bout effectués
- [ ] Documentation à jour

## 🆘 Dépannage

### Backend ne démarre pas

1. Vérifiez les logs
2. Vérifiez les variables d'environnement
3. Vérifiez la connexion Firebase

### Frontend ne se connecte pas au backend

1. Vérifiez `VITE_API_URL`
2. Vérifiez CORS sur le backend
3. Vérifiez les certificats SSL

### Erreurs Firebase

1. Vérifiez les règles de sécurité
2. Vérifiez les quotas
3. Vérifiez les index

## 📞 Support

Pour toute question, ouvrez une issue sur GitHub.

---

**Félicitations ! 🎉** Votre application est maintenant en production !
