const loader = new THREE.TextureLoader();
const textures = {
  dirt: loader.load("assets/textures/dirt.png"),
  grass: loader.load("assets/textures/grass.png"),
  wood: loader.load("assets/textures/wood.png"),
  stone: loader.load("assets/textures/stone.png")
};

class Renderer {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
    this.camera.position.set(0,6,10);

    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.renderer.setSize(innerWidth, innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff,0.9);
    light.position.set(10,20,10);
    this.scene.add(light);
    this.scene.add(new THREE.AmbientLight(0xffffff,0.4));

    window.addEventListener("resize", ()=>{
      this.camera.aspect = innerWidth/innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
