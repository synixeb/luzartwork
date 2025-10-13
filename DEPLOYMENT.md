# Guide de Déploiement sur Hostinger

Ce guide vous explique comment déployer votre site portfolio sur Hostinger.

## 📋 Prérequis

1. Un compte Hostinger avec hébergement web
2. Accès FTP à votre hébergement
3. Un compte MongoDB Atlas (gratuit)
4. Un repository GitHub

## 🗄️ Étape 1 : Configurer MongoDB Atlas

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Créez un nouveau cluster (choisir l'option gratuite)
3. Créez un utilisateur de base de données :
   - Database Access → Add New Database User
   - Notez le nom d'utilisateur et le mot de passe
4. Autorisez les connexions :
   - Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
5. Obtenez l'URL de connexion :
   - Cluster → Connect → Connect your application
   - Copiez l'URL de connexion
   - Remplacez `<password>` par votre mot de passe

Exemple d'URL :
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/luzartwork?retryWrites=true&w=majority
```

## 🔑 Étape 2 : Configurer les Secrets GitHub

1. Allez sur votre repository GitHub
2. Settings → Secrets and variables → Actions
3. Cliquez sur "New repository secret"
4. Ajoutez les secrets suivants :

### FTP_SERVER
- Votre serveur FTP Hostinger (ex: `ftp.votredomaine.com`)
- Trouvable dans le panneau Hostinger → Files → FTP Accounts

### FTP_USERNAME
- Votre nom d'utilisateur FTP
- Généralement votre email ou un nom personnalisé

### FTP_PASSWORD
- Votre mot de passe FTP

## ⚙️ Étape 3 : Configurer le Backend sur Hostinger

### 3.1 Créer le fichier .env sur le serveur

Connectez-vous via FTP et créez un fichier `.env` dans le dossier `/api/` :

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/luzartwork?retryWrites=true&w=majority
JWT_SECRET=votre_secret_jwt_unique_et_securise_changez_moi
FRONTEND_URL=https://votre-domaine.com
```

**Important** : 
- Changez `JWT_SECRET` pour une valeur unique et complexe
- Remplacez l'URL MongoDB par celle obtenue à l'étape 1
- Remplacez `FRONTEND_URL` par votre domaine

### 3.2 Installer les dépendances Node.js

Hostinger supporte Node.js. Vous devez :

1. Accéder au panneau Hostinger
2. Aller dans "Advanced → Node.js"
3. Créer une nouvelle application Node.js :
   - **Application root** : `/api`
   - **Application startup file** : `server.js`
   - **Node.js version** : 18.x ou supérieur
4. Cliquer sur "Create"

### 3.3 Configurer le fichier .htaccess (si nécessaire)

Pour que les routes fonctionnent correctement, créez un fichier `.htaccess` dans `/public_html/` :

```apache
# Enable CORS
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>

# Redirect API calls to Node.js
RewriteEngine On
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]

# Angular routing - redirect all to index.html
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```

## 🚀 Étape 4 : Déployer

### 4.1 Mettre à jour l'URL de l'API

Dans `frontend/src/environments/environment.prod.ts` :

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://votre-domaine.com/api'
};
```

### 4.2 Commiter et pusher

```bash
git add .
git commit -m "Configure production environment"
git push origin main
```

GitHub Actions va automatiquement :
1. Build le frontend Angular
2. Déployer le frontend via FTP
3. Déployer le backend via FTP

### 4.3 Vérifier le déploiement

1. Visitez `https://votre-domaine.com`
2. Vérifiez que la galerie s'affiche (même vide)
3. Testez la connexion admin sur `/login`

## 👤 Étape 5 : Créer le premier compte admin

Une fois déployé, créez votre compte admin :

```bash
curl -X POST https://votre-domaine.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "votre@email.com",
    "password": "VotreMotDePasseSecurise123!"
  }'
```

Ou utilisez Postman/Thunder Client avec ces paramètres.

**⚠️ Sécurité** : Après avoir créé le compte admin, vous devriez protéger la route de registration en modifiant `backend/routes/auth.js`.

## 🔧 Dépannage

### Le site affiche une erreur 404
- Vérifiez le fichier `.htaccess`
- Assurez-vous que les fichiers sont dans `/public_html/`

### L'API ne répond pas
- Vérifiez que Node.js est bien configuré dans le panneau Hostinger
- Vérifiez les logs Node.js dans le panneau
- Testez l'API directement : `https://votre-domaine.com/api/health`

### Erreur de connexion MongoDB
- Vérifiez l'URL de connexion MongoDB
- Assurez-vous que l'IP est autorisée (0.0.0.0/0)
- Vérifiez que le mot de passe est correct (attention aux caractères spéciaux)

### Les images ne s'uploadent pas
- Vérifiez les permissions du dossier `/api/uploads/` (chmod 755)
- Vérifiez la limite de taille dans PHP et Node.js

## 📝 Notes importantes

1. **Sauvegardes** : Configurez des sauvegardes régulières de votre base de données MongoDB Atlas
2. **SSL/HTTPS** : Activez le certificat SSL gratuit de Hostinger pour sécuriser votre site
3. **Performance** : Considérez un CDN pour les images si vous avez beaucoup de visiteurs
4. **Monitoring** : Surveillez l'utilisation de votre base de données MongoDB Atlas

## 🎨 Personnalisation

### Changer les couleurs
Modifiez les gradients dans les fichiers SCSS :
- `frontend/src/app/components/gallery/gallery.component.scss`
- `frontend/src/app/components/login/login.component.scss`

### Ajouter des catégories
Modifiez le modèle dans :
- `backend/models/Artwork.js`
- `frontend/src/app/models/artwork.model.ts`
- `frontend/src/app/components/admin-dashboard/admin-dashboard.component.ts`

## 📞 Support

Pour toute question :
- Documentation Hostinger : https://support.hostinger.com
- Documentation MongoDB Atlas : https://docs.atlas.mongodb.com
- Documentation Angular : https://angular.dev

Bon déploiement ! 🚀
