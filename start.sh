#!/bin/bash

# Vérifie si Node.js est installé et s'il s'agit de la version 18.20.8
if ! command -v node &> /dev/null
then
    echo "Node.js non trouvé. Installation de Node.js 18.20.8..."
    curl -O https://nodejs.org/dist/v18.20.8/node-v18.20.8-linux-x64.tar.xz
    sudo tar -C /usr/local --strip-components=1 -xJf node-v18.20.8-linux-x64.tar.xz
    rm node-v18.20.8-linux-x64.tar.xz
else
    NODE_VERSION=$(node -v)
    if [[ "$NODE_VERSION" != "v18.20.8" ]]; then
        echo "Version actuelle : $NODE_VERSION. Remplacement par Node.js 18.20.8..."
        curl -O https://nodejs.org/dist/v18.20.8/node-v18.20.8-linux-x64.tar.xz
        sudo tar -C /usr/local --strip-components=1 -xJf node-v18.20.8-linux-x64.tar.xz
        rm node-v18.20.8-linux-x64.tar.xz
    fi
fi

# Installer dépendances
npm install

# Lancer le serveur
npm start
