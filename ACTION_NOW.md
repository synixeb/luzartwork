# ⚡ ACTION IMMÉDIATE - Corriger Structure Déploiement

## 🎯 Problème Identifié

Vos captures montrent que le déploiement a créé :
```
❌ MAUVAIS
/public_html/
├── api/           ← Backend dans public_html (MAUVAIS)
└── public_html/   ← Imbriqué (MAUVAIS)
```

Il faut :
```
✅ BON
/ (racine)
├── public_html/   ← Frontend Angular
└── api/           ← Backend Node.js (séparé)
```

---

## 🚀 Solution en 5 Minutes

### Étape 1 : Nettoyer Hostinger (2 méthodes)

#### Méthode A : Via File Manager (FACILE)

1. **Se connecter** : hPanel → Files → **File Manager**
2. **Ouvrir** le dossier `public_html/`
3. **Tout sélectionner** (Ctrl+A)
4. **Supprimer tout** (clic droit → Delete)
5. **Confirmer** la suppression
6. **Retour racine** : Vérifier qu'il existe un dossier `api/` au même niveau que `public_html/`

#### Méthode B : Via SSH (RAPIDE)

```bash
# Se connecter
ssh votre_user@synix.fr

# Exécuter le script de nettoyage
# (copier-coller tout le bloc)
mkdir -p ~/backup_old
cp -r ~/public_html ~/backup_old/ 2>/dev/null
rm -rf ~/public_html/*
mkdir -p ~/api
chmod 755 ~/public_html ~/api
echo "✅ Nettoyage terminé !"
ls -la ~/ | grep -E "public_html|api"
```

---

### Étape 2 : Commit et Redéployer (depuis votre PC)

```bash
# Aller dans le dossier du projet
cd D:/VS_Code/luzartwork

# Vérifier qu'on est sur develop
git branch

# Commit les changements (deploy.yml a été corrigé)
git add .
git commit -m "Fix: Correct Hostinger deployment structure"
git push origin develop

# Merger vers main pour déclencher le déploiement
git checkout main
git merge develop
git push origin main
```

**GitHub Actions va déployer automatiquement** ! ⏳ (~5 minutes)

---

### Étape 3 : Suivre le Déploiement

1. **Aller sur GitHub** : https://github.com/synixeb/luzartwork
2. **Cliquer sur** : **Actions** (onglet en haut)
3. **Voir** : "Deploy to Hostinger" en cours
4. **Attendre** : Toutes les étapes vertes ✅

**Pendant ce temps, passez à l'étape 4...**

---

### Étape 4 : Configurer Node.js (si pas déjà fait)

1. **hPanel** → **Advanced** → **Node.js**
2. Si une application existe :
   - **Edit** l'application
   - **Application root** : `/api` (ou `~/api`)
   - **Save & Restart**
3. Si aucune application :
   - **Create Application**
   - Node.js version : `20.x`
   - Application mode : `Production`
   - Application root : `/api`
   - Application URL : `https://synix.fr/api`
   - Startup file : `server.js`
   - **Save & Start**

---

### Étape 5 : Vérifier Après Déploiement

#### A. Via File Manager

**Aller dans File Manager et vérifier** :

```
✅ Structure attendue :

/public_html/
├── index.html       ← Doit exister
├── main.[hash].js   ← Fichiers JS
├── styles.[hash].css
├── .htaccess        ← Important !
└── assets/

/api/                 ← Au MÊME niveau que public_html
├── server.js        ← Doit exister
├── .env             ← Doit exister
├── package.json
├── controllers/
├── models/
└── routes/
```

#### B. Tester le Site

**Ouvrir dans le navigateur** :
- https://synix.fr → Doit charger le frontend Angular
- https://synix.fr/api/health → Doit retourner `{"status":"OK"}`

**Ou via commande** :
```bash
curl https://synix.fr
curl https://synix.fr/api/health
```

---

## ✅ Checklist Finale

- [ ] **Nettoyé** : `public_html/` vide sur Hostinger
- [ ] **Committé** : Changements sur GitHub
- [ ] **Poussé** : `git push origin main`
- [ ] **GitHub Actions** : Workflow terminé avec succès (vert)
- [ ] **Structure** : Vérifiée dans File Manager
- [ ] **Node.js** : Application configurée et running
- [ ] **Frontend** : https://synix.fr fonctionne
- [ ] **API** : https://synix.fr/api/health fonctionne

---

## 📊 Vérification Visuelle

**Après le déploiement, dans File Manager, vous DEVEZ voir** :

```
📁 Racine (/)
  📁 public_html/
    📄 index.html        ← ✅ SI PRÉSENT = BON
    📄 .htaccess         ← ✅ SI PRÉSENT = BON
    📄 main.xxx.js
    📁 assets/
  
  📁 api/                ← ✅ AU MÊME NIVEAU que public_html
    📄 server.js         ← ✅ SI PRÉSENT = BON
    📄 .env
    📁 controllers/
    📁 models/
```

**Si vous voyez ça, c'est PARFAIT** ! ✅

**Si vous voyez** `public_html/public_html/` ou `public_html/api/` → **Recommencer le nettoyage**

---

## 🐛 Si Problème Après Redéploiement

### 1. Erreur 403 persiste

```bash
# Via SSH
ssh votre_user@synix.fr
chmod -R 755 ~/public_html/ ~/api/
find ~/public_html/ -type f -exec chmod 644 {} \;
```

### 2. API ne répond pas

**hPanel** → **Node.js** → **Restart**

### 3. Frontend charge pas

Vérifier que `index.html` existe :
```bash
ssh votre_user@synix.fr
ls -la ~/public_html/index.html
```

Si manquant, vérifier GitHub Actions logs.

---

## 📸 Envoyez-moi Après

**Après le redéploiement, prenez un screenshot de** :
1. File Manager montrant la racine (public_html et api au même niveau)
2. File Manager montrant le contenu de public_html/ (index.html visible)
3. La page https://synix.fr qui fonctionne

Je pourrai confirmer que tout est OK ! 🎉

---

**COMMENCEZ MAINTENANT** : Étape 1 → Nettoyer Hostinger 🧹
