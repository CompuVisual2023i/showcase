# texturas

mezclar datos interpolados de color y texel


{{< p5-global-iframe id="breath" width="600" height="600" >}}
let img;
let tex;
let showTexture = false;

function preload() {
  // Carga la imagen y la textura
  img = loadImage('imagen.jpg');
  tex = loadImage('textura.jpg');
}

function setup() {
  createCanvas(500, 500);
  noLoop();

  // Crea un botón para alternar la visualización de la textura
  let toggleButton = createButton('Mostrar textura');
  toggleButton.mousePressed(toggleTexture);
  toggleButton.position(10, height + 10);
}

function draw() {
  background(0);

  if (showTexture) {
    // Dibuja la imagen modificada con la textura
    imageWithTexture();
  } else {
    // Dibuja la imagen original
    image(img, 0, 0);
  }
}

function imageWithTexture() {
  // Crea una copia de la imagen original
  let tintedImg = createImage(img.width, img.height);
  tintedImg.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);

  // Obtiene los píxeles de la imagen y la textura
  img.loadPixels();
  tex.loadPixels();
  tintedImg.loadPixels();

  // Recorre todos los píxeles de la imagen
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      let index = (x + y * img.width) * 4;

      // Obtiene los componentes de color del píxel de la imagen
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];

      // Obtiene los componentes de color del píxel de la textura
      let texX = map(x, 0, img.width, 0, tex.width);
      let texY = map(y, 0, img.height, 0, tex.height);
      let texIndex = (int(texX) + int(texY) * tex.width) * 4;
      let texR = tex.pixels[texIndex];
      let texG = tex.pixels[texIndex + 1];
      let texB = tex.pixels[texIndex + 2];

      // Mezcla los componentes de color de la imagen y la textura
      let mixedR = lerp(r, texR, 0.5);
      let mixedG = lerp(g, texG, 0.5);
      let mixedB = lerp(b, texB, 0.5);

      // Asigna los nuevos componentes de color al píxel de la imagen
      tintedImg.pixels[index] = mixedR;
      tintedImg.pixels[index + 1] = mixedG;
      tintedImg.pixels[index + 2] = mixedB;
    }
  }

  // Actualiza los cambios en la imagen modificada
  tintedImg.updatePixels();

  // Dibuja la imagen modificada
  image(tintedImg, 0, 0);
}

function toggleTexture() {
  showTexture = !showTexture;
  redraw();
}

{{< /p5-global-iframe >}}

 
coloring brightness tools


{{< p5-global-iframe id="breath" width="600" height="600" >}}
let img;
let originalImg;    

function preload() {
  // Carga la imagen
  img = loadImage('imagen.jpg');
  originalImg = loadImage('imagen.jpg');
}

function setup() {
  createCanvas(500, 500);
  noLoop();

  // Crea botones para las diferentes herramientas
  let hsvButton = createButton('Valor (HSV)');
  hsvButton.mousePressed(applyHSV);
  hsvButton.position(10, height + 10);

  let hslButton = createButton('Luminosidad (HSL)');
  hslButton.mousePressed(applyHSL);
  hslButton.position(110, height + 10);

  let averageButton = createButton('Promedio de componentes');
  averageButton.mousePressed(calculateAverage);
  averageButton.position(250, height + 10);

  let resetButton = createButton('reset');
  resetButton.mousePressed(restoreImage);
  resetButton.position(440, height + 10);
}  



function draw() {
  background(0);
  image(img, 0, 0);
}

function applyHSV() {
  img.loadPixels();

  // Recorre todos los píxeles de la imagen
  for (let i = 0; i < img.pixels.length; i += 4) {
    // Convierte el color del píxel a HSV
    let hsv = rgbToHsv(img.pixels[i], img.pixels[i + 1], img.pixels[i + 2]);
    // Actualiza el valor V con el promedio de los componentes RGB
    hsv.v = (img.pixels[i] + img.pixels[i + 1] + img.pixels[i + 2]) / 3;
    // Convierte el color de nuevo a RGB y actualiza los píxeles
    let rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    img.pixels[i] = rgb.r;
    img.pixels[i + 1] = rgb.g;
    img.pixels[i + 2] = rgb.b;
  }

  img.updatePixels();
  redraw();
}

function applyHSL() {
  img.loadPixels();

  // Recorre todos los píxeles de la imagen
  for (let i = 0; i < img.pixels.length; i += 4) {
    // Convierte el color del píxel a HSL
    let hsl = rgbToHsl(img.pixels[i], img.pixels[i + 1], img.pixels[i + 2]);
    // Actualiza la luminosidad L con el promedio de los componentes RGB
    hsl.l = (img.pixels[i] + img.pixels[i + 1] + img.pixels[i + 2]) / (3 * 255);
    // Convierte el color de nuevo a RGB y actualiza los píxeles
    let rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    img.pixels[i] = rgb.r;
    img.pixels[i + 1] = rgb.g;
    img.pixels[i + 2] = rgb.b;
  }

  img.updatePixels();
  redraw();
}

function calculateAverage() {
  img.loadPixels();

  // Calcula el promedio de los componentes RGB de la imagen
  let totalR = 0;
  let totalG = 0;
  let totalB = 0;

  // Recorre todos los píxeles de la imagen y suma los componentes RGB
  for (let i = 0; i < img.pixels.length; i += 4) {
    totalR += img.pixels[i];
    totalG += img.pixels[i + 1];
    totalB += img.pixels[i + 2];
  }

  // Calcula el promedio dividiendo por la cantidad de píxeles
  let avgR = totalR / (img.width * img.height);
  let avgG = totalG / (img.width * img.height);
  let avgB = totalB / (img.width * img.height);

  // Actualiza todos los píxeles con el promedio de los componentes
  for (let i = 0; i < img.pixels.length; i += 4) {
    img.pixels[i] = avgR;
    img.pixels[i + 1] = avgG;
    img.pixels[i + 2] = avgB;
  }

  img.updatePixels();
  redraw();
}

// Función para convertir RGB a HSV
function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h, s, v = max;

  let d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // grayscale
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: h,
    s: s,
    v: v
  };
}

// Función para convertir HSV a RGB
function hsvToRgb(h, s, v) {
  let r, g, b;

  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  return {
    r: Math.floor(r * 255),
    g: Math.floor(g * 255),
    b: Math.floor(b * 255)
  };
}

// Función para convertir RGB a HSL
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // grayscale
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: h,
    s: s,
    l: l
  };
}

// Función para convertir HSL a RGB
function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // grayscale
  } else {
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;

    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.floor(r * 255),
    g: Math.floor(g * 255),
    b: Math.floor(b * 255)
  };
}

// Función auxiliar para calcular el componente RGB en base al valor de hue en HSL
function hueToRgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function restoreImage() {
  // Restaura la imagen original
  img = originalImg.get();
  redraw(); 
}

{{< /p5-global-iframe >}}