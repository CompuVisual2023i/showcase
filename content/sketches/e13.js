let img;
let select;
let canvas;
let currentMatrix;//global current convoluted matrix (not used)
let brightness;
let colorSelect;
let brightnessVal = 0;
let tempMatrix;//save original pic colors
let tempMatrix2;//save original pic without convolution 
let isNewImage = false;
let button;//download button



function preload(){
  img = loadImage('/showcase/sketches/billi.jpg');//default image
}

//****************** MY FUNCTIONS *************************

function getKernel(kernelName){
   //blur image
  if(kernelName === "gblur"){
    kernel = [[1/256, 4/256, 6/256, 4/256, 1/256],
              [4/256, 16/256, 24/256, 16/256, 4/256],
              [6/256, 24/256, 36/256, 24/256, 6/256],
              [4/256, 16/256, 24/256, 16/256, 4/256],
              [1/256, 4/256, 6/256, 4/256, 1/256],
             ];
    return kernel;
  }
  //blur image
  if(kernelName === "blur"){
    kernel = [[1/9, 1/9, 1/9],
              [1/9, 1/9, 1/9],
              [1/9, 1/9, 1/9],
             ];
    return kernel;
  }
  
   //edge detection
   if(kernelName === "edge"){
    kernel = [[-1, -1, -1],
              [-1,  8, -1],
              [-1, -1, -1],
             ];
    return kernel;
  }
  
  //sharpen
   if(kernelName === "sharp"){
    kernel = [[0, -1, 0],
              [-1, 5, -1],
              [0, -1, 0],
             ];
    return kernel;
  }
  
  //emboss
   if(kernelName === "emboss"){
    kernel = [[-2, -1, 0],
              [-1, 1, 1],
              [0, 1, 2],
             ];
    return kernel;
  }
  
  //left sobel
   if(kernelName === "lsobel"){
    kernel = [[1, 0, -1],
              [2, 0, -2],
              [1, 0, -1],
             ];
    return kernel;
  }
   //right sobel
   if(kernelName === "rsobel"){
    kernel = [[-1, 0, 1],
              [-2, 0, 2],
              [-1, 0, 1],
             ];
    return kernel;
  }
  
   //my kernel
   if(kernelName === "mykernel"){
    kernel = [[-2, 0, 0],
              [0, 1, 0],
              [1, 1, 1],
             ];
    return kernel;
  }
  
  //do nothing
   if(kernelName === "identity"){
    kernel = [[0, 0, 0],
              [0, 1, 0],
              [0, 0, 0],
             ];
    return kernel;
  }
  
  
}
//convert array of pixels into 2D matrix 
function formatToMatrix(){
   loadPixels();

   //pixel matrix
   let pixelMatrix = [];
   let matrixRow = [];
   for (let i = 0; i <= pixels.length; i += 4) {
        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];
         
        //rgb is a pixel
        matrixRow.push([r,g,b]);//push pixel
        if((i / 4) % (img.width)  == 0 && i > 0){
          pixelMatrix.push(matrixRow); //save row of pixels
          matrixRow = []; //clear
        }
    }
  
  return pixelMatrix;
}

//load data in matrix into p5-pixels and update
function loadMatrixIntoPixels(pm){
   let pixelI = 0;
    for(let i = 0; i < pm.length; i++){
      for(let j = 0; j < pm[i].length; j++){
         pixels[pixelI] = pm[i][j][0];
         pixels[pixelI + 1] = pm[i][j][1];
         pixels[pixelI + 2] = pm[i][j][2];
         pixelI+=4;
      }
      
    }
  currentMatrix = pm;
  updatePixels();
  
}

function applyKernel(matrix, kernelName){
  
    let kernel = getKernel(kernelName);
    let buffer = formatToMatrix();
    let convoluted = performConvolution(matrix,buffer, kernel);
    loadMatrixIntoPixels(convoluted);
}


//change brightness
function changeBrightness(){
  let sign = ( brightness.value() - brightnessVal)/abs(brightnessVal - brightness.value());
  brightnessVal = abs(brightness.value());
  
  for(let i = 0; i < img.height; i++){  
      for(let j = 0; j < img.width; j++){
         //change brightness, all colors by the same ammount
         currentMatrix[i][j][0] += sign * 10;
         currentMatrix[i][j][1] += sign * 10;
         currentMatrix[i][j][2] += sign * 10;
    
        
      }  
    }
  
  loadMatrixIntoPixels(currentMatrix);
 // print(currentMatrix[100][100][0], currentMatrix[100][100][1], currentMatrix[100][100][2])
  
}

//swap colors
function swapColors(){
   let matrix = formatToMatrix();
   let c = colorSelect.selected();
   select.show();
  for(let i = 0; i < img.height; i++){  
      for(let j = 0; j < img.width; j++){
        
         let r = tempMatrix[i][j][0];
         let g = tempMatrix[i][j][1];
         let b = tempMatrix[i][j][2];
         
        
        if(c == "normal"){
         matrix[i][j][0] = r;//red
         matrix[i][j][1] = g;//green
         matrix[i][j][2] = b;//blue
        }
        
        if(c == "swap-r-g"){
         matrix[i][j][0] = g;//red
         matrix[i][j][1] = r;//green
         matrix[i][j][2] = b;//blue
        }
        
        if(c == "swap-r-b"){
         matrix[i][j][0] = b;//red
         matrix[i][j][1] = g;//green
         matrix[i][j][2] = r;//blue
        }
        if(c == "swap-g-b"){
         matrix[i][j][0] = r;//red
         matrix[i][j][1] = b;//green
         matrix[i][j][2] = g;//blue
        }
         if(c == "swap-b-r-g"){
         matrix[i][j][0] = b;//red
         matrix[i][j][1] = r;//green
         matrix[i][j][2] = g;//blue
        }
        
        if(c == "gray-r"){
         matrix[i][j][0] = r;//red
         matrix[i][j][1] = r;//green
         matrix[i][j][2] = r;//blue
        }
        
        if(c == "gray-g"){
         matrix[i][j][0] = g;//red
         matrix[i][j][1] = g;//green
         matrix[i][j][2] = g;//blue
        
        }
        
        if(c == "gray-b"){
         matrix[i][j][0] = b;//red
         matrix[i][j][1] = b;//green
         matrix[i][j][2] = b;//blue
        }
        
        if(c == "boost-r"){
         matrix[i][j][0] = 255;//red
         matrix[i][j][1] = g;//green
         matrix[i][j][2] = b;//blue
        }
        
        if(c == "boost-g"){
         matrix[i][j][0] = r;//red
         matrix[i][j][1] = 255;//green
         matrix[i][j][2] = b;//blue
        }
        
        if(c == "boost-b"){
         matrix[i][j][0] = r;//red
         matrix[i][j][1] = g;//green
         matrix[i][j][2] = 255;//blue
        }

        
      }  
    }
  
  loadMatrixIntoPixels(matrix);
 
  
}

//nxn kernel support :)
function performConvolution(matrix, buffer, kernel){
    for(let i = 1; i < img.height; i++){
      
      if(i + kernel.length - 2 >= img.height) continue;
      
      for(let j = 1; j < img.width; j++){
         let rSum = 0;
         let gSum = 0;
         let bSum = 0;
        
         if(j + kernel.length - 2 >= img.width ) break;
         
        
         for(let ii = 0; ii < kernel.length; ii++){
           for(let jj = 0; jj < kernel.length; jj++){
              rSum += kernel[ii][jj] * matrix[i+ii-1][j+jj-1][0];
              gSum += kernel[ii][jj] * matrix[i+ii-1][j+jj-1][1];
              bSum += kernel[ii][jj] * matrix[i+ii-1][j+jj-1][2];
           }
         }
        
         buffer[i][j][0] = rSum;
         buffer[i][j][1] = gSum;
         buffer[i][j][2] = bSum;
      
      }
     
      
    }
  currentMatrix = buffer;
  return buffer;
  
}


//upload file from computer
function handleFile(file) {
  
  if (file.type === 'image') {
    uimg = createImg(file.data, '');
    uimg.hide();
    
    //transform html object into image
    let imgSrc = uimg.attribute("src");
    img = loadImage(imgSrc, onImageLoaded);
    
    
  }
}

//do when the image is finished loading
function onImageLoaded(){
  isNewImage = true;
  initialize();
  //run filter so image is loaded into the img variable
  select.selected("identity");
  colorSelect.selected("normal");
  runFilter("identity");
  //save new picture colors
  tempMatrix = formatToMatrix();
  tempMatrix2 = formatToMatrix();
  //dont show convolution and brightness yet
  select.hide();
  brightness.hide();
  

 
}

//create GUI
function createGUI(){
  //select kernel
  select = createSelect();
  select.position(100, 0);
  select.option("normal");
  select.option("emboss");
  select.option("mykernel");
  select.option("sharp");
  select.option("blur");
  select.option("gblur");
  select.option("edge");
  select.option("lsobel");
  select.option("rsobel");
  select.option("identity");
  select.changed(onSelected);
  
  //select to swap colors
  colorSelect = createSelect();
  colorSelect.position(0, 0);
  colorSelect.option("normal");
  colorSelect.option("swap-r-g");
  colorSelect.option("swap-r-b");
  colorSelect.option("swap-g-b");
  colorSelect.option("swap-b-r-g");
  colorSelect.option("gray-r");
  colorSelect.option("gray-g");
  colorSelect.option("gray-b");
  colorSelect.option("boost-r");
  colorSelect.option("boost-g");
  colorSelect.option("boost-b");
  colorSelect.changed(swapColors);
  
  
  //handle file input
  input = createFileInput(handleFile);
  input.position(450, 0);
  //save button
  button = createButton('Download');
  button.position(340, 0);
  button.mousePressed(saveWork);
  
  //slider for brightness
  brightness = createSlider(100, 400, 250, 5);
  brightness.position(200, 0);
  brightness.input(changeBrightness);
  
  
  
}

function runFilter(kernelName){
 // clear();
  background(255);
  image(img, 0, 0);
  if(!isNewImage){
    //allow to keep previous effect 
     updatePixels();
    
  }else{
     isNewImage = false;
  }
  let matrix = formatToMatrix();
  applyKernel(matrix, kernelName);
}

function initialize(){
    canvas = createCanvas(img.width, img.height);
    //dont show convolution, brightness and download yet
    select.hide();
    brightness.hide();
    button.hide();
    colorMode(RGB, 255); 
    image(img, 0, 0);
}


//******* MY EVENTS **************************************************
function onSelected(){
  brightness.show();
  button.show();//show download button
  let item = select.value();
  if(item === "normal")
    loadMatrixIntoPixels(tempMatrix2);
  else
    runFilter(item);
}

function saveWork() {
 saveCanvas(canvas,"visualCompOutput", 'jpg');
}



//******************* MAIN ********************************

function setup() {
    createGUI();
    initialize();
    tempMatrix = formatToMatrix();
    tempMatrix2 = formatToMatrix();
    select.selected("identity");
    runFilter("identity");
   
    
}

function draw() {

  //event based only
}

