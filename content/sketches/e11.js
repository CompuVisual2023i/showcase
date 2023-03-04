let cols, rows;
let scl = 30;
let w = 1300;//1700
let h = 1300;//1300

let terrain = [];
let flying = 0;
let currentFPS = 0;
let customFont;
let ml = -200;
let mh = 250;
let flySpeed = 0.04;
let xoffVal = 0.08;
let yoffVal = 0.04;
let waterLevel = -200;
let mountainPeak = 90;
let camAngle =  3.1416/3;
let angleMax =  3.1416/2.8;
let sideViewAngle = 0;
let slider1;
let slider2;
let checkbox;

function preload() {
  customFont = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf');
  
}

function setup() {
  createCanvas(600, 600, WEBGL);
 
  cols = w / scl;
  rows = h / scl;
  
  //create array
  for(let y = 0; y < rows; y++){
    let xTemp = [];
    for(let x = 0; x < cols; x++){
      xTemp.push(0);
    } 
    terrain.push(xTemp);
  }


  
  createGUI();

  
}

function draw() {
  background(185, 210, 250); // end color
  translate(0, 0, 0);

  
  //display
  drawFPS();
  
  flying  -= slider1.value()/1000;
  let yoff = flying;
  //init terrain Zs
  for(let y = 0; y < rows; y++){
    let xoff = 0;
    for(let x = 0; x < cols; x++){
      terrain[y][x] = map(noise(xoff, yoff), 0, 1, ml, mh);
      xoff += xoffVal;
    }
    yoff += yoffVal; 
  }

  //stroke(0, 255, 0);
  
  noStroke();
  rotateX(camAngle);
  rotateZ(sideViewAngle);
  

  
  translate(-w/2, -h/2);
  
  // draw mountains
  for(let y = 0; y < rows - 1; y++){
    beginShape(TRIANGLE_STRIP);
    for(let x = 0; x < cols; x++){
      let z = terrain[y][x];
      
      if(z > waterLevel){
        fill(map(z, ml, mh, 0, 180), 
             map(z, ml, mh, 0, 255),
             0);
      } else {
        fill(94, 138, 214);
      }
      
      if(z > mountainPeak){
        fill(255);
      }
      
      
      vertex(x*scl, y*scl, z);
      vertex(x*scl, (y+1)*scl, terrain[y+1][x]);
    }
    endShape();
  }
  
  // draw water
  fill(94, 138, 214);
  for(let y = 0; y < rows - 1; y++){
    beginShape(TRIANGLE_STRIP);
    for(let x = 0; x < cols; x++){
      vertex(x*scl, y*scl, -slider2.value());
      vertex(x*scl, (y+1)*scl, -slider2.value());
    }
    endShape();
  }
  
  
  updateControlls();
}



// util
function drawFPS(){
  fill(255);
  text("FPS:" + getFrameRate().toFixed(0), -300, -270);
}

//controll camera angle
function updateControlls(){
  //camera Y
 camAngle =  3.1416/(mouseY/100);
  if(camAngle > angleMax){
    camAngle = angleMax;
  }
  
}


//camara z
function changeView(){
     if(sideViewAngle == 0){
        sideViewAngle = PI/2;
     }else{
       sideViewAngle = 0;
     }
       
}

//create GUI
function createGUI(){
  
  //display
  textSize(14);
  textFont(customFont);
  
 //slider 1 velocity
  slider1 = createSlider(-100, 100, 20);
  slider1.position(10, 10);
  slider1.style('width', '80px');
  //slider 2 water level
  slider2 = createSlider(-100, 100, 20);
  slider2.position(200, 10);
  slider2.style('width', '80px')
  
  //checkbox
  checkbox = createCheckbox('cambiar vista lateral', false);
  checkbox.changed(changeView);
  checkbox.position(10, 50); 
}

//controll fly speed
/*function mouseWheel(event) {
   flySpeed += event.delta/10000;
  if(flySpeed > 0.1 || flySpeed < -0.1){
    flySpeed = 0.1;
  }
  //move the square according to the vertical scroll amount
  
}*/


