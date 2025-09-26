const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Servir les fichiers statiques (HTML, JS, CSS, textures)
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`OneCreation running on http://localhost:${PORT}`);
});
