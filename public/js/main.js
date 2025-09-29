// main.js

import { inventory } from "./inventory.js";
import { renderer as Renderer } from "./renderer.js";
import { Player } from "./player.js";
import { setupMenu } from "./menu.js";

// crée une instance du renderer
const renderer = new Renderer();

// crée l’inventaire du joueur
const inv = new inventory();

// crée le joueur
const player = new Player(renderer.camera);

let currentWorld = null;
let currentWorldName = "";

// canvas & pointer lock
const canvas = renderer.renderer.domElement;
canvas.addEventListener("mousedown", () => canvas.requestPointerLock());
canvas.addEventListener("contextmenu", e => e.preventDefault());

// initialise le menu
setupMenu(renderer);

// helper : calculer spawn (bloc le plus haut à x=0,z=0)
function computeSpawn(world, sx = 0, sz = 0) {
  let maxY = -Infinity;
  for (const k in world.world) {
    const b = world.world[k];
    if (b.userData.x === sx && b.userData.z === sz) {
      if (b.userData.y > maxY) maxY = b.userData.y;
    }
  }
  if (maxY === -Infinity) return { x: sx, y: 3, z: sz };
  return { x: sx, y: maxY + 1, z: sz };
}

// appelée par menu.js après load/create
window.attachCurrentWorldToPlayer = function(name, worldInstance) {
  currentWorldName = name;
  currentWorld = worldInstance;
  player.world = currentWorld;
  player.worldName = name;

  // spawn du joueur
  const spawn = computeSpawn(currentWorld, 0, 0);
  player.camera.position.set(spawn.x, spawn.y + 0.01, spawn.z);
};

// raycast helper (viseur au centre)
const raycaster = new THREE.Raycaster();
function getIntersectedBlockFromCamera() {
  if (!currentWorld) return null;
  const mouse = new THREE.Vector2(0, 0);
  raycaster.setFromCamera(mouse, renderer.camera);
  const intersects = raycaster.intersectObjects(currentWorld.blocks);
  return intersects.length ? intersects[0] : null;
}

// poser / casser
canvas.addEventListener("mousedown", async e => {
  if (!currentWorld) return;
  const it = getIntersectedBlockFromCamera();
  if (!it) return;
  const b = it.object;

  if (e.button === 0) { // gauche -> poser
    const n = it.face.normal;
    const { x, y, z } = b.userData;
    currentWorld.addBlock(x + n.x, y + n.y, z + n.z, inv.getSelectedBlock());
  } else if (e.button === 2) { // droit -> casser
    currentWorld.removeBlock(b.userData.x, b.userData.y, b.userData.z);
  }

  // sauvegarde auto
  if (currentWorldName) {
    try {
      await fetch("/api/worlds/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: currentWorldName, data: currentWorld.toJSON() })
      });
    } catch (err) {
      console.warn("save failed", err);
    }
  }
});

// retour au menu
const menu = document.getElementById("menu");
const backToMenuBtn = document.getElementById("backToMenu");

backToMenuBtn.addEventListener("click", () => {
  if (currentWorld) {
    currentWorld.clear();
    currentWorld = null;
    currentWorldName = "";
  }
  player.world = null;
  player.resetPosition();
  canvas.style.display = "none";
  document.getElementById("ui").style.display = "none";
  menu.style.display = "flex";
});

// boucle d’animation
function animate() {
  requestAnimationFrame(animate);
  if (player.world) player.update();
  renderer.render();
}
animate();
