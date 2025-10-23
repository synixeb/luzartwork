# 🎨 Luzartwork Backend API

Backend Express.js pour le portfolio d'artiste Luzartwork avec architecture MVC professionnelle.

## 📋 Vue d'Ensemble

- **Framework** : Express.js 4.18+
- **Base de données** : MongoDB Atlas (cloud)
- **Architecture** : MVC (Model-View-Controller)
- **Authentification** : JWT avec expiration 24h
- **Upload** : Multer (images, 5MB max)
- **Validation** : express-validator centralisé

## 🚀 Démarrage Rapide

### Installation
```bash
cd backend
npm install
```

### Configuration
Créer un fichier `.env` :
```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/luzartwork
JWT_SECRET=your_secret_key_change_in_production
FRONTEND_URL=http://localhost:4200
NODE_ENV=development
```

### Démarrer le Serveur

```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

### Créer un Compte Admin
```bash
npm run create-admin
```

## 📡 Routes API

### Publiques

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/health` | GET | Santé de l'API |
| `/api/artworks` | GET | Liste des œuvres |
| `/api/artworks/:id` | GET | Détails d'une œuvre |
| `/api/artist-info` | GET | Info artiste |
| `/api/contact-info` | GET | Info contact |

### Protégées (JWT requis)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/auth/me` | GET | Profil utilisateur |
| `/api/auth/update-username` | PUT | Changer l'identifiant |
| `/api/auth/update-password` | PUT | Changer le mot de passe |
| `/api/artworks` | POST | Créer une œuvre |
| `/api/artworks/:id` | PUT | Modifier une œuvre |
| `/api/artworks/:id` | DELETE | Supprimer une œuvre |
| `/api/artist-info` | PUT | Modifier info artiste |
| `/api/contact-info` | PUT | Modifier info contact |

### Authentification

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/auth/login` | POST | Connexion |
| `/api/auth/register` | POST | Créer admin (à protéger) |

## 🗂️ Structure

```
backend/
├── config/
│   └── multer.js              # Configuration upload
├── controllers/
│   ├── artworkController.js   # Logique œuvres
│   ├── authController.js      # Logique auth
│   ├── artistInfoController.js
│   └── contactInfoController.js
├── middleware/
│   ├── auth.js               # JWT verification
│   ├── errorHandler.js       # Gestion erreurs
│   └── validation.js         # Validateurs
├── models/
│   ├── Artwork.js
│   ├── User.js
│   ├── ArtistInfo.js
│   └── ContactInfo.js
├── routes/
│   ├── artworks.js
│   ├── auth.js
│   ├── artistInfo.js
│   └── contactInfo.js
├── uploads/                  # Images uploadées
├── server.js                 # Point d'entrée
├── create-admin.js           # Script CLI
└── test-api.sh              # Tests automatiques
```

## 🧪 Tests

### Test Manuel
```bash
# Health check
curl http://localhost:3000/api/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Password1"}'

# Get artworks
curl http://localhost:3000/api/artworks
```

### Test Automatique
```bash
bash test-api.sh
```

Tests 12 routes incluant :
- Routes publiques
- Authentification
- Routes protégées
- Gestion erreurs (404, 401)

## 📚 Documentation

- **[BACKEND_ARCHITECTURE.md](../BACKEND_ARCHITECTURE.md)** - Architecture complète
- **[BACKEND_REFACTORING.md](../BACKEND_REFACTORING.md)** - Changements apportés
- **[BACKEND_CONVERSION_COMPLETE.md](../BACKEND_CONVERSION_COMPLETE.md)** - Résumé conversion

## 🔐 Sécurité

- ✅ Hachage mots de passe (bcryptjs)
- ✅ Tokens JWT avec expiration
- ✅ Validation des entrées
- ✅ Protection CORS
- ✅ Limitation taille fichiers
- ✅ Filtrage types de fichiers

## 🛠️ Dépendances Principales

```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "multer": "^1.4.5-lts.1",
  "express-validator": "^7.0.1",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
```

## 📦 Scripts NPM

```bash
npm start           # Démarrer en production
npm run dev         # Démarrer avec nodemon
npm run create-admin # Créer compte admin
```

## 🌐 Déploiement

Le backend est configuré pour déploiement sur **Hostinger** via GitHub Actions.

Voir **[DEPLOYMENT.md](../DEPLOYMENT.md)** pour les instructions complètes.

## 🤝 Contribution

1. Créer une branche feature
2. Suivre l'architecture MVC
3. Ajouter validation dans `middleware/validation.js`
4. Créer contrôleur dans `controllers/`
5. Créer routes dans `routes/`
6. Tester avec `test-api.sh`

## 📝 Conventions

- **Routes** : kebab-case (`artist-info`)
- **Contrôleurs** : camelCase (`getArtistInfo`)
- **Modèles** : PascalCase (`ArtistInfo`)
- **Variables** : camelCase (`artworkData`)

## 🐛 Dépannage

### MongoDB ne se connecte pas
- Vérifier `MONGODB_URI` dans `.env`
- Autoriser IP dans MongoDB Atlas (0.0.0.0/0)
- Vérifier identifiants

### JWT invalide
- Vérifier `JWT_SECRET` dans `.env`
- Token expiré ? Reconnecter

### Upload échoue
- Vérifier dossier `uploads/` existe
- Permissions 755 sur `uploads/`
- Taille fichier < 5MB

## 📞 Support

Pour questions ou problèmes :
- Consulter la documentation
- Vérifier les logs serveur
- Tester avec `test-api.sh`

---

**Version** : 2.0.0  
**Framework** : Express.js  
**Pattern** : MVC  
**Statut** : ✅ Production Ready
