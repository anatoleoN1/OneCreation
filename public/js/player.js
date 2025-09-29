// player.js
export class Player {
  constructor(camera) {
    this.camera = camera;
    this.world = null;
    this.worldName = "";
    this.speed = 0.12;
    this.jumpStrength = 0.25;
    this.velocityY = 0;
    this.onGround = false;
    this.keys = {};
    this.yaw = 0;
    this.pitch = 0;

    document.addEventListener("keydown", e => this.keys[e.code] = true);
    document.addEventListener("keyup", e => this.keys[e.code] = false);

    this.onMouseMove = this.onMouseMove.bind(this);

    const canvas = document.querySelector("canvas");
    canvas.addEventListener("click", () => canvas.requestPointerLock());
    document.addEventListener("pointerlockchange", () => {
      if (document.pointerLockElement === canvas) {
        document.addEventListener("mousemove", this.onMouseMove);
      } else {
        document.removeEventListener("mousemove", this.onMouseMove);
      }
    });

    // position initiale
    this.camera.position.set(0, 1.6, 0);
  }

  onMouseMove(e) {
    const sensitivity = 0.002;
    this.yaw -= e.movementX * sensitivity;
    this.pitch -= e.movementY * sensitivity;
    this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));
    this.camera.rotation.set(this.pitch, this.yaw, 0, "YXZ");
  }

  update() {
    if (!this.world) return;

    // déplacement horizontal
    let forward = 0, right = 0;
    if (this.keys["KeyS"] || this.keys["ArrowDown"]) forward += 1;
    if (this.keys["KeyW"] || this.keys["ArrowUp"]) forward -= 1;
    if (this.keys["KeyD"] || this.keys["ArrowRight"]) right += 1;
    if (this.keys["KeyA"] || this.keys["ArrowLeft"]) right -= 1;

    const dx = Math.sin(this.yaw) * forward + Math.cos(this.yaw) * right;
    const dz = Math.cos(this.yaw) * forward - Math.sin(this.yaw) * right;

    const newPos = this.camera.position.clone();
    newPos.x += dx * this.speed;
    newPos.z += dz * this.speed;

    // hitbox horizontal
    const moveBox = new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(newPos.x, this.camera.position.y - 0.9, newPos.z),
      new THREE.Vector3(0.6, 0.4, 0.6)
    );

    let collision = false;
    for (const b of this.world.blocks) {
      const blockBox = new THREE.Box3().setFromObject(b);
      if (moveBox.intersectsBox(blockBox)) { collision = true; break; }
    }

    if (!collision) {
      this.camera.position.x = newPos.x;
      this.camera.position.z = newPos.z;
    }

    // gravité
    this.velocityY -= 0.015;
    let newY = this.camera.position.y + this.velocityY;

    const verticalBox = new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(this.camera.position.x, newY - 0.9, this.camera.position.z),
      new THREE.Vector3(0.6, 1.8, 0.6)
    );

    let yCollision = false;
    for (const b of this.world.blocks) {
      const blockBox = new THREE.Box3().setFromObject(b);
      if (verticalBox.intersectsBox(blockBox)) {
        yCollision = true;
        if (this.velocityY < 0) {
          this.onGround = true;
          this.velocityY = 0;
          newY = blockBox.max.y + 1.6;
        } else {
          this.velocityY = 0;
        }
        break;
      }
    }
    if (!yCollision) this.onGround = false;
    this.camera.position.y = newY;

    // saut
    if ((this.keys["Space"] || this.keys["KeyX"]) && this.onGround) {
      this.velocityY = this.jumpStrength;
      this.onGround = false;
    }

    // sauvegarde auto
    localStorage.setItem("player_" + this.worldName, JSON.stringify({
      x: this.camera.position.x,
      y: this.camera.position.y,
      z: this.camera.position.z,
      yaw: this.yaw,
      pitch: this.pitch
    }));
  }

  resetPosition() {
    this.camera.position.set(0, 1.6, 0);
    this.velocityY = 0;
    this.yaw = 0;
    this.pitch = 0;
    this.camera.rotation.set(0, 0, 0);
    localStorage.removeItem("player_" + this.worldName);
  }
}
