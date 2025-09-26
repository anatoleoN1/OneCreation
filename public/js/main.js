const renderer=new Renderer();
const world=new World(renderer.scene);
world.generateFlat();

const player=new Player(renderer.camera,world);
const inventory=new Inventory();

const raycaster=new THREE.Raycaster();
const mouse=new THREE.Vector2();

function getIntersectedBlock(){
  mouse.x=0; mouse.y=0; // pointer lock center
  raycaster.setFromCamera(mouse,renderer.camera);
  const intersects=raycaster.intersectObjects(Object.values(world.world));
  return intersects.length?intersects[0]:null;
}

renderer.renderer.domElement.addEventListener("mousedown",e=>{
  if(e.button===0){ // placer bloc
    const it=getIntersectedBlock();
    if(it){
      const n=it.face.normal;
      const {x,y,z}=it.object.userData;
      world.addBlock(x+n.x,y+n.y,z+n.z,inventory.getSelectedBlock());
    }
  }
});

renderer.renderer.domElement.addEventListener("contextmenu",e=>{
  e.preventDefault();
  const it=getIntersectedBlock();
  if(it){
    const {x,y,z}=it.object.userData;
    world.removeBlock(x,y,z);
  }
});

function animate(){
  requestAnimationFrame(animate);
  player.update();
  renderer.render();
}
animate();
