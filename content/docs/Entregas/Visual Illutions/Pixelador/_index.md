# Pixelador

# Solución

Se realiza un proceso de pixelacion utilizando el promedio del color de los pixeles de la matriz y por medio de coherencia espacial seleccionando un pixel de manera arbitraria, en este caso el primer pixel de cada sección. Finalmente se cambian todos los pixeles de la matriz por el resultado según el método de pixelacion.

La escala representa el tamaño de la matriz en pixeles.
{{< p5-instance-div id="video" >}}
    let vid;
    let sc = 1;
    let n;
    let slider;

    p5.preload = function(){
      vid = p5.createVideo('jellyfish.mp4');
    }

    p5.setup = function() {

      let cnv = p5.createCanvas(640,360);     
      let x = cnv.position().x;
      let y = cnv.position().y;
      vid.loop();
      vid.hide();
      sel = p5.createSelect();
      sel.option('Promedio de color');
      sel.option('Coherencia espacial');
      sel.selected('Promedio de color');
      sel.changed(mySelectEvent);
      sel.position(10, sel.position().y - 370);
      slider = p5.createSlider(1, 32, 0,1);      
      slider.style('width', '100px'); 
      slider.position(10,slider.position().y - 280);
    }

    p5.draw = function(){      
      p5.background(255);
      p5.image(vid,0,0);      
      p5.loadPixels();
      pixelador();
      p5.updatePixels();
      p5.textSize(28);
      p5.fill(0, 255, 255);
      p5.text('Escala '+ sc, 10, 50);
    }

    mySelectEvent = function(){
      slider.value(1);      
    }

    pixelador = function(){
      let rp;
      let gp;
      let bp;
      let x = 0;
      let xInicial=0;
      sc = slider.value();
      while(640%sc!=0) sc++;
      n = sc*sc;
      let con = 0;

      if (sel.value() == 'Promedio de color')
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
      else
        while(x<p5.pixels.length){
          rp = 0;
          gp = 0;
          bp = 0;
          con = 0;
          x = xInicial;

          for(let j= 0;j<sc;j++){
            rp = p5.pixels[x];
            gp = p5.pixels[x + 1];
            bp = p5.pixels[x + 2];
            x+=vid.width*4;
          }

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



# Código

{{<details "Pixelador">}}
    let vid;
    let sc = 1;
    let n;
    let slider;

    p5.preload = function(){
      vid = p5.createVideo('jellyfish.mp4');
    }

    p5.setup = function() {

      let cnv = p5.createCanvas(640,360);     
      let x = cnv.position().x;
      let y = cnv.position().y;
      vid.loop();
      vid.hide();
      sel = p5.createSelect();
      sel.option('Promedio de color');
      sel.option('Coherencia espacial');
      sel.selected('Promedio de color');
      sel.changed(mySelectEvent);
      sel.position(10, sel.position().y - 370);
      slider = p5.createSlider(1, 32, 0,1);      
      slider.style('width', '100px'); 
      slider.position(10,slider.position().y - 280);
    }

    p5.draw = function(){      
      p5.background(255);
      p5.image(vid,0,0);      
      p5.loadPixels();
      pixelador();
      p5.updatePixels();
      p5.textSize(28);
      p5.fill(0, 255, 255);
      p5.text('Escala '+ sc, 10, 50);
    }

    mySelectEvent = function(){
      slider.value(1);      
    }

    pixelador = function(){
      let rp;
      let gp;
      let bp;
      let x = 0;
      let xInicial=0;
      sc = slider.value();
      while(640%sc!=0) sc++;
      n = sc*sc;
      let con = 0;

      if (sel.value() == 'Promedio de color')
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
      else
        while(x<p5.pixels.length){
          rp = 0;
          gp = 0;
          bp = 0;
          con = 0;
          x = xInicial;

          for(let j= 0;j<sc;j++){
            rp = p5.pixels[x];
            gp = p5.pixels[x + 1];
            bp = p5.pixels[x + 2];
            x+=vid.width*4;
          }

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
{{</details>}}
# Conclusiones

Con el método de promedio de color obtenemos colores más suaves. Pero utilizando coherencia espacial, escogiendo un pixel de manera arbitraria, se distorsiona mas la imagen y se obtienen colores mas sólidos.

# Trabajo Futuro

Es necesario optimizar el proceso del pixelador, ya que en secciones muy grandes su desempeño baja y se observa una latencia en la reproducción del mismo.