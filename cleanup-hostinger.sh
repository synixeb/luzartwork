#!/bin/bash

# Script de Nettoyage Hostinger - À exécuter via SSH
# Nettoie la structure incorrecte et prépare pour le bon déploiement

echo "🧹 Nettoyage Structure Hostinger"
echo "================================="
echo ""

# Sauvegarder l'ancienne structure au cas où
echo "📦 Sauvegarde de l'ancienne structure..."
mkdir -p ~/backup_$(date +%Y%m%d_%H%M%S)
if [ -d ~/public_html ]; then
    cp -r ~/public_html ~/backup_$(date +%Y%m%d_%H%M%S)/
    echo "✅ Sauvegarde créée dans ~/backup_$(date +%Y%m%d_%H%M%S)/"
fi

# Supprimer le contenu de public_html (mais garder le dossier)
echo ""
echo "🗑️  Nettoyage de public_html..."
if [ -d ~/public_html ]; then
    rm -rf ~/public_html/*
    rm -rf ~/public_html/.*
    echo "✅ public_html nettoyé"
else
    mkdir -p ~/public_html
    echo "✅ public_html créé"
fi

# S'assurer que api/ existe à la racine
echo ""
echo "📁 Vérification du dossier api..."
if [ ! -d ~/api ]; then
    mkdir -p ~/api
    echo "✅ Dossier api/ créé"
else
    echo "✅ Dossier api/ existe déjà"
fi

# Définir les permissions correctes
echo ""
echo "🔧 Configuration des permissions..."
chmod 755 ~/public_html
chmod 755 ~/api
echo "✅ Permissions configurées"

# Afficher la structure résultante
echo ""
echo "📊 Structure actuelle :"
echo "======================"
ls -la ~/ | grep -E "public_html|api|backup"

echo ""
echo "✅ NETTOYAGE TERMINÉ !"
echo ""
echo "Prochaines étapes :"
echo "1. Depuis votre machine locale :"
echo "   git checkout main"
echo "   git merge develop"
echo "   git push origin main"
echo ""
echo "2. Attendre le déploiement GitHub Actions (~5 min)"
echo ""
echo "3. Vérifier la nouvelle structure :"
echo "   ls -la ~/public_html/"
echo "   ls -la ~/api/"
echo ""
echo "4. Configurer Node.js dans hPanel si pas déjà fait"
echo ""
