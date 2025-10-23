# GitHub Actions Workflows

Ce dossier contient les workflows GitHub Actions pour l'automatisation du déploiement.

## Workflows Disponibles

### `deploy.yml` - Déploiement Production

**Déclenchement** : Push sur la branche `main`

**Actions** :
1. ✅ Build Angular en mode production
2. ✅ Install backend dependencies
3. ✅ Création du fichier `.env` depuis GitHub Secrets
4. ✅ Déploiement frontend vers `/public_html/` via FTP
5. ✅ Déploiement `.htaccess` pour routing Angular
6. ✅ Déploiement backend vers `/api/` via FTP

**Secrets Requis** :
- `FTP_SERVER` - Serveur FTP Hostinger
- `FTP_USERNAME` - Nom d'utilisateur FTP
- `FTP_PASSWORD` - Mot de passe FTP
- `MONGODB_URI` - URI MongoDB Atlas
- `JWT_SECRET` - Secret JWT pour production

## Configuration des Secrets

1. Aller dans : `Settings` → `Secrets and variables` → `Actions`
2. Cliquer `New repository secret`
3. Ajouter chaque secret avec sa valeur

## Déploiement

```bash
# Pousser sur main pour déclencher le déploiement
git checkout main
git merge develop
git push origin main
```

Le workflow se lance automatiquement et déploie sur **https://synix.fr**

## Consulter les Logs

**GitHub** → **Actions** → Sélectionner l'exécution

## Documentation

- `QUICKSTART_DEPLOYMENT.md` - Guide déploiement rapide
- `HOSTINGER_DEPLOYMENT.md` - Guide complet déploiement Hostinger
- `DEPLOYMENT_CHECKLIST.md` - Checklist détaillée
