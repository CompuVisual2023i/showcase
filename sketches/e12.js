

//*********************GLOBALS*********************************
let objects = [];
let scl = 3;


//MY OBJECTS*****************************************
class Shape{
  
  constructor(type, scale){
    this.shape = null;
    this.scale = scale;
    this.type = type;
    this.w = null;
    this.h = null;
    
        this.w = 1.5 * this.scale;
        this.h = 1.0 * this.scale;
      
    
  }
  
  getShape(){
    return this.shape;
  }
  
  getType(){
    return this.type;
  }
  
}

class Object2D{
  
  constructor(pos, myColor, velocity, scale, shape){
    this.pos = pos;
    this.color = myColor;
    this.velocity = velocity;
    this.scale = scale;
    this.shape = shape;
    this.shape = new Shape(shape, this.scale);
  }
  
  getVelocity(){
    return this.velocity;
  }
  
  update(){
    
    if(mouseIsPressed){
      if(mouseX > width/2){
         this.pos.x += this.velocity;
      }else if(mouseX < width/2 ){
         this.pos.x -= this.velocity;
      }
      
       if(mouseY > height/2){
         this.pos.y += this.velocity;
      }else if(mouseX < width/2 ){
         this.pos.y -= this.velocity;
      }
    }
  }
  
  draw(){
    if(this.shape.getType() == "r"){
       fill(myColor.r, myColor.g, myColor.b, myColor.t);
       rect(this.pos.x, this.pos.y, this.shape.w * scl, this.shape.h * scl);
    }
    
     if(this.shape.getType() == "c"){
       fill(myColor.r, myColor.g, myColor.b, myColor.t);
       circle(this.pos.x, this.pos.y, this.shape.w * scl);
    }
    
  }
  
}


//*********************MY FUNCTIONS****************************

function createPerspective(){
  let referenceDistance = 1;
  let referenceVelocity = 50; 
   //create objects
  for(let i = 0; i < 20; i++){
     pos = {x:mouseX, y:mouseY};
     myColor = {r:0, g:10*i, b:0, t:20};
    
    //calculate scale from a distance
    let referenceScale = 400;
    let observerDistance = referenceDistance*i;
    let apparentSize = referenceScale / (observerDistance * referenceDistance);
    let velocity = referenceVelocity/observerDistance;
    
    
    //pos, color, velocity, scale, shape
    ob = new Object2D(pos, myColor, velocity, apparentSize, "r");
    objects.push(ob);
  
    
  }
}


function mouseWheel(event) {
  scl += event.delta/1000;
  //uncomment to block page scrolling
  return false;
}

function doubleClicked() {
  createPerspective();
}


//***************************MAIN***********************************
function setup() {
  createCanvas(600, 600);
  createPerspective(); 

  

}


function draw() {
  background(100);
  rectMode(CENTER);
  
  for(let i = 0; i < objects.length; i++){
    objects[i].update();
    objects[i].draw();
  }
  
 
}




