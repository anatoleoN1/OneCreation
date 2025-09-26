@echo off
setlocal

REM Vérifie si Node.js est installé et s'il s'agit de la version 18.20.8
for /f "delims=" %%v in ('node -v 2^>nul') do set NODE_VERSION=%%v

if "%NODE_VERSION%"=="" (
    echo Node.js non trouvé. Téléchargement et installation de Node.js 18.20.8...
    powershell -Command "Invoke-WebRequest -Uri https://nodejs.org/dist/v18.20.8/node-v18.20.8-x64.msi -OutFile node18.msi"
    msiexec /i node18.msi /quiet /norestart
    del node18.msi
) else (
    echo Node.js déjà installé : %NODE_VERSION%
)

REM Installer dépendances
npm install

REM Lancer le serveur
npm start
pause
