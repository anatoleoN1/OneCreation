// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

// Dossier des mondes
const WORLDS_DIR = path.join(__dirname, "public", "worlds");

// Crée le dossier s'il n'existe pas
if (!fs.existsSync(WORLDS_DIR)) fs.mkdirSync(WORLDS_DIR, { recursive: true });

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, "public")));

// Augmente la limite de taille pour POST JSON
app.use(bodyParser.json({ limit: "50mb" }));

// Liste des mondes
app.get("/api/worlds", (req, res) => {
  fs.readdir(WORLDS_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: err.message });
    const worlds = files.filter(f => f.endsWith(".json"));
    res.json(worlds);
  });
});

// Créer / sauvegarder un monde
app.post("/api/worlds/save", (req, res) => {
  const { name, data } = req.body;
  if (!name || !data) return res.status(400).json({ error: "Missing name or data" });

  const filePath = path.join(WORLDS_DIR, name + ".json");
  fs.writeFile(filePath, JSON.stringify(data), err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Charger un monde
app.get("/api/worlds/load/:name", (req, res) => {
  const filePath = path.join(WORLDS_DIR, req.params.name + ".json"); // 👈 extension ajoutée
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "World not found" });
  fs.readFile(filePath, "utf8", (err, content) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(JSON.parse(content));
  });
});

// Supprimer un monde
app.delete("/api/worlds/delete/:name", (req, res) => {
  const filePath = path.join(WORLDS_DIR, req.params.name + ".json"); // 👈 extension ajoutée
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "World not found" });
  fs.unlink(filePath, err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Dupliquer un monde
app.post("/api/worlds/duplicate", (req, res) => {
  const { sourceName, targetName } = req.body;
  if (!sourceName || !targetName) return res.status(400).json({ error: "Missing source or target name" });

  const srcPath = path.join(WORLDS_DIR, sourceName + ".json"); // 👈 ajouté
  const dstPath = path.join(WORLDS_DIR, targetName + ".json");

  if (!fs.existsSync(srcPath)) return res.status(404).json({ error: "Source world not found" });

  fs.copyFile(srcPath, dstPath, err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Télécharger un monde
app.get("/api/worlds/download/:name", (req, res) => {
  const filePath = path.join(WORLDS_DIR, req.params.name); // ici tu passes déjà le nom complet (avec .json)
  if (!fs.existsSync(filePath)) return res.status(404).send("World not found");
  res.download(filePath);
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`OneCreation game (1.00.1) running at http://localhost:${port}`);
});
