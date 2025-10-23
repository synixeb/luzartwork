# 🚨 ERREUR 403 - DIAGNOSTIC RAPIDE

## ⚡ Solution Rapide (90% des cas)

### Via SSH Hostinger (RECOMMANDÉ)

```bash
# 1. Se connecter en SSH
ssh votre_user@synix.fr

# 2. Exécuter ces commandes
chmod -R 755 ~/public_html/ ~/api/
find ~/public_html/ -type f -exec chmod 644 {} \;
find ~/public_html/ -type d -exec chmod 755 {} \;
chmod 644 ~/public_html/.htaccess

# 3. Vérifier que les fichiers existent
ls -la ~/public_html/index.html
ls -la ~/public_html/.htaccess

# 4. Si index.html ou .htaccess manque : REDÉPLOYER
```

### Via hPanel File Manager (Alternative)

1. **hPanel** → **Files** → **File Manager**
2. Aller dans `public_html/`
3. **Sélectionner tous les fichiers** → **Permissions**
4. Fichiers : `644` (rw-r--r--)
5. Dossiers : `755` (rwxr-xr-x)

---

## 🔍 Vérifications

### 1. Quelle URL donne l'erreur 403 ?

**Testez ces URLs et dites-moi laquelle ne fonctionne pas** :

```bash
# Frontend
curl -I https://synix.fr

# API
curl -I https://synix.fr/api/health

# Route Angular
curl -I https://synix.fr/login

# Images
curl -I https://synix.fr/uploads/test.jpg
```

### 2. Fichiers Critiques Présents ?

**Via SSH** :
```bash
ssh votre_user@synix.fr

# Ces fichiers DOIVENT exister
test -f ~/public_html/index.html && echo "✅ index.html" || echo "❌ MANQUANT"
test -f ~/public_html/.htaccess && echo "✅ .htaccess" || echo "❌ MANQUANT"
test -f ~/api/server.js && echo "✅ server.js" || echo "❌ MANQUANT"
test -f ~/api/.env && echo "✅ .env" || echo "❌ MANQUANT"
```

### 3. Permissions Correctes ?

**Via SSH** :
```bash
# Vérifier permissions
ls -la ~/public_html/ | head -5
# Doit afficher : drwxr-xr-x pour dossiers, -rw-r--r-- pour fichiers
```

---

## 🔧 Solutions par Cas

### Cas 1 : `https://synix.fr` → 403

**Cause** : `index.html` manquant ou permissions incorrectes

**Solution** :
```bash
# Via SSH
ssh votre_user@synix.fr
ls -la ~/public_html/index.html

# Si manquant : Redéployer
# Si présent : Corriger permissions
chmod 644 ~/public_html/index.html
```

### Cas 2 : `https://synix.fr/api/health` → 403

**Cause** : Application Node.js pas démarrée ou .htaccess mal configuré

**Solution** :
```bash
# 1. Vérifier Node.js
# hPanel → Node.js → Vérifier Running (vert)
# Si rouge : Restart

# 2. Vérifier .htaccess
ssh votre_user@synix.fr
cat ~/public_html/.htaccess | grep -A2 "api"
# Doit contenir : RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]
```

### Cas 3 : Toutes les URLs → 403

**Cause** : `.htaccess` manquant ou restrictif

**Solution** :
```bash
# Via SSH
ssh votre_user@synix.fr

# Vérifier .htaccess existe
cat ~/public_html/.htaccess

# Si vide ou manquant : Redéployer via GitHub
```

---

## 🚀 Redéployer Complètement

Si rien ne marche :

```bash
# 1. GitHub : Aller dans Actions
# 2. Cliquer sur le dernier workflow
# 3. Cliquer "Re-run all jobs"

# OU pousser à nouveau

git checkout main
git commit --allow-empty -m "Redeploy: fix 403 error"
git push origin main
```

---

## 📋 Checklist Debug

- [ ] `index.html` existe dans `public_html/`
- [ ] `.htaccess` existe dans `public_html/`
- [ ] Permissions 644 pour fichiers, 755 pour dossiers
- [ ] Application Node.js Running (hPanel)
- [ ] `.env` existe dans `api/`
- [ ] GitHub Actions déploiement réussi (vert)

---

## 📞 Besoin d'Aide ?

**Donnez-moi ces informations** :

1. Quelle URL exacte donne l'erreur 403 ?
2. Résultat de `ls -la ~/public_html/` via SSH
3. Résultat de `cat ~/public_html/.htaccess` via SSH
4. Screenshot de hPanel → Node.js (statut de l'app)

---

**Guide complet** : [FIX_403_ERROR.md](FIX_403_ERROR.md)
