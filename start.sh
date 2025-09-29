#!/bin/bash

# Vérifie si Volta est installé
if ! command -v volta &> /dev/null
then
    echo "Volta non trouvé. Installation..."
    curl https://get.volta.sh | bash
    export VOLTA_HOME="$HOME/.volta"
    export PATH="$VOLTA_HOME/bin:$PATH"
fi

# Vérifie si Node.js 18.20.8 est installé via Volta
NODE_VERSION=$(node -v 2>/dev/null)

if [[ "$NODE_VERSION" == "v18.20.8" ]]; then
    echo "Node.js déjà installé : $NODE_VERSION"
else
    echo "Installation de Node.js 18.20.8 avec Volta..."
    volta install node@18.20.8
fi

echo "Vérification des versions :"
node -v
npm -v

# Installer dépendances
npm install

# Lancer le serveur
npm start
