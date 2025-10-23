@echo off
REM Script de Vérification Pré-Déploiement - Windows
REM À exécuter avant de pousser sur main

echo.
echo ========================================
echo Verification Pre-Deploiement - synix.fr
echo ========================================
echo.

set errors=0
set warnings=0

REM 1. Vérifier la branche
echo [1/8] Verification de la branche...
for /f "tokens=*" %%i in ('git branch --show-current') do set branch=%%i
if not "%branch%"=="develop" (
    echo [WARNING] Vous n'etes pas sur la branche develop ^(actuellement sur %branch%^)
    set /a warnings+=1
) else (
    echo [OK] Sur la branche develop
)
echo.

REM 2. Vérifier build frontend
echo [2/8] Build frontend...
cd frontend
call npm run build -- --configuration=production >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build echoue
    set /a errors+=1
) else (
    echo [OK] Frontend build reussi
)
cd ..
echo.

REM 3. Vérifier environment.prod.ts
echo [3/8] Verification environment.prod.ts...
findstr /C:"https://synix.fr/api" frontend\src\environments\environment.prod.ts >nul
if %errorlevel% neq 0 (
    echo [ERROR] API URL incorrecte dans environment.prod.ts
    set /a errors+=1
) else (
    echo [OK] API URL correcte pour production
)
echo.

REM 4. Vérifier .htaccess
echo [4/8] Verification .htaccess...
if exist "frontend\public\.htaccess" (
    echo [OK] .htaccess existe
) else (
    echo [ERROR] .htaccess manquant
    set /a errors+=1
)
echo.

REM 5. Vérifier .env non commité
echo [5/8] Verification securite...
git ls-files | findstr /C:"backend\.env" >nul
if %errorlevel% equ 0 (
    echo [ERROR] ATTENTION : .env est commite dans Git !
    set /a errors+=1
) else (
    echo [OK] .env non commite
)
echo.

REM 6. Vérifier node_modules frontend
echo [6/8] Verification dependances frontend...
if exist "frontend\node_modules" (
    echo [OK] Frontend node_modules present
) else (
    echo [WARNING] Frontend node_modules manquant
    set /a warnings+=1
)
echo.

REM 7. Vérifier node_modules backend
echo [7/8] Verification dependances backend...
if exist "backend\node_modules" (
    echo [OK] Backend node_modules present
) else (
    echo [WARNING] Backend node_modules manquant
    set /a warnings+=1
)
echo.

REM 8. Vérifier deploy.yml
echo [8/8] Verification GitHub Actions...
if exist ".github\workflows\deploy.yml" (
    echo [OK] deploy.yml existe
) else (
    echo [ERROR] deploy.yml manquant
    set /a errors+=1
)
echo.

REM Résumé
echo ========================================
echo Resume de la Verification
echo ========================================
if %errors% equ 0 (
    if %warnings% equ 0 (
        echo [OK] Tout est OK ! Pret pour le deploiement
        echo.
        echo Pour deployer sur synix.fr :
        echo   git checkout main
        echo   git merge develop
        echo   git push origin main
    ) else (
        echo [WARNING] %warnings% avertissement^(s^) - Vous pouvez deployer mais verifiez les warnings
    )
) else (
    echo [ERROR] %errors% erreur^(s^) trouvee^(s^) - Corrigez avant de deployer !
    exit /b 1
)
echo.
pause
