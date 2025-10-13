# 🚀 Démarrage Rapide

Guide express pour démarrer le projet en local.

## 1. Installation

```bash
# Cloner le projet
git clone <votre-repo>
cd luzartwork

# Installer toutes les dépendances
npm run install:all
```

## 2. Configuration

### Backend

Créer `backend/.env`:
```env
PORT=3000
MONGODB_URI=mongodb+srv://votre_username:votre_password@cluster0.xxxxx.mongodb.net/luzartwork?retryWrites=true&w=majority
JWT_SECRET=mon_secret_jwt_super_securise
FRONTEND_URL=http://localhost:4200
```

**⚠️ Important**: MongoDB Atlas est **obligatoire**. Pas de MongoDB local dans ce projet.

## 3. Configurer MongoDB Atlas

**Cette étape est OBLIGATOIRE** :

1. Créer un compte gratuit sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Créer un cluster (choisir l'option M0 gratuite)
3. Créer un utilisateur :
   - Database Access → Add New Database User
   - Notez le nom d'utilisateur et le mot de passe
4. Autoriser les connexions :
   - Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
5. Obtenir l'URL de connexion :
   - Cluster → Connect → Connect your application
   - Copier l'URL et remplacer `<password>` par votre mot de passe
   - Mettre à jour `MONGODB_URI` dans `backend/.env`

## 4. Créer un administrateur

```bash
cd backend
npm run create-admin
```

Suivez les instructions pour créer votre compte admin.

## 5. Lancer l'application

### Option A : Tout en même temps (recommandé)
```bash
# À la racine du projet
npm run dev
```

Cela démarre :
- Backend sur `http://localhost:3000`
- Frontend sur `http://localhost:4200`

### Option B : Séparément

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
ng serve
```

## 6. Utilisation

Le portfolio est une **seule page** avec navigation fluide :

1. **Portfolio complet** : `http://localhost:4200`
   - Accueil (Hero)
   - À Propos (Présentation)
   - Galerie (Œuvres)
   - Contact (Formulaire)
2. **Connexion admin** : `http://localhost:4200/login` (bouton dans la navbar)
3. **Dashboard admin** : `http://localhost:4200/admin` (après connexion)
4. **API** : `http://localhost:3000/api`

## 🎨 Ajouter votre première œuvre

1. Connectez-vous avec vos identifiants admin
2. Cliquez sur "+ Ajouter une œuvre"
3. Remplissez le formulaire
4. Uploadez une image
5. Cliquez sur "Créer"

## 📝 Notes

- Le portfolio affiche **toutes les sections sur une seule page** avec navigation smooth scroll
- Les sections sont : Accueil (Hero), À Propos, Galerie, Contact
- Les images uploadées sont stockées dans `backend/uploads/`
- **MongoDB Atlas cloud** stocke toutes les données (pas de base locale)
- Le token JWT est valide pendant 24h

## 🔧 Résolution de problèmes

### Port déjà utilisé
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### MongoDB ne démarre pas
- Ce projet utilise **MongoDB Atlas cloud uniquement**
- Pas besoin d'installer MongoDB localement
- Suivez l'étape 3 pour configurer Atlas

### Erreur CORS
- Vérifiez que `FRONTEND_URL` dans `.env` correspond à votre frontend
- Par défaut : `http://localhost:4200`

## 📚 Documentation complète

- [README.md](./README.md) - Documentation complète
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guide de déploiement

Bon développement ! 🎨
