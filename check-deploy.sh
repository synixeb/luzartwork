#!/bin/bash

# Script de Vérification Pré-Déploiement
# À exécuter avant de pousser sur main

echo "🔍 Vérification Pré-Déploiement - synix.fr"
echo "=========================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# 1. Vérifier qu'on est sur la branche develop
echo "📋 Vérification de la branche..."
current_branch=$(git branch --show-current)
if [ "$current_branch" != "develop" ]; then
    echo -e "${YELLOW}⚠️  Vous n'êtes pas sur la branche develop (actuellement sur $current_branch)${NC}"
    warnings=$((warnings + 1))
else
    echo -e "${GREEN}✅ Sur la branche develop${NC}"
fi
echo ""

# 2. Vérifier que le code compile (frontend)
echo "🔨 Build frontend..."
cd frontend
if npm run build -- --configuration=production > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend build réussi${NC}"
else
    echo -e "${RED}❌ Frontend build échoué${NC}"
    errors=$((errors + 1))
fi
cd ..
echo ""

# 3. Vérifier que backend démarre
echo "🔨 Vérification backend..."
cd backend
if node -e "require('./server.js')" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend syntaxe valide${NC}"
else
    echo -e "${RED}❌ Backend a des erreurs de syntaxe${NC}"
    errors=$((errors + 1))
fi
cd ..
echo ""

# 4. Vérifier environment.prod.ts
echo "🌐 Vérification environment.prod.ts..."
if grep -q "https://synix.fr/api" frontend/src/environments/environment.prod.ts; then
    echo -e "${GREEN}✅ API URL correcte pour production${NC}"
else
    echo -e "${RED}❌ API URL incorrecte dans environment.prod.ts${NC}"
    errors=$((errors + 1))
fi
echo ""

# 5. Vérifier que .htaccess existe
echo "📄 Vérification .htaccess..."
if [ -f "frontend/public/.htaccess" ]; then
    echo -e "${GREEN}✅ .htaccess existe${NC}"
else
    echo -e "${RED}❌ .htaccess manquant${NC}"
    errors=$((errors + 1))
fi
echo ""

# 6. Vérifier que .env n'est pas commité
echo "🔐 Vérification sécurité..."
if git ls-files | grep -q "backend/\.env$"; then
    echo -e "${RED}❌ ATTENTION : .env est commité dans Git !${NC}"
    errors=$((errors + 1))
else
    echo -e "${GREEN}✅ .env non commité${NC}"
fi
echo ""

# 7. Vérifier les dépendances npm
echo "📦 Vérification dépendances..."
cd frontend
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Frontend node_modules présent${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend node_modules manquant, installer avec: cd frontend && npm install${NC}"
    warnings=$((warnings + 1))
fi
cd ../backend
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Backend node_modules présent${NC}"
else
    echo -e "${YELLOW}⚠️  Backend node_modules manquant, installer avec: cd backend && npm install${NC}"
    warnings=$((warnings + 1))
fi
cd ..
echo ""

# 8. Vérifier que deploy.yml existe
echo "🚀 Vérification GitHub Actions..."
if [ -f ".github/workflows/deploy.yml" ]; then
    echo -e "${GREEN}✅ deploy.yml existe${NC}"
else
    echo -e "${RED}❌ deploy.yml manquant${NC}"
    errors=$((errors + 1))
fi
echo ""

# Résumé
echo "=========================================="
echo "📊 Résumé de la Vérification"
echo "=========================================="
if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✅ Tout est OK ! Prêt pour le déploiement${NC}"
    echo ""
    echo "Pour déployer sur synix.fr :"
    echo "  git checkout main"
    echo "  git merge develop"
    echo "  git push origin main"
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $warnings avertissement(s) - Vous pouvez déployer mais vérifiez les warnings${NC}"
else
    echo -e "${RED}❌ $errors erreur(s) trouvée(s) - Corrigez avant de déployer !${NC}"
    exit 1
fi
echo ""
