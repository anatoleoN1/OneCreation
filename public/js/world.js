class World {
  constructor(scene) {
    this.scene = scene;
    this.world = {};
    this.blocks = [];
    this.blockSize = 1;
  }

  makeBlock(type){
    const geo = new THREE.BoxGeometry(this.blockSize,this.blockSize,this.blockSize);
    const mat = new THREE.MeshLambertMaterial({map:textures[type]||textures.dirt});
    return new THREE.Mesh(geo, mat);
  }

  addBlock(x,y,z,type="dirt"){
    const mesh = this.makeBlock(type);
    mesh.position.set(
      x*this.blockSize + 0.5,
      y*this.blockSize + 0.5,
      z*this.blockSize + 0.5
    );
    mesh.userData = {x,y,z,type};
    this.scene.add(mesh);
    this.world[key(x,y,z)] = mesh;
    this.blocks.push(mesh);
  }

  removeBlock(x,y,z){
    const k = key(x,y,z);
    const m = this.world[k];
    if(m){
      this.scene.remove(m);
      delete this.world[k];
      const index = this.blocks.indexOf(m);
      if(index!=-1) this.blocks.splice(index,1);
    }
  }

  generateFlat(size=16){
    for(let x=-size;x<size;x++){
      for(let z=-size;z<size;z++){
        const h = Math.floor(randomNoise(x,z)*3)+1;
        for(let y=0;y<h;y++){
          const type = (y===h-1) ? 'grass':'dirt';
          this.addBlock(x,y,z,type);
        }
        if(Math.random()<0.05) this.addBlock(x,h,z,'wood');
      }
    }
  }
}
