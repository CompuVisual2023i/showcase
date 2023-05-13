
let shaderProgram;
let vertSrc;
let fragSrc;
let colorPicker1;
let colorPicker2;
let color1 =  '#A7B0EA';
let color2 =  '#CD7A3E';
let brightnessSlider;
let blendModeRadio;

//load vertex and frag shaders
function preload() {
  loadStrings('/showcase/sketches/geo.vert', function(data) {
    vertSrc = data.join('\n');
  });

  loadStrings('/showcase/sketches/blend.frag', function(data) {
    fragSrc = data.join('\n');
  });
}

function setup() {  
  createCanvas(400, 400, WEBGL);
  
  shaderProgram = createShader(vertSrc, fragSrc);
  
  colorPicker1 = createColorPicker(color1);
  colorPicker1.position(20, 20);
  colorPicker2 = createColorPicker(color2);
  colorPicker2.position(200, 20);
    
  brightnessSlider = createSlider(0, 1, 0.5, 0.1);
  brightnessSlider.position(125, 210);
  
  blendModeRadio = createRadio();
  blendModeRadio.option('Blend'); 
  blendModeRadio.option('Add');
  blendModeRadio.option('Screen');
  blendModeRadio.option('Subtract'); 
  blendModeRadio.style('color','black'); 
  blendModeRadio.selected('Blend');

}

function updateBlend(){
  color1 = colorPicker1.value();
  color2 = colorPicker2.value();
  
  shaderProgram.setUniform('brightness', brightnessSlider.value());
  shaderProgram.setUniform('uMaterial1', hexToVector(color1));
  shaderProgram.setUniform('uMaterial2', hexToVector(color2));
  
  
}

function setBlendMode(mode){
  const bm = blendModeRadio.value();
  if(bm === 'Blend'){
     blendMode(BLEND);
  }else if(bm === 'Add'){
     blendMode(ADD);
  } if(bm === 'Screen'){
     blendMode(SCREEN);
  }if(bm === 'Subtract'){
     blendMode(SUBTRACT);
  }
}

//function by ChatGPT
function hexToVector(hexColor){
  let r = red(hexColor) / 255;
  let g = green(hexColor) / 255;
  let b = blue(hexColor) / 255;

  return [r, g, b, 1.0];

}

function draw() {
  background(100);
  shader(shaderProgram);
  setBlendMode();
  updateBlend(); 
  rect(-75, 30, 150, 150);
  
  resetShader();
  blendMode(BLEND);
  fill(color2)
  rect(20, -150, 150, 150);
  fill(color1);
  rect(-175, -150, 150, 150);
  
}
