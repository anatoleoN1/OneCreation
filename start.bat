@echo off
setlocal

REM Vérifier si Volta est installé
where volta >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo Volta non trouvé. Installation...
    winget install Volta.Volta --accept-package-agreements --accept-source-agreements --silent
)

REM Vérifier si Node.js 20.19.5 est installé
for /f "delims=" %%v in ('node -v 2^>nul') do set NODE_VERSION=%%v

if "%NODE_VERSION%"=="" (
    echo Node.js non trouvé. Installation de Node.js 20.19.5 avec Volta...
    volta install node@20.19.5
) else (
    echo Node.js détecté : %NODE_VERSION%
)

REM Vérifier la version Node.js
node -v
REM Vérifier la version npm
npm -v

REM Installer dépendances
npm install

REM Lancer le serveur
npm start
pause
