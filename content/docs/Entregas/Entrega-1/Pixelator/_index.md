# Pixelador
## Promedio de color

Se realiza un proceso de pixelacion por medio del promedio de color de cada pixel en una matriz cuadrada.

La escala representa el tamaño de esa matriz en pixeles.
{{< p5-instance-div id="video" >}}
    let vid;
    let sc = 1;
    let n;
    let slider;

    p5.preload = function(){
      vid = p5.createVideo('jellyfish.mp4');
    }

    p5.setup = function() {

      p5.createCanvas(640,360);     
      vid.loop();
      vid.hide();
      slider = p5.createSlider(1, 32, 0,1);
      slider.position(10, 250);
      slider.style('width', '100px');   
    }

    p5.draw = function(){      
      p5.background(255);
      p5.image(vid,0,0);      
      p5.loadPixels();
      promedioPixeles();
      p5.updatePixels();
      p5.textSize(28);
      p5.fill(0, 255, 255);
      p5.text('Escala '+ sc, 10, 30);
    }

    promedioPixeles = function(){
      let rp;
      let gp;
      let bp;
      let x = 0;
      let xInicial=0;
      sc = slider.value();
      while(640%sc!=0) sc++;
      n = sc*sc;
      
      while(x<p5.pixels.length){
        rp = 0;
        gp = 0;
        bp = 0;
        x = xInicial;

        for(let j= 0;j<sc;j++){
          for(let k=x;k<x+sc*4;k+=4){
            if (k==(j+1)*vid.width*4) break;
            rp += p5.pixels[k];
            gp += p5.pixels[k + 1];
            bp += p5.pixels[k + 2];
          }
          x+=vid.width*4;
        }
        rp /= n;
        gp /= n;
        bp /= n;

        x = xInicial;
        for(let j= 0;j<sc;j++){
          for(let k=x;k<x+sc*4 ;k+=4){
            if (k==(j+1)*vid.width*4) break;
            p5.pixels[k] = rp;
            p5.pixels[k + 1] = gp;
            p5.pixels[k + 2] = bp;
          }
          x += vid.width*4;
        }
        xInicial += sc*4;
      }   
    }
{{< /p5-instance-div >}}

## Coherencia espacial

{{< p5-instance-div id="video coherencia" >}}
    let vid;
    let sc = 1;
    let n;
    let slider;

    p5.preload = function(){
      vid = p5.createVideo('jellyfish.mp4');
    }

    p5.setup = function() {
       
      p5.createCanvas(640,360);     
      vid.loop();
      vid.hide();
      slider = p5.createSlider(1, 32, 0,1);
      slider.position(10, 695);
      slider.style('width', '100px');   
    }

    p5.draw = function(){      
      p5.background(255);
      p5.image(vid,0,0);      
      p5.loadPixels();
      pixelador();
      p5.updatePixels();
      p5.textSize(28);
      p5.fill(0, 255, 255);
      p5.text('Escala '+ sc, 10, 30);
    }

    pixelador = function(){
      let matriz = [];
      let filaActual = [];
      let ancho = vid.width * 4

      for (let i = 0; i < p5.pixels.length; i++) {
        filaActual.push(p5.pixels[i]);
        if ((i + 1) % ancho  === 0) {
          matriz.push(filaActual);
          filaActual = [];
        }
      }
      let color = p5.random(1,slider.value());
      
      x = xInicial;
        for(let j= 0;j<sc;j++){
          for(let k=x;k<x+sc*4 ;k+=4){
            if (k==(j+1)*vid.width*4) break;
            p5.pixels[k] = colorR;
            p5.pixels[k + 1] = colorG;
            p5.pixels[k + 2] = colorB;
          }
          x += vid.width*4;
        }
        xInicial += sc*4;
    }
{{< /p5-instance-div >}}

# Introducción
# Antecedentes y trabajo previo
# Solución
# Código
# Conslusiones
# Trabajo Futuro
