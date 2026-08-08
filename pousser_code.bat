@echo off
echo ========================================
echo   Mise a jour vers GitHub
echo ========================================

set /p message="Entrez le message de commit : "

if "%message%"=="" (
    echo Le message de commit ne peut pas etre vide.
    pause
    exit /b
)

echo.
echo Ajout des fichiers...
git add .

echo.
echo Creation du commit...
git commit -m "%message%"

echo.
echo Envoi vers GitHub...
git push

echo.
echo ========================================
echo   Mise a jour terminee !
echo ========================================
pause
