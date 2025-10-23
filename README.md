# 🎨 Luzartwork - Portfolio d'Artiste

> Portfolio d'artiste en une seule page avec système d'administration et déploiement automatique sur Hostinger.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-19-red)](https://angular.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/cloud/atlas)

## 🎨 Fonctionnalités

- ✨ **Portfolio en une seule page** avec navigation fluide (Hero, À Propos, Galerie, Contact)
- 🔐 Système d'authentification admin sécurisé avec JWT
- 📝 Tableau de bord administrateur pour gérer les œuvres
- 🖼️ Upload d'images avec prévisualisation
- 📱 Design responsive et moderne avec couleurs vert/bleu
- 🚀 Déploiement automatique via GitHub Actions
- ☁️ Base de données MongoDB Atlas cloud

## 🏗️ Architecture

### Frontend (Angular)
- **Framework**: Angular 19 (standalone components)
- **Styling**: SCSS avec design gradient vert/bleu
- **State Management**: Signals (nouvelle API Angular)
- **Navigation**: Smooth scroll vers les sections
- **Routing**: Angular Router avec guards
- **HTTP**: HttpClient avec intercepteurs JWT

### Backend (Node.js + Express)
- **Framework**: Express.js
- **Base de données**: MongoDB Atlas (cloud)
- **Authentification**: JWT (JSON Web Tokens)
- **Upload de fichiers**: Multer
- **Validation**: express-validator

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- **Compte MongoDB Atlas** (gratuit) - [Créer un compte](https://www.mongodb.com/cloud/atlas/)
- npm ou yarn
- Git

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd luzartwork
```

### 2. Configuration du Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` avec les valeurs suivantes:

```env
PORT=3000
MONGODB_URI=mongodb+srv://votre_username:votre_password@cluster0.xxxxx.mongodb.net/luzartwork?retryWrites=true&w=majority
JWT_SECRET=votre_secret_jwt_tres_securise
FRONTEND_URL=http://localhost:4200
```

**Configuration MongoDB Atlas** (obligatoire):
1. Créez un compte gratuit sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/)
2. Créez un cluster (M0 gratuit)
3. Créez un utilisateur de base de données dans "Database Access"
4. Autorisez l'accès IP (0.0.0.0/0) dans "Network Access"
5. Obtenez l'URL de connexion depuis "Connect" → "Connect your application"
6. Copiez cette URL dans `MONGODB_URI` dans le fichier `.env`

### 3. Configuration du Frontend

```bash
cd frontend
npm install
```

Mettre à jour `src/environments/environment.prod.ts` avec l'URL de production:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://votre-domaine.com/api'
};
```

## 💻 Développement

### Démarrer le Backend

```bash
cd backend
npm run dev
```

Le backend sera accessible sur `http://localhost:3000`

**Note**: Assurez-vous que MongoDB Atlas est configuré dans le `.env`

### Démarrer le Frontend

```bash
cd frontend
ng serve
```

Le frontend sera accessible sur `http://localhost:4200`

## 👤 Créer le premier compte Admin

**Important**: Utilisez le script interactif fourni:

```bash
cd backend
npm run create-admin
```

Suivez les instructions pour créer votre compte administrateur.

**⚠️ Important**: Après la création du premier admin, vous devriez protéger la route `/register` en production.

## 🎨 Utilisation

1. Visitez `http://localhost:4200` pour voir le portfolio complet
   - Section **Accueil** (Hero)
   - Section **À Propos** (Présentation de l'artiste)
   - Section **Galerie** (Œuvres)
   - Section **Contact** (Formulaire de contact)
2. Cliquez sur "Connexion" dans la navbar ou allez sur `/login`
3. Connectez-vous avec vos identifiants admin
4. Ajoutez, modifiez ou supprimez des œuvres via le tableau de bord (`/admin`)

## 📤 Déploiement sur Hostinger (synix.fr)

### 🚀 Déploiement Rapide

Le site est configuré pour un déploiement automatique sur **https://synix.fr** via GitHub Actions.

**Guides disponibles** :
- 📘 **[Guide Déploiement Rapide](QUICKSTART_DEPLOYMENT.md)** - Déploiement en 5 minutes
- 📗 **[Guide Complet Hostinger](HOSTINGER_DEPLOYMENT.md)** - Documentation détaillée
- 📋 **[Checklist Déploiement](DEPLOYMENT_CHECKLIST.md)** - Liste de vérification complète
- 🔐 **[Configuration Secrets](.github/SECRETS.md)** - Guide des secrets GitHub

### 1️⃣ Configuration des Secrets GitHub (une seule fois)

Dans votre repository GitHub : `Settings` → `Secrets and variables` → `Actions`

Ajouter ces 5 secrets :

| Secret | Description | Où l'obtenir |
|--------|-------------|--------------|
| `FTP_SERVER` | Serveur FTP Hostinger | hPanel → Files → FTP Accounts |
| `FTP_USERNAME` | Utilisateur FTP | hPanel → Files → FTP Accounts |
| `FTP_PASSWORD` | Mot de passe FTP | hPanel → Files → FTP Accounts |
| `MONGODB_URI` | URI MongoDB Atlas | Déjà configuré (voir `.env`) |
| `JWT_SECRET` | Secret JWT production | Générer avec `openssl rand -base64 64` |

**⚠️ Important** : Voir le [guide des secrets](.github/SECRETS.md) pour les détails complets.

### 2️⃣ Configuration Hostinger (une seule fois)

1. **Activer SSL/HTTPS** :
   - hPanel → Advanced → SSL → Activer pour synix.fr

2. **Configurer Node.js Application** :
   - hPanel → Advanced → Node.js → Create Application
   - Node version : `20.x`
   - Application root : `/api`
   - Application URL : `https://synix.fr/api`
   - Startup file : `server.js`

3. **Whitelist MongoDB Atlas** :
   - MongoDB Atlas → Network Access → Add IP `0.0.0.0/0`

### 3️⃣ Déployer

```bash
# Vérifier que tout est prêt (optionnel)
./check-deploy.bat    # Windows
./check-deploy.sh     # Linux/Mac

# Déployer en production
git checkout main
git merge develop
git push origin main
```

**GitHub Actions** déploie automatiquement sur https://synix.fr ! 🚀

### 4️⃣ Créer un Admin (première fois)

Via SSH Hostinger :
```bash
ssh votre_user@synix.fr
cd ~/api
node create-admin.js
```

### 5️⃣ Vérifier le Déploiement

- ✅ Frontend : https://synix.fr
- ✅ API Health : https://synix.fr/api/health
- ✅ Login Admin : https://synix.fr/login
- ✅ Dashboard : https://synix.fr/admin

### Structure de Déploiement Hostinger

```
/home/uXXXXXXXX/
├── public_html/          # Frontend Angular (build production)
│   ├── index.html
│   ├── *.js, *.css
│   └── .htaccess        # Configuration Apache (routing + proxy)
└── api/                 # Backend Node.js
    ├── server.js
    ├── .env            # Créé par GitHub Actions
    └── uploads/        # Images uploadées
```

### 🐛 Dépannage

Voir les guides détaillés :
- [HOSTINGER_DEPLOYMENT.md](HOSTINGER_DEPLOYMENT.md) - Dépannage complet
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Résolution de problèmes

**Problèmes courants** :
- **502 Bad Gateway** : Redémarrer Node.js dans hPanel
- **404 Frontend** : Vérifier `.htaccess` déployé
- **MongoDB Error** : Vérifier IP whitelistée sur Atlas

## 📁 Structure du Projet

```
luzartwork/
├── frontend/                 # Application Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # Composants UI
│   │   │   ├── services/    # Services HTTP
│   │   │   ├── models/      # Modèles TypeScript
│   │   │   ├── guards/      # Route guards
│   │   │   └── interceptors/# HTTP intercepteurs
│   │   └── environments/    # Configuration environnement
│   └── package.json
├── backend/                 # API Node.js/Express
│   ├── models/             # Modèles Mongoose
│   ├── routes/             # Routes API
│   ├── middleware/         # Middlewares
│   ├── uploads/            # Images uploadées
│   └── server.js           # Point d'entrée
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD GitHub Actions
└── README.md
```

## 🔒 Sécurité

- Les mots de passe sont hashés avec bcrypt
- Authentification JWT avec expiration
- Protection CORS configurée
- Validation des entrées avec express-validator
- Upload de fichiers sécurisé avec restrictions de type/taille

## 🛠️ Technologies Utilisées

### Frontend
- Angular 19
- TypeScript
- SCSS
- RxJS
- Signals

### Backend
- Node.js
- Express.js
- MongoDB avec Mongoose
- JWT pour l'authentification
- Multer pour l'upload de fichiers
- bcryptjs pour le hashage de mots de passe

### DevOps
- GitHub Actions
- FTP Deployment

## � Pages du Site

### Portfolio Public (/)
Une seule page avec navigation smooth scroll:
- **Accueil** (#accueil) - Hero avec titre et appel à l'action
- **À Propos** (#presentation) - Biographie, photo, parcours de l'artiste
- **Galerie** (#galerie) - Grille d'œuvres avec modal de détails
- **Contact** (#contact) - Formulaire de contact et informations

### Pages Admin
- **/login** - Page de connexion administrateur
- **/admin** - Tableau de bord protégé (CRUD des œuvres)

### Authentification
- `POST /api/auth/register` - Créer un compte admin
- `POST /api/auth/login` - Se connecter

### Œuvres (Artworks)
- `GET /api/artworks` - Récupérer toutes les œuvres (public)
- `GET /api/artworks/:id` - Récupérer une œuvre (public)
- `POST /api/artworks` - Créer une œuvre (admin)
- `PUT /api/artworks/:id` - Modifier une œuvre (admin)
- `DELETE /api/artworks/:id` - Supprimer une œuvre (admin)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou un pull request.

## 📄 Licence

MIT

## 👩‍💻 Auteur

Créé avec ❤️ pour les artistes
