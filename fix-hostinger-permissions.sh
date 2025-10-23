#!/bin/bash

# Script à exécuter sur Hostinger via SSH pour corriger les permissions

echo "🔧 Correction des permissions - Hostinger"
echo "=========================================="

# Aller dans le répertoire home
cd ~

# Corriger permissions frontend (public_html)
echo "📁 Correction permissions frontend..."
chmod -R 755 public_html/
find public_html/ -type f -exec chmod 644 {} \;
find public_html/ -type d -exec chmod 755 {} \;

# Corriger permissions backend (api)
echo "📁 Correction permissions backend..."
chmod -R 755 api/
find api/ -type f -exec chmod 644 {} \;
find api/ -type d -exec chmod 755 {} \;

# Permissions spéciales pour server.js (exécutable)
chmod 755 api/server.js

# Permissions uploads (doit être writable)
mkdir -p api/uploads
chmod -R 755 api/uploads/

# Vérifier .htaccess
if [ -f "public_html/.htaccess" ]; then
    chmod 644 public_html/.htaccess
    echo "✅ .htaccess permissions OK"
else
    echo "⚠️  .htaccess non trouvé dans public_html/"
fi

echo ""
echo "✅ Permissions corrigées !"
echo ""
echo "Structure des permissions :"
echo "  Dossiers : 755 (rwxr-xr-x)"
echo "  Fichiers : 644 (rw-r--r--)"
echo "  Uploads  : 755 (writable)"
