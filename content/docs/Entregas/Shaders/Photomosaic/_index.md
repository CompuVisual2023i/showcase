# Photomosaic

# Introducción 

El foto mosaico es una técnica de composición de imágenes que consiste en crear una imagen grande a partir de una colección de imágenes más pequeñas, conocidas como teselas. Cada tesela representa una porción de la imagen final y se selecciona de acuerdo a su similitud de color y textura con la región correspondiente en la imagen original.

La idea detrás del foto mosaico es combinar muchas imágenes más pequeñas para formar una imagen completa y reconocible a distancia. Este enfoque se basa en el principio de que, a medida que aumenta el número de teselas y se reduce su tamaño, se pueden capturar más detalles y variaciones de color, lo que permite una mejor representación de la imagen original.

# Antecedentes y trabajo previo

El foto mosaico es una técnica de composición de imágenes que surgió en la década de 1990, popularizada por el artista digital Robert Silvers. Consiste en construir una imagen grande utilizando una colección de imágenes más pequeñas, llamadas teselas. Silvers desarrolló software especializado para automatizar el proceso de selección y colocación de teselas, simplificando el método originalmente manual. La técnica se basa en encontrar teselas que representen de manera similar la región correspondiente en la imagen original, logrando así crear una imagen final reconocible y compuesta por muchas imágenes más pequeñas.

En la actualidad, el foto mosaico ha ganado popularidad y se ha vuelto más accesible gracias a los avances tecnológicos. Existen aplicaciones y programas que utilizan algoritmos avanzados de análisis de imágenes y comparación de características visuales para generar foto mosaicos de manera eficiente. Esta técnica se utiliza en diversos campos como el arte digital, la publicidad, la decoración y el diseño gráfico. El foto mosaico ofrece una forma creativa de representar imágenes de manera única y atractiva, utilizando una gran cantidad de imágenes más pequeñas para formar una imagen completa y sorprendente. [Photographic mosaic](https://en.wikipedia.org/wiki/Photographic_mosaic).

# Solución

Utilizando como base los conceptos expuesto en [spatial coherence](https://visualcomputing.github.io/docs/shaders/spatial_coherence/) y [photomosaic](https://visualcomputing.github.io/docs/shaders/photomosaic/). Se plantea inicialmente un proceso de pixelacion, esto se logra tomando solo un texel especifico de la textura y utilizarlo para rellenar la tesela.

```c
vec2 stepCoord = vec2(gl_FragCoord.x / uResolution.x, 1.0 - gl_FragCoord.y / uResolution.y);
stepCoord *= resolution;
stepCoord = floor(stepCoord);
stepCoord /= resolution;
```
Donde __`stepCoord`__ son las coordenadas normalizadas de la textura, y se utiliza __`gl_FragCoord`__ para obtener las coordenadas en pantalla, posteriormente se escalan de según el valor de __`resolution`__, el cual nos indica el tamaño de la tesela y se utiliza la función piso __`floor(stepCoord)`__ con la que se garantiza que siempre se tomara el mismo texel para esa tesela.



Para poder pasar las imágenes al shader generamos un buffer en p5 con __`pg_1 = createGraphics(width * n, height, WEBGL)`__, el cual le pasaremos al shader como una textura, donde están todas las imágenes en secuencia una seguida de la otra.

Las imágenes fueron procesadas con anticipación, para que todas tuvieran la misma resolución. Esto también se puede lograr directamente con funciones de p5.

{{< p5-global-iframe id="breath" width="570" height="330" >}}


 let img; // imagen de referencia
    let pg_1; // buffer para las imágenes
    let paintings = []; // array con las imágenes 
    let paintings2 = []; // array con la imágenes y su valor de luma 
    let n = 10; // cantidad de imágenes
    let img2; // imagen auxiliar para el calculo del luma
    let num = []; // array con los valores del luma
    

    function preload(){

        for(let i =1;i<=n;i++) paintings.push(loadImage(`im${i}.jpg`));
             

    }

    function setup(){
        
        

        // calculo del luma
        for (let i = 0; i<paintings.length;i++){
            img2 = paintings[i];
            img2.loadPixels();
            let avgLum = 0;
            for (let j = 0;j<img2.pixels.length;j+=4){
                let lum = 0;
                //let c = color(img2.pixels[j],img2.pixels[j+1],img2.pixels[j+2]);
                let r = img2.pixels[j];
                let g = img2.pixels[j+1];
                let b = img2.pixels[j+2];
                lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                //lum = brightness(c);
                avgLum += lum;
            }
            avgLum /= (540*304);
            paintings2.push([avgLum, img2]);
            num.push(avgLum);
            console.log(avgLum);
        }
        num = sort(num); // arreglo con los valores del luma ordenados 
        

        createCanvas(540,304, WEBGL);

        // creación del espacio para la textura y  carga de imágenes según su luma
        pg_1 = createGraphics(width * n, height, WEBGL);
        for (let i = 0; i < n; i++){
            for (let j = 0; j < n ; j++)
                //condición para pintar según el valor del luma
                if(num[i]==paintings2[j][0])
                    pg_1.image(paintings2[j][1],(-pg_1.width/2) + (pg_1.width/n) *i,-pg_1.height/2);
        }

        
        textureMode(NORMAL);
        noStroke();        
    }

    function draw(){

        beginShape();
        texture(pg_1);
        vertex(-width / 2, height / 2, 0, 1);
        vertex(width / 2, height / 2, 1, 1);
        vertex(width / 2, -height / 2, 1, 0);            
        vertex(-width / 2, -height / 2, 0, 0);            
        endShape(CLOSE); 
    }

{{< /p5-global-iframe >}}


Ahora debemos lograr seleccionar el segmento de la textura que contiene todas las imágenes para que cubra la tesela indicada.
Para eso hallamos un factor de escalamiento  el cual se obtiene de dividir 1 entre __`resolution`__, hallamos la luminancia del texel, y aplicamos la funcion piso __`floor(n*l)`__, donde n es la cantidad de imágenes y l la luminancia, con eso logramos ubicar la coordenada de inicio del segmento de la textura.

```c
vec2 coord = vec2(gl_FragCoord.x / uResolution.x, 1.0 - gl_FragCoord.y / uResolution.y);
float factorS = 1.0 / resolution;
float l = 0.2126 * pTexture.r + 0.7152 * pTexture.g + 0.0722 * pTexture.b;
float s = floor(n*l);
```
Para logra aplicar el segmento de la textura a la tesela, utilizamos la expresión:

para la coordenada x,

<center>
{{< katex class="text-center">}}
\cfrac{coordenadaX \bmod factorS}{factorS*n} + \cfrac{1}{n} * s
{{< /katex >}}
</center>  

La expresión a la derecha de la suma, mapea las coordenadas de la textura a la tesela, y la expresión de la izquierda indica el texel de inicio de la textura. 

y para la coordenada y,

<center>
{{< katex class="text-center">}}
\cfrac{coordenadaY \bmod factorS}{factorS*n} + \cfrac{1}{n} * s
{{< /katex >}}
</center>

esto es por que estamos pasando la textura con la imágenes de forma horizontal.

Finalmente, pasamos la textura con las n imagenes y el mapeo de las coordenadas al __`gl_FragColor`__.

```c 
coord = vec2(((mod(coord.x, factorS)) / (factorS * n)) + (1.0/n)*s,(mod(coord.y, factorS) / factorS));

gl_FragColor = texture2D(nTexture, coord);
```
## Resultado

{{< p5-global-iframe id="breath" width="570" height="330" >}}

    let img; // imagen de referencia
    let pg_1; // buffer para las imágenes
    let shader_ms;  // shader
    let resolution; // divisiones para la pixelacion 
    let paintings = []; // array con las imágenes 
    let paintings2 = []; // array con la imágenes y su valor de luma 
    let n = 10; // cantidad de imágenes
    let img2; // imagen auxiliar para el calculo del luma
    let num = []; // array con los valores del luma
    let pixelator;
    let uv;
    let rPaint;
    

    function preload(){

        for(let i =1;i<=n;i++) paintings.push(loadImage(`im${i}.jpg`));
        img = random(paintings); // selección de la imagen
        shader_ms = loadShader('shader.vert','shader.frag');

    }

    function setup(){
        
        

        // calculo del luma
        for (let i = 0; i<paintings.length;i++){
            img2 = paintings[i];
            img2.loadPixels();
            let avgLum = 0;
            for (let j = 0;j<img2.pixels.length;j+=4){
                let lum = 0;
                //let c = color(img2.pixels[j],img2.pixels[j+1],img2.pixels[j+2]);
                let r = img2.pixels[j];
                let g = img2.pixels[j+1];
                let b = img2.pixels[j+2];
                lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                //lum = brightness(c);
                avgLum += lum;
            }
            avgLum /= (540*304);
            paintings2.push([avgLum, img2]);
            num.push(avgLum);
            console.log(avgLum);
        }
        num = sort(num); // arreglo con los valores del luma ordenados 
        

        createCanvas(540,304, WEBGL);

        // creación del espacio para la textura y  carga de imágenes según su luma
        pg_1 = createGraphics(width * n, height, WEBGL);
        for (let i = 0; i < n; i++){
            for (let j = 0; j < n ; j++)
                //condición para pintar según el valor del luma
                if(num[i]==paintings2[j][0])
                    pg_1.image(paintings2[j][1],(-pg_1.width/2) + (pg_1.width/n) *i,-pg_1.height/2);
        }

        
        textureMode(NORMAL);
        noStroke();

        resolution = createSlider(1,100,30,1);
        resolution.position(10,30);
        resolution.input(() => shader_ms.setUniform('resolution', resolution.value()));
        
        pixelator = createCheckbox('pixelator',false);
        pixelator.position(130,10);
        pixelator.changed(()=> shader_ms.setUniform('pixelator',pixelator.checked()));

        rPaint = createButton('Cambiar imagen');
        rPaint.position(10,10);
        rPaint.mousePressed(()=> shader_ms.setUniform('uTexture',random(paintings)));

        shader(shader_ms);
        shader_ms.setUniform('n',n);
        shader_ms.setUniform('uResolution',[width, height]);
        shader_ms.setUniform('uTexture',img);
        shader_ms.setUniform('nTexture',pg_1);
        shader_ms.setUniform('resolution',resolution.value());

           
        
        
    }

    function draw(){

        beginShape();
        vertex(-width / 2, height / 2, 0, 1);
        vertex(width / 2, height / 2, 1, 1);
        vertex(width / 2, -height / 2, 1, 0);            
        vertex(-width / 2, -height / 2, 0, 0);            
        endShape(CLOSE); 
    }

{{< /p5-global-iframe >}}

# Código

{{<details "Código main">}}

    let img; // imagen de referencia
    let pg_1; // buffer para las imágenes
    let shader_ms;  // shader
    let resolution; // divisiones para la pixelacion 
    let paintings = []; // array con las imágenes 
    let paintings2 = []; // array con la imágenes y su valor de luma 
    let n = 10; // cantidad de imágenes
    let img2; // imagen auxiliar para el calculo del luma
    let num = []; // array con los valores del luma
    let pixelator;
    let uv;
    let rPaint;
    

    function preload(){

        for(let i =1;i<=n;i++) paintings.push(loadImage(`im${i}.jpg`));
        img = random(paintings); // selección de la imagen
        shader_ms = loadShader('shader.vert','shader.frag');

    }

    function setup(){
        
        

        // calculo del luma
        for (let i = 0; i<paintings.length;i++){
            img2 = paintings[i];
            img2.loadPixels();
            let avgLum = 0;
            for (let j = 0;j<img2.pixels.length;j+=4){
                let lum = 0;
                //let c = color(img2.pixels[j],img2.pixels[j+1],img2.pixels[j+2]);
                let r = img2.pixels[j];
                let g = img2.pixels[j+1];
                let b = img2.pixels[j+2];
                lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                //lum = brightness(c);
                avgLum += lum;
            }
            avgLum /= (540*304);
            paintings2.push([avgLum, img2]);
            num.push(avgLum);
            console.log(avgLum);
        }
        num = sort(num); // arreglo con los valores del luma ordenados 
        

        createCanvas(540,304, WEBGL);

        // creación del espacio para la textura y  carga de imágenes según su luma
        pg_1 = createGraphics(width * n, height, WEBGL);
        for (let i = 0; i < n; i++){
            for (let j = 0; j < n ; j++)
                //condición para pintar según el valor del luma
                if(num[i]==paintings2[j][0])
                    pg_1.image(paintings2[j][1],(-pg_1.width/2) + (pg_1.width/n) *i,-pg_1.height/2);
        }

        
        textureMode(NORMAL);
        noStroke();

        resolution = createSlider(1,100,30,1);
        resolution.position(10,30);
        resolution.input(() => shader_ms.setUniform('resolution', resolution.value()));
        
        pixelator = createCheckbox('pixelator',false);
        pixelator.position(130,10);
        pixelator.changed(()=> shader_ms.setUniform('pixelator',pixelator.checked()));

        rPaint = createButton('Cambiar imagen');
        rPaint.position(10,10);
        rPaint.mousePressed(()=> shader_ms.setUniform('uTexture',random(paintings)));

        shader(shader_ms);
        shader_ms.setUniform('n',n);
        shader_ms.setUniform('uResolution',[width, height]);
        shader_ms.setUniform('uTexture',img);
        shader_ms.setUniform('nTexture',pg_1);
        shader_ms.setUniform('resolution',resolution.value());

           
        
        
    }

    function draw(){

        beginShape();
        vertex(-width / 2, height / 2, 0, 1);
        vertex(width / 2, height / 2, 1, 1);
        vertex(width / 2, -height / 2, 1, 0);            
        vertex(-width / 2, -height / 2, 0, 0);            
        endShape(CLOSE); 
    }
{{</details>}}
{{<details "shader.frag">}}
precision mediump float;

uniform vec2 uResolution;

uniform float resolution;

uniform float n;

uniform sampler2D uTexture;

uniform sampler2D nTexture;

uniform bool pixelator; 

void main() {

    vec2 stepCoord = vec2(gl_FragCoord.x / uResolution.x, 1.0 - gl_FragCoord.y / uResolution.y);
    stepCoord *= resolution;
    stepCoord = floor(stepCoord);
    stepCoord /= resolution;

    vec4 pTexture = texture2D(uTexture,stepCoord);

    vec2 coord = vec2(gl_FragCoord.x / uResolution.x, 1.0 - gl_FragCoord.y / uResolution.y);
    float factorS = 1.0 / resolution;
    float l = 0.2126 * pTexture.r + 0.7152 * pTexture.g + 0.0722 * pTexture.b;
    float s = floor(n*l);
    coord = vec2(((mod(coord.x, factorS)) / (factorS * n)) + (1.0/n)*s,(mod(coord.y, factorS) / factorS));


    gl_FragColor = pixelator ? texture2D(uTexture, stepCoord):texture2D(nTexture, coord);
}
{{</details>}}
# Conclusiones

El programa nos ofrece una herramienta muy util utilizando los shaders, con el fin de simplificar la programación para el procesamiento de cada pixel, reduciendo la cantidad de lineas de código necesarias y el tiempo de procesamiento.

# Trabajo Futuro

Utilizando como base este proceso de foto mosaico, se podría ampliar su uso para videos o utilizar un conjunto de videos para reemplazar cada tesela, pero para esto seria util pre procesar el video para mantener su promedio de luma en un rango estables y asi poder mantener su posición en la tesela y evitar que esta varié con cada fotograma.