@echo off
title Serveur - Coin des Eleveurs
color 0A

echo ===================================================
echo    LANCEMENT DU SITE - COIN DES ELEVEURS
echo ===================================================
echo.
echo Recherche d'un serveur local disponible sur votre PC...
echo.

:: 1. Essayer avec Python (très commun sur Windows)
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo [+] Python detecte ! Le serveur demarre sur le port 8000...
    echo.
    echo VEUILLEZ NE PAS FERMER CETTE FENETRE NOIRE.
    echo.
    :: Ouvre le navigateur
    start http://localhost:8000/index.html
    :: Lance le serveur
    python -m http.server 8000
    goto end
)

:: 2. Essayer avec Node.js (npx http-server)
npx --version >nul 2>&1
if %errorlevel% == 0 (
    echo [+] Node.js detecte ! Le serveur demarre sur le port 8080...
    echo.
    echo VEUILLEZ NE PAS FERMER CETTE FENETRE NOIRE.
    echo.
    start http://localhost:8080/index.html
    npx http-server -p 8080 -c-1
    goto end
)

:: 3. Essayer avec PHP
php -v >nul 2>&1
if %errorlevel% == 0 (
    echo [+] PHP detecte ! Le serveur demarre sur le port 8000...
    echo.
    echo VEUILLEZ NE PAS FERMER CETTE FENETRE NOIRE.
    echo.
    start http://localhost:8000/index.html
    php -S localhost:8000
    goto end
)

:: Si aucun outil n'est trouvé
color 0C
echo [-] ERREUR : Aucun environnement de serveur n'a ete trouve (Python, Node.js ou PHP).
echo.
echo Pour que ce fichier fonctionne, vous devez installer NodeJS ou Python sur votre ordinateur.
echo Sinon, continuez a utiliser le bouton "Go Live" (Live Server) directement depuis VS Code.
echo.
pause

:end
