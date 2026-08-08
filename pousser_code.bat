@echo off
echo ========================================
echo   Mise a jour vers GitHub
echo ========================================

echo Ajout des fichiers...
git add .

echo.
echo Creation du commit...
git commit -m "Mise a jour automatique du %date% a %time%"

echo.
echo Envoi vers GitHub...
git push

echo.
echo ========================================
echo   Mise a jour terminee !
echo ========================================
pause
