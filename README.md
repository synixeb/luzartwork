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

## 📤 Déploiement sur Hostinger

### 1. Configuration des Secrets GitHub

Dans votre repository GitHub, allez dans `Settings` > `Secrets and variables` > `Actions` et ajoutez:

- `FTP_SERVER`: L'adresse FTP de votre hébergement Hostinger
- `FTP_USERNAME`: Votre nom d'utilisateur FTP
- `FTP_PASSWORD`: Votre mot de passe FTP

### 2. Configuration Hostinger

1. **Base de données MongoDB**: 
   - **MongoDB Atlas est déjà utilisé** - configuration terminée lors du développement
   - Assurez-vous que l'URL de connexion dans `.env` pointe vers votre cluster Atlas de production

2. **Variables d'environnement backend**:
   - Le fichier `.env` sur le serveur doit contenir:
     - `MONGODB_URI` : URL MongoDB Atlas (même qu'en développement ou cluster séparé)
     - `JWT_SECRET` : **Changez pour une valeur sécurisée unique**
     - `FRONTEND_URL` : URL de votre domaine de production

3. **Déploiement**:
   - Push sur la branche `main`
   - GitHub Actions construira et déploiera automatiquement

### 3. Structure de déploiement

```
/public_html/          (Frontend Angular buildé)
/api/                  (Backend Node.js)
```

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
