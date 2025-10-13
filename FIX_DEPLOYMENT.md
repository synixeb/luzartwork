# 🔧 Correction du Problème de Déploiement

## Problème Identifié

Après déploiement via GitHub Actions :
- ❌ Frontend déployé dans `/public_html/public_html/` au lieu de `/public_html/`
- ❌ Backend dans `/public_html/api/` mais les appels API retournent 404
- ❌ Manque de configuration `.htaccess` pour gérer le routage Angular et le proxy vers Node.js

## Solutions Appliquées

### 1. ✅ Correction du Workflow GitHub Actions

**Fichier** : `.github/workflows/deploy.yml`

**Changements** :
- Frontend : déploiement vers `/public_html/` avec `dangerous-clean-slate: true` pour éviter les doublons
- Backend : déploiement vers `/public_html/api/` (au lieu de `/api/`)
- Exclusion du dossier `/api/` lors du déploiement du frontend

### 2. ✅ Ajout du fichier .htaccess

**Fichier** : `frontend/public/.htaccess`

**Fonctionnalités** :
- Redirection automatique vers HTTPS
- Proxy des requêtes `/api/*` vers Node.js (localhost:3000)
- Gestion du routage Angular (toutes les routes non-fichiers → index.html)
- Headers CORS pour les requêtes API
- Headers de sécurité
- Compression et cache pour les assets statiques

### 3. ✅ Configuration de l'URL de l'API

**Fichier** : `frontend/src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://VOTRE-DOMAINE.com/api'
};
```

**⚠️ ACTION REQUISE** : Remplacez `VOTRE-DOMAINE.com` par votre vrai nom de domaine Hostinger !

## Structure de Déploiement Finale

```
Hostinger
└── public_html/
    ├── index.html              # Angular app
    ├── .htaccess              # Configuration Apache
    ├── *.js, *.css            # Assets Angular
    └── api/                   # Backend Node.js
        ├── server.js
        ├── .env              # ⚠️ À créer manuellement
        ├── package.json
        ├── models/
        ├── routes/
        ├── middleware/
        └── uploads/
```

## Étapes pour Appliquer le Fix

### Étape 1 : Mettre à jour l'URL de production

```bash
# Dans frontend/src/environments/environment.prod.ts
# Remplacez "votre-domaine.com" par votre vrai domaine
```

### Étape 2 : Configurer le fichier .env sur le serveur

Connectez-vous via FTP à Hostinger et créez le fichier `/public_html/api/.env` :

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/luzartwork?retryWrites=true&w=majority
JWT_SECRET=votre_secret_jwt_unique_et_securise_changez_moi
FRONTEND_URL=https://votre-domaine.com
```

### Étape 3 : Configurer Node.js sur Hostinger

1. Panneau Hostinger → **Advanced** → **Node.js**
2. Créer une nouvelle application :
   - **Application root** : `/public_html/api`
   - **Application startup file** : `server.js`
   - **Node.js version** : 18.x ou supérieur
3. Cliquer sur **Create**

### Étape 4 : Déployer

```bash
# Commiter les changements
git add .
git commit -m "Fix deployment structure and add .htaccess configuration"

# Si vous êtes sur develop, merger vers main
git checkout main
git merge develop
git push origin main
```

GitHub Actions va automatiquement déployer avec la nouvelle configuration.

### Étape 5 : Vérifier

1. **Frontend** : `https://votre-domaine.com` → Doit afficher le portfolio
2. **API Health Check** : `https://votre-domaine.com/api/health` → Doit retourner `{"status":"OK"}`
3. **Login Admin** : `https://votre-domaine.com/login` → Doit afficher la page de connexion

## Dépannage

### Erreur 404 sur les routes Angular

**Cause** : `.htaccess` non pris en compte

**Solution** :
1. Vérifiez que le fichier `.htaccess` est bien présent dans `/public_html/`
2. Vérifiez que `mod_rewrite` est activé dans Apache
3. Contactez le support Hostinger pour activer `AllowOverride All`

### Erreur 404 sur les appels API

**Cause** : Node.js non démarré ou proxy mal configuré

**Solution** :
1. Vérifiez que Node.js est bien configuré dans le panneau Hostinger
2. Vérifiez les logs Node.js dans **Advanced** → **Node.js** → **View logs**
3. Testez directement : `http://localhost:3000/api/health` (depuis SSH)

### Erreur 502 Bad Gateway

**Cause** : Node.js non démarré

**Solution** :
1. Panneau Hostinger → **Node.js** → Redémarrer l'application
2. Vérifier les logs pour les erreurs de démarrage
3. Vérifier que le fichier `.env` est correctement configuré

### Images non chargées

**Cause** : Dossier `uploads/` manquant ou permissions incorrectes

**Solution** :
```bash
# Via SSH ou FTP
cd /public_html/api
mkdir -p uploads
chmod 755 uploads
```

## Configuration Apache Alternative (si .htaccess ne fonctionne pas)

Si Hostinger ne supporte pas `.htaccess`, vous pouvez configurer via le panneau Apache ou créer un `web.config` pour IIS.

Contactez le support Hostinger pour obtenir de l'aide sur la configuration Apache.

## Checklist de Déploiement

- [ ] URL de production mise à jour dans `environment.prod.ts`
- [ ] Secrets GitHub configurés (FTP_SERVER, FTP_USERNAME, FTP_PASSWORD)
- [ ] Fichier `.env` créé sur le serveur dans `/public_html/api/`
- [ ] Application Node.js configurée dans le panneau Hostinger
- [ ] MongoDB Atlas configuré avec IP autorisée (0.0.0.0/0)
- [ ] Code commité et pushé vers la branche `main`
- [ ] Déploiement GitHub Actions réussi
- [ ] Site accessible via HTTPS
- [ ] API répond correctement (`/api/health`)
- [ ] Login admin fonctionne
- [ ] Upload d'images fonctionne

## Support

Pour toute question ou problème :
- 📖 Consultez `DEPLOYMENT.md` pour plus de détails
- 💬 Contactez le support Hostinger pour les problèmes serveur
- 🔍 Vérifiez les logs dans le panneau Hostinger → Node.js → View logs

---

**Date de création** : 13 octobre 2025
**Problème résolu** : Structure de déploiement et erreurs 404 sur API
