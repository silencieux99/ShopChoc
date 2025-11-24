# Contribuer à ShopChoc

Merci de votre intérêt pour contribuer à ShopChoc ! 🎉

## Comment contribuer

### Signaler un bug

1. Vérifiez que le bug n'a pas déjà été signalé dans les [Issues](https://github.com/votre-username/ShopChoc/issues)
2. Ouvrez une nouvelle issue avec le template "Bug Report"
3. Décrivez le bug de manière détaillée :
   - Étapes pour reproduire
   - Comportement attendu
   - Comportement actuel
   - Screenshots si possible
   - Environnement (OS, navigateur, version Node.js)

### Proposer une nouvelle fonctionnalité

1. Ouvrez une issue avec le template "Feature Request"
2. Décrivez la fonctionnalité souhaitée
3. Expliquez pourquoi elle serait utile
4. Proposez une implémentation si possible

### Soumettre une Pull Request

1. **Fork** le projet
2. **Clone** votre fork :
   ```bash
   git clone https://github.com/votre-username/ShopChoc.git
   ```

3. Créez une **branche** pour votre fonctionnalité :
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```

4. **Commitez** vos changements :
   ```bash
   git commit -m "feat: ajout de ma nouvelle fonctionnalité"
   ```

5. **Push** vers votre fork :
   ```bash
   git push origin feature/ma-nouvelle-fonctionnalite
   ```

6. Ouvrez une **Pull Request** sur le repo principal

## Standards de code

### JavaScript/React

- Utilisez ES6+ syntax
- Utilisez des functional components avec hooks
- Nommage : camelCase pour les variables, PascalCase pour les composants
- Ajoutez des commentaires pour le code complexe
- Utilisez ESLint pour le linting

### Style

- Utilisez TailwindCSS pour le styling
- Suivez le design system existant
- Assurez-vous que l'UI est responsive

### Git Commit Messages

Suivez la convention [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `docs:` documentation
- `style:` formatage, point-virgules manquants, etc.
- `refactor:` refactorisation du code
- `test:` ajout de tests
- `chore:` maintenance

Exemples :
```
feat: ajout du système de notation des vendeurs
fix: correction du bug d'upload d'images
docs: mise à jour du README avec les nouvelles instructions
```

## Structure du code

### Backend

```
backend/
├── config/          # Configuration (Firebase, etc.)
├── controllers/     # Logique métier
├── middleware/      # Middleware Express
├── routes/          # Routes API
└── utils/           # Fonctions utilitaires
```

### Frontend

```
frontend/src/
├── components/      # Composants réutilisables
├── pages/          # Pages de l'application
├── services/       # Services API
├── store/          # State management (Zustand)
└── config/         # Configuration
```

## Tests

Avant de soumettre une PR :

1. Testez votre code localement
2. Vérifiez qu'il n'y a pas d'erreurs dans la console
3. Testez sur différents navigateurs si possible
4. Vérifiez la responsivité

## Questions ?

N'hésitez pas à ouvrir une issue pour poser vos questions !

## Code de conduite

- Soyez respectueux envers les autres contributeurs
- Acceptez les critiques constructives
- Concentrez-vous sur ce qui est le mieux pour la communauté

Merci de contribuer à ShopChoc ! 🚀
