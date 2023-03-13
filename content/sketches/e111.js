let cols, rows;
let scl = 30;
let w = 1300;//1700
let h = 1300;//1300

let terrain = [];
let water = [];
let flying = 0;
let flyingw = 0;
let currentFPS = 0;
let customFont;
let ml = -200;
let mh = 250;
let wl = -20;
let wh = 20;
let flySpeed = 0.04;
let xoffVal = 0.08;//0.08
let yoffVal = 0.04;//0.04
let waterLevel = -200;
let mountainPeak = 90;
let camAngle =  3.1416/3;
let angleMax =  3.1416/2.8;
let sideViewAngle = 0;
let isStroke = false;
let slider1;
let slider2;
let slider3;
let checkbox;
let checkbox2;
let pg;

function preload() {
  customFont = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf');
  
}

function setup() {
  createCanvas(600, 600, WEBGL);
  initialize();
 
 

  
}



function initialize(){
   cols = w / scl;
  rows = h / scl;
  
  //create array for terrain
  for(let y = 0; y < rows; y++){
    let xTemp = [];
    for(let x = 0; x < cols; x++){
      xTemp.push(0);
    } 
    terrain.push(xTemp);
  }
  
   //create array for water
  for(let y = 0; y < rows; y++){
    let xTemp = [];
    for(let x = 0; x < cols; x++){
      xTemp.push(0);
    } 
    water.push(xTemp);
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
      xoff +=0.04;//xoffVal;
    }
    yoff += yoffVal; 
  }
  
  //water animation
 flyingw  -= slider3.value()/1000;
   yoff = flyingw;
  //init terrain Zs
  for(let y = 0; y < rows; y++){
    let xoff = 0;
    for(let x = 0; x < cols; x++){
      water[y][x] = map(noise(xoff, yoff), 0, 1, wl, wh);
      xoff +=0.08 ;//xoffVal;
    }
    yoff += 0.04; 
  }

  
  noStroke();
  //stroke(0,255,0);
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
      
      if(isStroke){
         stroke(0, 255, 0);
      }
      vertex(x*scl, y*scl, z);
      vertex(x*scl, (y+1)*scl, terrain[y+1][x]);
    }
    endShape();
  }
  
  // draw water
  
  fill(94, 138, 214);
  //noStroke();
  for(let y = 0; y < rows - 1; y++){
    beginShape(TRIANGLE_STRIP);
    for(let x = 0; x < cols; x++){
      let z = water[y][x];
      
      if(z > waterLevel){
        fill(0, 
             map(z, wl, wh, 0, 200),
             map(z, wl, wh, 0, 200));
      } else {
        
      }
      vertex(x*scl, y*scl, z + slider2.value());
      vertex(x*scl, (y+1)*scl, water[y+1][x] + slider2.value());
    }
    endShape();
  }
  
  
  updateControlls();
}






// util
function drawFPS(){
  fill(255);
  text("FPS:" + getFrameRate().toFixed(0), -300, -260);
}

//controll camera angle
function updateControlls(){
  //camera Y
 camAngle =  3.1416/(mouseY/100);
  if(camAngle > angleMax){
    camAngle = angleMax;
  }
  
}


//camara z for checkbox
function changeView(){
     if(sideViewAngle == 0){
        sideViewAngle = PI/2;
     }else{
       sideViewAngle = 0;
     }
  
  
 
}

//stroke for checkbox
function doStroke(){
     if(isStroke){
        isStroke = false;
     }else{
       noStroke();
       isStroke = true;
     }
       
}

//create GUI
function createGUI(){
  
  //display
  textSize(14);
  textFont(customFont);
  
 //slider 1 velocity
  slider1 = createSlider(-100, 100, 0);
  slider1.position(0, -100);
  slider1.style('width', '80px');
  //slider 2 water level
  slider2 = createSlider(-100, 100, 20);
  slider2.position(200, 10);
  slider2.style('width', '80px')
  //slider 3 terrain type
  slider3 = createSlider(0, 100, 5);
  slider3.position(300, 10);
  slider3.style('width', '80px')
  
  //checkbox view
  checkbox = createCheckbox('cambiar vista lateral', false);
  checkbox.changed(changeView);
  checkbox.position(10, 50); 
  
  //checkbox stroke
  checkbox = createCheckbox('dibujar líneas', false);
  checkbox.changed(doStroke);
  checkbox.position(10, 80); 
}



