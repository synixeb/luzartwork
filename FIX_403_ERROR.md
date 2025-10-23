# 🔧 Résolution Erreur 403 - Hostinger

## 🐛 Symptômes

- ✅ Site fonctionne en local (`localhost:4200`)
- ❌ Erreur 403 après déploiement sur synix.fr

## 🔍 Causes Possibles

### 1. **Permissions de fichiers** (90% des cas)

Les fichiers uploadés via FTP n'ont pas les bonnes permissions.

**Solution** : Exécuter via SSH Hostinger

```bash
# Se connecter en SSH
ssh votre_user@synix.fr

# Corriger les permissions
chmod -R 755 ~/public_html/
find ~/public_html/ -type f -exec chmod 644 {} \;
find ~/public_html/ -type d -exec chmod 755 {} \;

chmod -R 755 ~/api/
find ~/api/ -type f -exec chmod 644 {} \;
find ~/api/ -type d -exec chmod 755 {} \;

# Vérifier
ls -la ~/public_html/
ls -la ~/api/
```

**OU utiliser le script** :
```bash
# Uploader fix-hostinger-permissions.sh via FTP
# Puis via SSH :
bash ~/fix-hostinger-permissions.sh
```

---

### 2. **Fichier .htaccess manquant ou mal configuré**

**Vérifier via SSH** :
```bash
ssh votre_user@synix.fr
ls -la ~/public_html/.htaccess
cat ~/public_html/.htaccess
```

**Si .htaccess manque**, créer via SSH :
```bash
cat > ~/public_html/.htaccess << 'EOF'
# Enable mod_rewrite
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # Redirect to HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    
    # Proxy API requests to Node.js application
    RewriteCond %{REQUEST_URI} ^/api/
    RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]
    
    # Angular routing
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# Allow access to all files
<FilesMatch ".*">
    Require all granted
</FilesMatch>

# Enable CORS
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
EOF

chmod 644 ~/public_html/.htaccess
```

---

### 3. **Index.html manquant ou mal placé**

**Vérifier** :
```bash
ssh votre_user@synix.fr
ls -la ~/public_html/index.html
```

**Si manquant**, le build Angular n'est pas déployé correctement.

**Solution** : Vérifier le chemin de build dans GitHub Actions

Le build Angular devrait créer : `frontend/dist/frontend/browser/index.html`

**Vérifier dans GitHub Actions logs** :
1. GitHub → Actions → Dernière exécution
2. Vérifier l'étape "Build frontend for production"
3. Vérifier l'étape "Deploy frontend to /public_html"

---

### 4. **Configuration Apache/Hostinger**

**Option A : Via hPanel File Manager**

1. hPanel → Files → File Manager
2. Naviguer vers `public_html/`
3. Clic droit sur `.htaccess` → Permissions → `644`
4. Clic droit sur `index.html` → Permissions → `644`
5. Sélectionner tous les dossiers → Permissions → `755`

**Option B : Via PHP Manager (si accessible)**

1. hPanel → Advanced → PHP Configuration
2. Vérifier que PHP n'est PAS activé pour le dossier `public_html/` (c'est une SPA Angular)

---

### 5. **Application Node.js pas démarrée**

Si l'erreur 403 est sur `/api/*` :

**Vérifier Node.js** :
1. hPanel → Advanced → Node.js
2. Vérifier que l'application est **Running** (pastille verte)
3. Si rouge, cliquer **Restart**
4. Consulter les **Logs**

**Via SSH** :
```bash
ssh votre_user@synix.fr
cd ~/api
node server.js
# Vérifier qu'il n'y a pas d'erreurs
```

---

### 6. **Règles .htaccess restrictives**

Si Hostinger a des règles `.htaccess` parent restrictives.

**Ajouter dans `public_html/.htaccess`** (au début) :
```apache
# Override parent restrictions
<FilesMatch ".*">
    Require all granted
</FilesMatch>

Options -Indexes
DirectoryIndex index.html
```

---

## 🔧 Solution Rapide (Toutes causes)

**Exécuter via SSH Hostinger** :

```bash
# Se connecter
ssh votre_user@synix.fr

# 1. Corriger permissions
chmod -R 755 ~/public_html/ ~/api/
find ~/public_html/ -type f -exec chmod 644 {} \;
find ~/public_html/ -type d -exec chmod 755 {} \;
find ~/api/ -type f -exec chmod 644 {} \;
find ~/api/ -type d -exec chmod 755 {} \;

# 2. Vérifier .htaccess existe
if [ ! -f ~/public_html/.htaccess ]; then
    echo "⚠️  .htaccess manquant !"
    echo "Créer manuellement ou redéployer"
fi

# 3. Vérifier index.html existe
if [ ! -f ~/public_html/index.html ]; then
    echo "⚠️  index.html manquant !"
    echo "Le build Angular n'est pas déployé"
fi

# 4. Lister le contenu
echo "=== Contenu public_html ==="
ls -la ~/public_html/

echo "=== Contenu api ==="
ls -la ~/api/
```

---

## 🐛 Diagnostic Détaillé

### Étape 1 : Identifier l'URL exacte de l'erreur 403

**Quelle URL donne l'erreur ?**

- [ ] `https://synix.fr` (page d'accueil)
- [ ] `https://synix.fr/api/health` (API)
- [ ] `https://synix.fr/login` (route Angular)
- [ ] `https://synix.fr/uploads/xxx.jpg` (images)

### Étape 2 : Vérifier via SSH

```bash
ssh votre_user@synix.fr

# Structure attendue
# ~/public_html/
#   ├── index.html           ← DOIT exister
#   ├── main.*.js
#   ├── polyfills.*.js
#   ├── styles.*.css
#   ├── .htaccess            ← DOIT exister
#   └── assets/
#
# ~/api/
#   ├── server.js            ← DOIT exister
#   ├── .env                 ← DOIT exister
#   ├── package.json
#   ├── controllers/
#   ├── models/
#   └── uploads/

# Vérifier présence fichiers critiques
test -f ~/public_html/index.html && echo "✅ index.html OK" || echo "❌ index.html MANQUANT"
test -f ~/public_html/.htaccess && echo "✅ .htaccess OK" || echo "❌ .htaccess MANQUANT"
test -f ~/api/server.js && echo "✅ server.js OK" || echo "❌ server.js MANQUANT"
test -f ~/api/.env && echo "✅ .env OK" || echo "❌ .env MANQUANT"
```

### Étape 3 : Vérifier logs Apache/Node.js

**Logs Apache** :
```bash
# Via SSH
tail -50 ~/logs/error.log
tail -50 ~/logs/access.log
```

**Logs Node.js** :
```
# Via hPanel
hPanel → Node.js → View Logs
```

---

## ✅ Checklist de Résolution

- [ ] **Permissions corrigées** (755 dossiers, 644 fichiers)
- [ ] **`.htaccess` présent** dans `public_html/`
- [ ] **`index.html` présent** dans `public_html/`
- [ ] **Build Angular déployé** (vérifier taille > 1MB)
- [ ] **Application Node.js running** (hPanel → Node.js)
- [ ] **`.env` existe** dans `api/` avec bons secrets
- [ ] **Logs vérifiés** (pas d'erreurs)

---

## 🚀 Redéploiement Complet

Si rien ne fonctionne, redéployer complètement :

```bash
# 1. Nettoyer sur Hostinger (via SSH)
ssh votre_user@synix.fr
rm -rf ~/public_html/*
rm -rf ~/api/*

# 2. Redéployer depuis GitHub
git checkout main
git pull origin main
git push origin main  # Force nouveau déploiement

# 3. Attendre GitHub Actions (~5 min)

# 4. Vérifier déploiement réussi
# GitHub → Actions → Vérifier toutes étapes vertes

# 5. Corriger permissions (via SSH)
ssh votre_user@synix.fr
bash ~/fix-hostinger-permissions.sh

# 6. Redémarrer Node.js
# hPanel → Node.js → Restart
```

---

## 📞 Contact Support Hostinger

Si l'erreur persiste :

1. **hPanel → Help → Live Chat**
2. Dire : "J'ai une erreur 403 sur mon site Angular déployé dans public_html/"
3. Demander :
   - Vérification permissions
   - Vérification modules Apache (`mod_rewrite`, `mod_headers`)
   - Logs d'erreurs détaillés

---

## 🔍 Commandes de Debug

```bash
# Via SSH Hostinger

# Voir permissions détaillées
ls -la ~/public_html/ | head -20

# Voir contenu .htaccess
cat ~/public_html/.htaccess

# Tester Node.js
cd ~/api && node -e "console.log('Node OK')"

# Vérifier MongoDB connexion
cd ~/api && node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"

# Vérifier port 3000 utilisé
netstat -tuln | grep 3000
```

---

**Quelle URL exactement donne l'erreur 403 ?**

Donnez-moi l'URL et je pourrai vous donner une solution ciblée !
