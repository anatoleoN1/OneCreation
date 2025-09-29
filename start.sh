#!/bin/bash

# Vérifie si Volta est installé
if ! command -v volta &> /dev/null
then
    echo "Volta non trouvé. Installation..."
    curl https://get.volta.sh | bash
    export VOLTA_HOME="$HOME/.volta"
    export PATH="$VOLTA_HOME/bin:$PATH"
fi

# Vérifie si Node.js 20.19.5 est installé via Volta
NODE_VERSION=$(node -v 2>/dev/null)

if [[ "$NODE_VERSION" == "v20.19.5" ]]; then
    echo "Node.js déjà installé : $NODE_VERSION"
else
    echo "Installation de Node.js 20.19.5 avec Volta..."
    volta install node@20.19.5
fi

echo "Vérification des versions :"
node -v
npm -v

# Installer dépendances
npm install

# Lancer le serveur
npm start
