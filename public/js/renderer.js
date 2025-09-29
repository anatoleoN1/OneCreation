// renderer.js

const loader = new THREE.TextureLoader();

export const textures = {
  dirt: loader.load("assets/textures/dirt.png"),
  grass: loader.load("assets/textures/grass.png"),
  wood: loader.load("assets/textures/wood.png"),
  stone: loader.load("assets/textures/stone.png"),
  leaves: loader.load("assets/textures/leaves.png"),
};

export class renderer {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x9ecfe8, 0.0015);

    this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    this.camera.position.set(0, 3, 5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearAlpha(0);
    this.renderer.setSize(innerWidth, innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.6);
    this.scene.add(hemi);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(50, 100, 50);
    this.scene.add(dirLight);

    window.addEventListener("resize", () => {
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
