@echo off
setlocal

REM Vérifie si Volta est installé
where volta >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo Volta non trouvé. Installation...
    winget install Volta.Volta -y
)

REM Vérifie si Node.js 18.20.8 est installé via Volta
for /f "delims=" %%v in ('node -v 2^>nul') do set NODE_VERSION=%%v

if "%NODE_VERSION%"=="v18.20.8" (
    echo Node.js déjà installé : %NODE_VERSION%
) else (
    echo Installation de Node.js 18.20.8 avec Volta...
    volta install node@18.20.8
)

echo Vérification des versions :
node -v
npm -v

REM Installer dépendances
npm install

REM Lancer le serveur
npm start
pause
