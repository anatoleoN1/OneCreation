// world.js
import { textures } from "./renderer.js"; // assure-toi que textures est exporté depuis renderer.js
import { key } from "./utils.js";

export class World {
  constructor(scene) {
    this.scene = scene;
    this.world = {};
    this.blocks = [];
    this.blockSize = 1;
    this.name = "";
  }

  makeBlock(type) {
    const tex = textures[type] || textures.dirt;
    if (!tex) {
      console.warn("Texture introuvable pour type:", type);
      return null;
    }
    const geo = new THREE.BoxGeometry(this.blockSize, this.blockSize, this.blockSize);
    const mat = new THREE.MeshLambertMaterial({ map: tex, color: 0xffffff });
    return new THREE.Mesh(geo, mat);
  }

  addBlock(x, y, z, type = "dirt") {
    const mesh = this.makeBlock(type);
    if (!mesh) return;

    mesh.position.set(
      x * this.blockSize + 0.5,
      y * this.blockSize + 0.5,
      z * this.blockSize + 0.5
    );
    mesh.userData = { x, y, z, type };

    this.scene.add(mesh);
    this.world[key(x, y, z)] = mesh;
    this.blocks.push(mesh);
    return mesh;
  }

  removeBlock(x, y, z) {
    const k = key(x, y, z);
    const m = this.world[k];
    if (m) {
      this.scene.remove(m);
      delete this.world[k];
      const idx = this.blocks.indexOf(m);
      if (idx !== -1) this.blocks.splice(idx, 1);
    }
  }

  generateFlat(size = 16) {
    for (let x = -size; x < size; x++) {
      for (let z = -size; z < size; z++) {
        this.addBlock(x, 0, z, "stone");
        this.addBlock(x, 1, z, "dirt");
        this.addBlock(x, 2, z, "grass");

        if (Math.random() < 0.05) {
          const wx = x, wz = z;
          for (let wy = 3; wy < 6; wy++) this.addBlock(wx, wy, wz, "wood");
          const top = 5;
          [[0,0],[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]].forEach(([dx,dz])=>{
            this.addBlock(wx+dx, top, wz+dz, "leaves");
          });
        }
      }
    }
  }

  clear() {
    for (const k in this.world) {
      const b = this.world[k];
      if (b && b.isMesh) this.scene.remove(b);
    }
    this.world = {};
    this.blocks = [];
  }

  toJSON() {
    const data = [];
    for (const k in this.world) {
      const b = this.world[k];
      if (b && b.userData) data.push({ x: b.userData.x, y: b.userData.y, z: b.userData.z, type: b.userData.type });
    }
    return data;
  }

  fromJSON(data) {
    this.clear();
    data.forEach(b => this.addBlock(b.x, b.y, b.z, b.type));
  }
}
