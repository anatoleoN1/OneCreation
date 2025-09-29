// menu.js
import { World } from "./world.js";

export function setupMenu(renderer) {
  const worldNameInput = document.getElementById("worldName");
  const createBtn = document.getElementById("createWorldBtn");
  const worldListDiv = document.getElementById("worldList");

  async function refreshWorldList() {
    const res = await fetch("/api/worlds");
    const worlds = await res.json();
    worldListDiv.innerHTML = "";
    worlds.forEach(fileName => {
      const worldName = fileName.replace(".json", "");
      const div = document.createElement("div");
      div.className = "world-entry";

      const title = document.createElement("span");
      title.textContent = worldName;
      title.className = "world-title";

      const playBtn = document.createElement("button");
      playBtn.textContent = "Jouer";
      playBtn.onclick = () => loadWorld(worldName);

      const delBtn = document.createElement("button");
      delBtn.textContent = "Supprimer";
      delBtn.onclick = () => deleteWorld(worldName);

      const dlBtn = document.createElement("button");
      dlBtn.textContent = "Télécharger";
      dlBtn.onclick = () => window.location.href = `/api/worlds/download/${fileName}`;

      const dupBtn = document.createElement("button");
      dupBtn.textContent = "Dupliquer";
      dupBtn.onclick = async () => {
        const newName = prompt("Nom du nouveau monde ?");
        if (!newName) return;
        await fetch("/api/worlds/duplicate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sourceName: worldName, targetName: newName })
        });
        await refreshWorldList();
      };

      div.appendChild(title);
      div.appendChild(playBtn);
      div.appendChild(delBtn);
      div.appendChild(dlBtn);
      div.appendChild(dupBtn);
      worldListDiv.appendChild(div);
    });
  }

  async function loadWorld(name) {
    const res = await fetch(`/api/worlds/load/${name}`);
    if (!res.ok) return alert("Impossible de charger le monde !");
    const data = await res.json();

    const worldInstance = new World(renderer.scene);
    worldInstance.fromJSON(data);

    if (typeof window.attachCurrentWorldToPlayer === "function") {
      window.attachCurrentWorldToPlayer(name, worldInstance);
    }

    document.getElementById("menu").style.display = "none";
    document.getElementById("ui").style.display = "block";
    renderer.renderer.domElement.style.display = "block";
  }

  createBtn.addEventListener("click", async () => {
    const name = worldNameInput.value.trim();
    if (!name) return alert("Donne un nom au monde !");
    const worldInstance = new World(renderer.scene);
    worldInstance.generateFlat();

    await fetch("/api/worlds/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, data: worldInstance.toJSON() })
    });

    if (typeof window.attachCurrentWorldToPlayer === "function") {
      window.attachCurrentWorldToPlayer(name, worldInstance);
    }

    document.getElementById("menu").style.display = "none";
    document.getElementById("ui").style.display = "block";
    renderer.renderer.domElement.style.display = "block";

    refreshWorldList();
  });

  async function deleteWorld(name) {
    await fetch(`/api/worlds/delete/${name}`, { method: "DELETE" });
    await refreshWorldList();
  }

  refreshWorldList();
}
