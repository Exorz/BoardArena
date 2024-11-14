
#!/bin/bash

# Steg 1: Uppdatera repositoryn från GitHub
echo "Hämtar senaste ändringarna från GitHub..."
git pull origin main

# Steg 2: Kontrollera om beroendefiler har ändrats (package.json eller package-lock.json)
git diff --exit-code --quiet package.json package-lock.json
if [ $? -eq 1 ]; then
  echo "Beroenden har ändrats, installerar..."
  npm install
else
  echo "Inga ändringar i beroenden."
fi

# Steg 3: Kontrollera om någon kodfil har ändrats (för att bestämma om servern ska startas om)
git diff --exit-code --quiet
if [ $? -eq 1 ]; then
  echo "Kod har ändrats, startar om servern..."
  npm run dev
else
  echo "Ingen kod har ändrats, ingen omstart av servern."
fi