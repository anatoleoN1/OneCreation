class Player {
  constructor(camera, world) {
    this.camera = camera;
    this.world = world;
    this.speed = 0.1;
    this.jumpStrength = 0.2;
    this.velocityY = 0;
    this.onGround = false;

    this.keys = {};
    document.addEventListener("keydown", e => this.keys[e.code] = true);
    document.addEventListener("keyup", e => this.keys[e.code] = false);

    // Rotation caméra
    this.yaw = 0;
    this.pitch = 0;
    this.onMouseMove = this.onMouseMove.bind(this);

    // Pointer lock
    const canvas = document.querySelector("canvas");
    canvas.addEventListener("click", () => canvas.requestPointerLock());
    document.addEventListener("pointerlockchange", () => {
      if (document.pointerLockElement === canvas) {
        document.addEventListener("mousemove", this.onMouseMove);
      } else {
        document.removeEventListener("mousemove", this.onMouseMove);
      }
    });
  }

  onMouseMove(e) {
    const sensitivity = 0.002;
    this.yaw -= e.movementX * sensitivity;
    this.pitch -= e.movementY * sensitivity;
    this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));
    this.camera.rotation.set(this.pitch, this.yaw, 0, "YXZ");
  }

  update() {
    // --- Mouvement horizontal ---
    let forward = 0, right = 0;
    if (this.keys["KeyS"]) forward += 1;
    if (this.keys["KeyW"]) forward -= 1;
    if (this.keys["KeyD"]) right += 1;
    if (this.keys["KeyA"]) right -= 1;

    const dx = Math.sin(this.yaw) * forward + Math.cos(this.yaw) * right;
    const dz = Math.cos(this.yaw) * forward - Math.sin(this.yaw) * right;

    let newPos = this.camera.position.clone();
    newPos.x += dx * this.speed;
    newPos.z += dz * this.speed;

    // --- Collision horizontale ---
    const playerBoxH = new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(newPos.x, this.camera.position.y - 1 + 1, newPos.z), // centre vertical = pied + 1 bloc
        new THREE.Vector3(0.6, 2, 0.6) // hitbox 2 blocs
    );

    let collisionH = false;
    for (const block of this.world.blocks) {
        const blockBox = new THREE.Box3().setFromObject(block);
        if (playerBoxH.intersectsBox(blockBox)) {
            collisionH = true;
            break;
        }
    }

    if (!collisionH) {
        this.camera.position.x = newPos.x;
        this.camera.position.z = newPos.z;
    }

    // --- Gravité et collision verticale ---
    this.velocityY -= 0.01; // gravité
    let newY = this.camera.position.y + this.velocityY;

    const playerBoxV = new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(this.camera.position.x, newY - 1 + 1, this.camera.position.z),
        new THREE.Vector3(0.6, 2, 0.6)
    );

    let onGround = false;
    for (const block of this.world.blocks) {
        const blockBox = new THREE.Box3().setFromObject(block);

        // Collision pieds (correction douce)
        const targetY = blockBox.max.y + 2; // caméra = tête
        const deltaY = targetY - newY;
        const maxStep = 0.05; // déplacement vertical max par frame

        if (
            deltaY > 0 &&
            playerBoxV.min.x < blockBox.max.x &&
            playerBoxV.max.x > blockBox.min.x &&
            playerBoxV.min.z < blockBox.max.z &&
            playerBoxV.max.z > blockBox.min.z
        ) {
            newY += Math.min(deltaY, maxStep); // correction progressive
            this.velocityY = 0;
            onGround = true;
        }

        // Collision tête
        if (
            playerBoxV.max.y >= blockBox.min.y &&
            playerBoxV.min.y < blockBox.min.y &&
            playerBoxV.max.x > blockBox.min.x &&
            playerBoxV.min.x < blockBox.max.x &&
            playerBoxV.max.z > blockBox.min.z &&
            playerBoxV.min.z < blockBox.max.z
        ) {
            newY = blockBox.min.y;
            this.velocityY = 0;
        }
    }

    this.camera.position.y = newY;
    this.onGround = onGround;

    // --- Saut ---
    if (this.keys["Space"] && this.onGround) {
        this.velocityY = this.jumpStrength;
        this.onGround = false;
    }
}

}
