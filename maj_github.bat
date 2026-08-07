@echo off
chcp 65001 > nul
echo ========================================
echo   Mise à jour vers GitHub
echo ========================================

set /p message="Entrez le message de commit : "

if "%message%"=="" (
    echo Le message de commit ne peut pas être vide.
    pause
    exit /b
)

echo.
echo ⏳ Ajout des fichiers (git add .)...
git add .

echo.
echo 📝 Création du commit (git commit)...
git commit -m "%message%"

echo.
echo 🚀 Envoi vers GitHub (git push)...
git push

echo.
echo ========================================
echo   ✅ Mise à jour terminée !
echo ========================================
pause
