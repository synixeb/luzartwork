# 🚀 Commandes Utiles

## Installation et Configuration

```bash
# Installer toutes les dépendances (racine + frontend + backend)
npm run install:all

# Installer uniquement le frontend
cd frontend && npm install

# Installer uniquement le backend
cd backend && npm install
```

## Développement

```bash
# Démarrer tout (frontend + backend en même temps)
npm run dev

# Démarrer uniquement le frontend (port 4200)
cd frontend && ng serve

# Démarrer uniquement le backend (port 3000)
cd backend && npm run dev

# Créer un compte administrateur
cd backend && npm run create-admin
```

## Build et Production

```bash
# Build du frontend pour la production
cd frontend && ng build --configuration=production

# Build du frontend en mode development
cd frontend && ng build

# Démarrer le backend en production
cd backend && npm start
```

## Base de Données

```bash
# Démarrer MongoDB (si installé localement)
mongod

# Se connecter à MongoDB
mongosh

# Voir toutes les bases de données
show dbs

# Utiliser la base luzartwork
use luzartwork

# Voir toutes les collections
show collections

# Afficher tous les utilisateurs
db.users.find().pretty()

# Afficher toutes les œuvres
db.artworks.find().pretty()

# Supprimer un utilisateur
db.users.deleteOne({ username: "nom_utilisateur" })

# Supprimer toutes les œuvres (attention !)
db.artworks.deleteMany({})
```

## Git

```bash
# Initialiser le dépôt
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit: Portfolio artiste complet"

# Ajouter l'origine
git remote add origin https://github.com/votre-username/luzartwork.git

# Pousser sur GitHub
git push -u origin main

# Créer une nouvelle branche
git checkout -b feature/nom-fonctionnalite

# Voir les changements
git status

# Voir l'historique
git log --oneline
```

## Testing et Debugging

```bash
# Tester l'API (health check)
curl http://localhost:3000/api/health

# Tester la création d'un admin
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"password123"}'

# Tester la connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Lister toutes les œuvres
curl http://localhost:3000/api/artworks

# Voir les logs du backend en temps réel
cd backend && npm run dev

# Checker la version de Node.js
node --version

# Checker la version de npm
npm --version

# Checker la version d'Angular CLI
ng version
```

## Nettoyage

```bash
# Nettoyer node_modules et réinstaller (frontend)
cd frontend
rm -rf node_modules package-lock.json
npm install

# Nettoyer node_modules et réinstaller (backend)
cd backend
rm -rf node_modules package-lock.json
npm install

# Nettoyer le cache npm
npm cache clean --force

# Nettoyer le build Angular
cd frontend
rm -rf dist .angular
```

## Déploiement

```bash
# Vérifier que le build fonctionne
cd frontend && ng build --configuration=production

# Vérifier les variables d'environnement
cd backend && cat .env

# Tester le déploiement localement
# 1. Build le frontend
cd frontend && ng build --configuration=production

# 2. Copier les fichiers dans un dossier de test
mkdir -p ../deploy-test
cp -r dist/frontend/browser/* ../deploy-test/

# 3. Servir avec un serveur simple
cd ../deploy-test
npx http-server -p 8080
```

## Utilitaires MongoDB Atlas

```bash
# Se connecter à MongoDB Atlas
mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net/luzartwork" --username votre_username

# Backup de la base de données (mongodump)
mongodump --uri="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/luzartwork"

# Restore de la base de données (mongorestore)
mongorestore --uri="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/luzartwork" dump/
```

## Performance et Monitoring

```bash
# Analyser la taille du bundle Angular
cd frontend
ng build --configuration=production --stats-json
npx webpack-bundle-analyzer dist/frontend/stats.json

# Vérifier les dépendances obsolètes
npm outdated

# Mettre à jour les dépendances (attention, peut casser)
npm update

# Auditer les vulnérabilités de sécurité
npm audit

# Réparer les vulnérabilités automatiquement
npm audit fix
```

## Docker (optionnel)

```bash
# Créer une image Docker pour le backend
cd backend
docker build -t luzartwork-backend .

# Créer une image Docker pour le frontend
cd frontend
docker build -t luzartwork-frontend .

# Démarrer avec Docker Compose
docker-compose up -d

# Arrêter les conteneurs
docker-compose down

# Voir les logs
docker-compose logs -f
```

## Raccourcis Pratiques

```bash
# Ouvrir VS Code dans le projet
code .

# Ouvrir le projet dans le navigateur
# Windows
start http://localhost:4200

# macOS
open http://localhost:4200

# Linux
xdg-open http://localhost:4200

# Trouver le processus utilisant un port (Windows)
netstat -ano | findstr :3000

# Trouver le processus utilisant un port (Linux/Mac)
lsof -ti:3000

# Tuer un processus (Windows)
taskkill /PID <PID> /F

# Tuer un processus (Linux/Mac)
kill -9 <PID>
```

## Variables d'Environnement

### Development (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/luzartwork
JWT_SECRET=dev_secret_change_in_production
FRONTEND_URL=http://localhost:4200
```

### Production (.env)
```env
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/luzartwork
JWT_SECRET=votre_secret_production_tres_securise
FRONTEND_URL=https://votre-domaine.com
```

## Dépannage Rapide

### "ng: command not found"
```bash
npm install -g @angular/cli
```

### "mongod: command not found"
Installez MongoDB ou utilisez MongoDB Atlas

### Port 3000 ou 4200 déjà utilisé
```bash
# Tuer le processus
lsof -ti:3000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3000   # Windows (puis taskkill)
```

### Erreur de connexion MongoDB
Vérifiez :
1. MongoDB est démarré (`mongod`)
2. L'URL dans `.env` est correcte
3. Le pare-feu autorise la connexion

### CORS Error
Vérifiez que `FRONTEND_URL` dans `.env` correspond à votre frontend

---

📚 **Documentation complète** : [README.md](./README.md)  
🚀 **Démarrage rapide** : [QUICKSTART.md](./QUICKSTART.md)  
☁️ **Déploiement** : [DEPLOYMENT.md](./DEPLOYMENT.md)
