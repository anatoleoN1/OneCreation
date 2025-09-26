export class inventory {
  constructor() {
    this.slots = ["stone","dirt","grass","wood","leaves"];
    this.selected = 0;
    this.ui = document.getElementById("hotbar");
    this.renderUI();

    window.addEventListener("wheel", e=>{
      if(e.deltaY>0) this.selected=(this.selected+1)%this.slots.length;
      else this.selected=(this.selected-1+this.slots.length)%this.slots.length;
      this.renderUI();
    });
  }

  renderUI() {
    this.ui.innerHTML="";
    this.slots.forEach((s,i)=>{
      const div=document.createElement("div");
      div.style.borderColor = (i===this.selected) ? "yellow":"white";
      div.title=s;
      this.ui.appendChild(div);
    });
  }

  getSelectedBlock() { return this.slots[this.selected]; }
}
