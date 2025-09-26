@echo off
setlocal

REM Vérifie si Node.js est installé et s'il s'agit de la version 20.19.5
for /f "delims=" %%v in ('node -v 2^>nul') do set NODE_VERSION=%%v

if "%NODE_VERSION%"=="" (
    echo Node.js non trouvé. Téléchargement et installation de Node.js 20.19.5...
    powershell -Command "Invoke-WebRequest -Uri https://nodejs.org/dist/v20.19.5/node-v20.19.5-x64.msi -OutFile node20.msi"
    msiexec /i node20.msi /quiet /norestart
    del node20.msi
) else (
    echo Node.js déjà installé : %NODE_VERSION%
)

REM Installer dépendances
npm install

REM Lancer le serveur
npm start
pause
