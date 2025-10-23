# 🔧 RÉSOLUTION ERREUR 403 - Structure Incorrecte

## ❌ Problème Identifié

D'après vos captures d'écran, la structure de déploiement est **incorrecte** :

**Actuellement sur Hostinger** :
```
/public_html/
├── api/              ← ❌ MAUVAIS
└── public_html/      ← ❌ MAUVAIS (imbriqué)
```

**Structure ATTENDUE** :
```
/ (racine du compte)
├── public_html/      ← Frontend Angular
│   ├── index.html
│   ├── *.js
│   ├── .htaccess
│   └── assets/
└── api/              ← Backend Node.js (SÉPARÉ)
    ├── server.js
    ├── .env
    └── ...
```

---

## ✅ Solution Complète

### Étape 1 : Nettoyer Hostinger (VIA SSH ou File Manager)

**Option A : Via SSH** (Recommandé)
```bash
ssh votre_user@synix.fr

# Sauvegarder au cas où
mkdir -p ~/backup
mv ~/public_html ~/backup/public_html_old

# Créer les bons dossiers
mkdir -p ~/public_html
mkdir -p ~/api
```

**Option B : Via hPanel File Manager**
1. Se connecter au File Manager Hostinger
2. Supprimer le contenu de `public_html/`
3. S'assurer que `api/` existe à la RACINE (même niveau que `public_html/`)

---

### Étape 2 : Corriger GitHub Actions

J'ai **déjà corrigé** le fichier `.github/workflows/deploy.yml` :

**Changements** :
- ✅ `server-dir: ./public_html/` (au lieu de `/public_html/`)
- ✅ `server-dir: ./api/` (au lieu de `/api/`)

Cela utilise des chemins **relatifs** qui fonctionnent mieux avec Hostinger.

---

### Étape 3 : Commit et Redéployer

```bash
# Depuis votre machine locale

# 1. Commit les corrections
git add .
git commit -m "Fix: Correct deployment paths for Hostinger"
git push origin develop

# 2. Merger vers main pour déployer
git checkout main
git merge develop
git push origin main
```

**GitHub Actions va redéployer avec la bonne structure** ! 🚀

---

### Étape 4 : Vérifier le Déploiement

**Suivre GitHub Actions** :
1. Aller sur GitHub → **Actions**
2. Attendre que le workflow se termine (~5 minutes)
3. Vérifier toutes les étapes sont **vertes** ✅

**Vérifier sur Hostinger** (via File Manager) :

**Attendu après déploiement** :
```
/public_html/
├── index.html        ← ✅ Fichier Angular principal
├── main.*.js         ← ✅ Fichiers JavaScript
├── styles.*.css      ← ✅ Styles
├── .htaccess         ← ✅ Configuration Apache
└── assets/           ← ✅ Ressources

/api/
├── server.js         ← ✅ Serveur Express
├── .env              ← ✅ Variables d'environnement
├── package.json
├── controllers/
├── models/
└── routes/
```

---

### Étape 5 : Configurer Node.js Application

**hPanel → Advanced → Node.js** :

Si vous avez déjà une application Node.js configurée :
1. **Edit** l'application
2. Vérifier **Application root** : `/api` (ou `~/api`)
3. **Save & Restart**

Si vous n'avez pas encore créé l'application :
1. **Create Application**
2. Node.js version : `20.x`
3. Application mode : `Production`
4. Application root : `/api`
5. Application URL : `https://synix.fr/api`
6. Application startup file : `server.js`
7. **Save & Start**

---

### Étape 6 : Tester

```bash
# Tester le frontend
curl -I https://synix.fr
# Attendu : 200 OK

# Tester l'API
curl https://synix.fr/api/health
# Attendu : {"status":"OK","message":"API fonctionne correctement"}

# Tester une route Angular
curl -I https://synix.fr/login
# Attendu : 200 OK (doit servir index.html)
```

---

## 🔍 Pourquoi le Problème ?

**FTP-Deploy-Action** avec `server-dir: /public_html/` :
- Certains serveurs FTP interprètent `/` comme la racine FTP utilisateur
- D'autres l'interprètent comme racine absolue du système
- Hostinger semble créer une structure imbriquée avec `/`

**Solution** : Utiliser `./public_html/` (chemin relatif)
- ✅ Compatible avec tous les serveurs FTP
- ✅ Déploie au bon endroit

---

## 📋 Checklist Post-Déploiement

Après que GitHub Actions ait terminé :

- [ ] `public_html/` contient les fichiers Angular (index.html, *.js, etc.)
- [ ] `public_html/.htaccess` existe
- [ ] `api/` existe à la RACINE (même niveau que public_html)
- [ ] `api/server.js` existe
- [ ] `api/.env` existe
- [ ] Application Node.js configurée dans hPanel
- [ ] Application Node.js **Running** (pastille verte)
- [ ] https://synix.fr charge le frontend
- [ ] https://synix.fr/api/health retourne JSON

---

## 🐛 Si le Problème Persiste

### Vérifier via SSH

```bash
ssh votre_user@synix.fr

# Vérifier la structure
echo "=== Structure racine ==="
ls -la ~/ | grep -E "public_html|api"

echo "=== Contenu public_html ==="
ls -la ~/public_html/ | head -10

echo "=== Contenu api ==="
ls -la ~/api/ | head -10
```

**Attendu** :
```
drwxr-xr-x  public_html
drwxr-xr-x  api
```

### Vérifier Logs

**GitHub Actions** :
- GitHub → Actions → Dernière exécution
- Vérifier chaque étape de déploiement

**Hostinger Node.js** :
- hPanel → Node.js → View Logs
- Chercher erreurs

---

## 📞 Prochaines Étapes

**Maintenant, faites ceci** :

1. ✅ Nettoyer `public_html/` sur Hostinger (supprimer le contenu)
2. ✅ Commit et push les changements (déjà faits)
3. ✅ Attendre le déploiement GitHub Actions
4. ✅ Vérifier la structure dans File Manager
5. ✅ Configurer/redémarrer Node.js app
6. ✅ Tester https://synix.fr

**Le site devrait fonctionner après ces étapes** ! 🎉

---

**Après le redéploiement, envoyez-moi un screenshot du File Manager pour confirmer la bonne structure.**
