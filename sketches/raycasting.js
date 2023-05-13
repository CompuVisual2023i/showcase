/***********************************************************RAY*******/
class Ray{
  constructor(pos, angle){
    this.pos = pos;
    this.dir = p5.Vector.fromAngle(angle);
  }
  
  setAngle(angle){
    this.dir = p5.Vector.fromAngle(angle);
  }
  
  
  lookAt(x, y){
    this.dir.x = x - this.pos.x;
    this.dir.y = y - this.pos.y;
    this.dir.normalize();
    
  }
  
  
  show(){
    stroke(255);
    push();
    translate(this.pos.x, this.pos.y);
    line(0, 0, this.dir.x * 10, this.dir.y * 10);
    pop();
  }
  
  cast(wall){
    const x1 = wall.a.x;
    const y1 = wall.a.y;
    const x2 = wall.b.x;
    const y2 = wall.b.y;
    
    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;
    
    const den = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
    if(den == 0){//parallel
      return;
    }
    
    const t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4))/den;
    const u = -((x1-x2)*(y1-y3) - (y1-y2)*(x1-x3))/den;
    
    if(t > 0 && t < 1 && u > 0){
      const pt = createVector();
      pt.x = x1 + t * (x2-x1);
      pt.y = y1 + t * (y2-y1);
      return pt; 
    }else{
      return;
    }
    
    
    
  }
}
/************************************************PLAYER********************/
class Player{
  constructor(){
    this.pos = createVector(100, height/2);
    this.fov = 60;
    this.r = 16;
    this.rayThickness = 0.4
    this.rays = [];
    this.heading = 0;
    this.updateRes(this.rayThickness);
    this.vel = createVector(0, 0);
    this.velMem = null;
  }
  
  move(scl, walls){
     this.vel = p5.Vector.fromAngle(this.heading);
     this.vel.setMag(scl);
     this.collideWithWall(walls, this.pos.x, this.pos.y, this.r);
     this.pos.add(this.vel);
    
     
  }
  
  collideWithWall(walls, cx, cy, cr){
    for(let wall of walls){
          wall.solveCollision(player, cx, cy, cr);
      }
    
  }
  
  
  updateRes(t){
     this.rayThickness = t;
     this.rays = [];
     for(let a = -this.fov / 2; a < this.fov/2; a+=this.rayThickness){
      this.rays.push(new Ray(this.pos, radians(a)+this.heading));
    }
  }

  
  rotate(angle){
    this.heading += angle;
    let index = 0;
    for(let a = -this.fov/2; a < this.fov/2; a+=this.rayThickness){
      this.rays[index].setAngle(radians(a)+this.heading);
      index++;
    }
  }
  
  update(x, y){
      this.pos.set(x, y);
  }
  
  look(walls){
    let scene = [];
    for(let ray of this.rays){
      let closest = null;
      let record = Infinity; 
      let col = null;
      for(let wall of walls){
         const pt = ray.cast(wall);
         if(pt){
           let d = p5.Vector.dist(this.pos, pt);
           const a = ray.dir.heading() - this.heading;
           d *= cos(a);
           if(d < record){
             record = d;
             closest = pt; 
             col = wall.color;
           }
        }
      }
      if(closest){
        stroke(255, 100);
        line(this.pos.x, this.pos.y, closest.x, closest.y);
      }
      scene.push([record, col]);
      
    }
    return scene;
  }
  
  show(){
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r);
    for(let ray of this.rays){
      ray.show();
    }
  }
}

/********************************************BOUNDARY**************/
class Boundary{
  constructor(x1, y1, x2, y2){
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);
    this.m = createVector((x1+x2)/2, (y1+y2)/2);
    this.md = dist(x1, y1, x2, y2)/2;
  
    
    if(this.a.x == this.b.x){
      this.color = [226,135,67];
      this.type = "h";
    }else if(this.a.y == this.b.y){
       this.color = [234,182,118];
       this.type = "v";
    }else{
      this.color = [155, 155, 155];
    }
  }

  
  
  solveCollision(player, cx, cy, cr ){
    let h = dist(this.a.x, this.a.y, cx, cy);
        let wallVect = this.a.copy().sub(this.b.copy());
        let hv = this.a.copy().sub(createVector(cx, cy));
        let a = hv.angleBetween(wallVect);
        let d = h * sin(a);
        let wpmd = dist(this.m.x, this.m.y, cx, cy);
       
        let opv;
        let f = this.isVectorFacingLine(p5.Vector.fromAngle(player.heading), this.a, this.b)
       
        if(abs(d) < cr && wpmd <= this.md && f) {
          //console.log(f);
          
        if(this.type == "h"){
            opv = createVector(0, player.vel.y);
         }else{
           opv = createVector(player.vel.x, 0 );
         }

          player.vel = opv;

        }
    
  }
  
 isVectorFacingLine(v, p1, p2) {
  let lineVec = p5.Vector.sub(p2, p1);
  let lineNormal = lineVec.copy().rotate(HALF_PI).normalize();
  let dotProduct = v.dot(lineNormal);
  return !(dotProduct > 0);
}

  
  show(){
    stroke(255);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}


/*******************************************************MAIN**************/
let ray;
let walls = [];
let player;

let sliderRes;

const sceneW = 400;
const sceneH = 400;
let lastMouseX = 0;

function setup() {
  createCanvas(800, 400);
  focus();
  sliderRes = createSlider(0.1, 10, 0.4, 0.1);
  sliderRes.input(changeRes);
  
    walls.push(new Boundary(50, 50, 250, 50));
    walls.push(new Boundary(50, 100, 250, 100));
    walls.push(new Boundary(50, 100, 50, 200));
  
  
  //walls so light goes everywhere
   walls.push(new Boundary(0, 0, sceneW, 0));
   walls.push(new Boundary(sceneW, 0, sceneW, sceneH));
   walls.push(new Boundary(sceneW, sceneH, 0, sceneH));
   walls.push(new Boundary(0, sceneH, 0, 0));
   walls.push(new Boundary(250, 100, 250, 0));

  player = new Player();
  ray = new Ray(100, 200);
}

function changeRes(){
 // console.log(sliderRes.value());
  player.updateRes(sliderRes.value());
}

function handleKeyInput(){
  if(keyIsDown(65)){
    player.rotate(-0.05);
    
  }else if(keyIsDown(68)){
    player.rotate(0.05);
    
  }else if(keyIsDown(87) || mouseIsPressed){
    player.move(2, walls);
    
  }else if(keyIsDown(83)){
    player.move(-2, walls);
    
  }
}

function handleMouseInput(){
  if(lastMouseX - mouseX > 0){
     player.rotate(-mouseX/5000);
  }else{
    player.rotate(mouseX/5000);
  }
 
  lastMouseX = mouseX; 
}

function mouseMoved(){
 // handleMouseInput();
}


function draw() {
  handleKeyInput();
  background(0);
  for(let wall of walls){
     wall.show();
  }
  //particle.update(mouseX, mouseY);
  player.show();
  scene = player.look(walls);
  //console.log(scene[0]);
  
  push();
  translate(sceneW, 0);
  const w = sceneW/scene.length;
  for(let i = 0; i < scene.length; i++){
    noStroke();
 
    const b = map(scene[i][0], 0, sceneW, 255, 100);
    const h = 20000/scene[i][0];
    fill(scene[i][1][0], scene[i][1][1], scene[i][1][2], b);
    rectMode(CENTER);
    rect(i * w , sceneH/2, w+1, h);
  }
  
  pop();
  
}

















