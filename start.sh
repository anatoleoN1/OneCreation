#!/bin/bash

# Vérifie si Node.js est installé et s'il s'agit de la version 20.19.5
if ! command -v node &> /dev/null
then
    echo "Node.js non trouvé. Installation de Node.js 20.19.5..."
    curl -O https://nodejs.org/dist/v20.19.5/node-v20.19.5-linux-x64.tar.xz
    sudo tar -C /usr/local --strip-components=1 -xJf node-v20.19.5-linux-x64.tar.xz
    rm node-v20.19.5-linux-x64.tar.xz
else
    NODE_VERSION=$(node -v)
    if [[ "$NODE_VERSION" != "v20.19.5" ]]; then
        echo "Version actuelle : $NODE_VERSION. Remplacement par Node.js 20.19.5..."
        curl -O https://nodejs.org/dist/v20.19.5/node-v20.19.5-linux-x64.tar.xz
        sudo tar -C /usr/local --strip-components=1 -xJf node-v20.19.5-linux-x64.tar.xz
        rm node-v20.19.5-linux-x64.tar.xz
    fi
fi

# Installer dépendances
npm install

# Lancer le serveur
npm start
