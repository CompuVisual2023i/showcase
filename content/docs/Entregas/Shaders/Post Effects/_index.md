# Efectos de post-procesado 

# Introducción 

Los efectos de postprocesado son técnicas utilizadas después de tomar una fotografía o grabar un video para modificar su apariencia y mejorar su calidad visual. Estos efectos pueden incluir ajustes de color, corrección de exposición, nitidez, contraste, balance de blancos, entre otros. También se pueden aplicar filtros y efectos especiales para lograr un aspecto creativo o único en la imagen. El postprocesado permite realzar los detalles, corregir imperfecciones y añadir estilos artísticos a las imágenes, brindando una mayor flexibilidad y control sobre el resultado final. Además, el postprocesado puede adaptarse a diferentes plataformas y formatos, optimizando las imágenes para su uso en medios digitales, impresiones, presentaciones o publicaciones en redes sociales. En resumen, los efectos de postprocesado son herramientas y técnicas utilizadas para mejorar y personalizar las imágenes y los videos, proporcionando ajustes de color, nitidez y efectos especiales para lograr una apariencia visualmente atractiva y profesional.



# Antecedentes y trabajo previo

## Blur

El efecto "blur" (desenfoque en inglés) es un término utilizado en fotografía, diseño gráfico y procesamiento de imágenes para describir la apariencia borrosa o suave de una imagen. El desenfoque se produce cuando los detalles finos de una imagen se difuminan o difuminan, lo que resulta en una pérdida de nitidez y claridad.

El efecto de desenfoque también se puede aplicar en el procesamiento de imágenes digitales para varios propósitos. Por ejemplo, puede ayudar a reducir el ruido o eliminar detalles no deseados en una imagen. También se puede utilizar para simular la profundidad de campo en una imagen, donde un área específica está enfocada y el resto se encuentra borroso.

## Inversion de colores

La inversión de colores es un proceso en el que se cambian los valores de color de una imagen de manera que los colores opuestos en el espectro se intercambien. Por ejemplo, los tonos oscuros se vuelven claros y los tonos claros se vuelven oscuros. Esto se logra mediante la inversión de los valores de cada componente de color (rojo, verde y azul) de cada píxel de la imagen.

La inversión de colores es un proceso en el que se intercambian los valores de color de una imagen, creando un efecto visual diferente. Puede utilizarse con fines creativos en el diseño gráfico, el arte digital y la publicidad, así como para mejorar la accesibilidad visual y ayudar a personas con dificultades para distinguir ciertos colores.

## Filtro anaglifo



El filtro anaglifo es una técnica utilizada en el procesamiento de imágenes para crear efectos tridimensionales. Consiste en combinar dos imágenes con una ligera diferencia de perspectiva en los colores rojo y cian. Al observar la imagen resultante con gafas anaglifo, que tienen lentes de colores correspondientes, se crea la ilusión de profundidad y se logra una experiencia tridimensional. Este filtro se utiliza comúnmente en fotografía, cine y videojuegos para proporcionar efectos de inmersión y realismo. El anaglifo ofrece una forma económica y accesible de experimentar la visualización en 3D sin requerir equipos especializados.


# Solución

{{< tabs "uniqueid" >}}
{{< tab "Blur" >}} 
## Blur

la función gaussianBlur, es la encargada de tomar cada texel y aplicar un proceso de ponderación, dado los dos vectores, gWeights y gOffsets, y recorriendo los texeles vecinos con el gOffsets y aplicando la el efecto blur  con el gWeights.
```javascript
vec3 gaussianBlur( sampler2D t, vec2 texUV, vec2 stepSize ){   
	vec3 colOut = vec3( 0.0 );                                                                                                                                   

	const int stepCount = 9;

	float gWeights[stepCount];
	    gWeights[0] = 0.10855;
	    gWeights[1] = 0.13135;
	    gWeights[2] = 0.10406;
	    gWeights[3] = 0.07216;
	    gWeights[4] = 0.04380;
	    gWeights[5] = 0.02328;
	    gWeights[6] = 0.01083;
	    gWeights[7] = 0.00441;
	    gWeights[8] = 0.00157;

	float gOffsets[stepCount];
	    gOffsets[0] = 0.66293;
	    gOffsets[1] = 2.47904;
	    gOffsets[2] = 4.46232;
	    gOffsets[3] = 6.44568;
	    gOffsets[4] = 8.42917;
	    gOffsets[5] = 10.41281;
	    gOffsets[6] = 12.39664;
	    gOffsets[7] = 14.38070;
	    gOffsets[8] = 16.36501;
	
	for( int i = 0; i < stepCount; i++ ){  

		vec2 texCoordOffset = gOffsets[i] * stepSize;

		vec3 col = texture2D( t, texUV + texCoordOffset ).xyz + texture2D( t, texUV - texCoordOffset ).xyz; 

		col *= gWeights[i];

		colOut +=  col;                                                                                                                               
	}

	return colOut;                                                                                                                                                   
} 
```

{{< /tab >}}
{{< tab "Inversion de colores" >}} 
## Inversion de colores

Para poder solucionar este, extraemos el color de cada texel en el shader, y como este trabaja con valores de 0 a 1, y a 1 le restamos el valor de RGB del texel.

Normalizamos las coordenadas:
```javascript
vec2 st = vec2(gl_FragCoord.x / uResolution.x, 1.0 - gl_FragCoord.y / uResolution.y);

```
Obtenemos el texel:
```javascript
vec4 color = texture2D(uTexture, st);
```
Invertimos el color:
```javascript
color.rgb = 1.0 - color.rgb;
```
Aplicamos el color al shader:
```javascript
gl_FragColor = color;
```
{{< /tab >}}
{{< tab "Filtro anaglifo" >}} 
## Filtro anaglifo

Normalizamos las coordenadas y las desplazamos a la izquierda:
```javascript
vec2 st = vec2((gl_FragCoord.x / uResolution.x)-0.02, 1.0 - gl_FragCoord.y / uResolution.y);
```
Aplicamos estas coordenadas a la textura para la capa roja:
```javascript
vec4 r = texture2D(uTexture, st);
```
Normalizamos las coordenadas y las desplazamos a la derecha:
```javascript
vec2 st2 = vec2((gl_FragCoord.x / uResolution.x)+0.02, 1.0 - gl_FragCoord.y / uResolution.y);
```
Aplicamos estas coordenadas a la textura para la capa azul y verde:
```javascript
vec4 gb = texture2D(uTexture, st2);
```
Aplicamos las capas anteriores al color del shader:
```javascript
gl_FragColor = vec4(r.r, gb.g, gb.b, 1.0);
```

{{< /tab >}}
{{< /tabs >}}

## Resultado

Hacer Click en la imagen para cambiar el efecto.
1. Blur
2. Invertir colores  
3. Filtro Anaglifo
<center>
{{< p5-global-iframe id="breath" width="535" height="430" >}}

    //Blur
    let pg_1, pg_2;
    let shader_1, shader_2;

    //Invertir colores
    let pg_3;
    let shader_3;

    //filtro anglifico
    let pg_4;
    let shader_4;

    let s = 0;

    let img;

    function preload() {
        shader_1 = loadShader('shader.vert','shader.frag');
        shader_2 = loadShader('shader.vert','shader.frag');   
        shader_3 = loadShader('shader_ic.vert','shader_ic.frag');
        shader_4 = loadShader('shader_ang.vert','shader_ang.frag');
        img = loadImage('ne.jpg');
    }

    function setup() {
        createCanvas(512, 405);
        pg_1 = createGraphics(width, height, WEBGL);
        pg_2 = createGraphics(width, height, WEBGL);
        pg_3 = createGraphics(width, height, WEBGL);
        pg_4 = createGraphics(width, height, WEBGL);
        

        pg_1.shader(shader_1);
        pg_2.shader(shader_2);
        pg_3.shader(shader_3);
        pg_4.shader(shader_4);
        
        
    }



    function draw() {
        if (s==1){
            shader_1.setUniform("tex", img);
            shader_1.setUniform("resolution", [width, height]);
            shader_1.setUniform("direction", [1.5, 0]);

            pg_1.rect(0, 0, width, height);

            shader_2.setUniform("tex", pg_1);
            shader_2.setUniform("resolution", [width, height]);
            shader_2.setUniform("direction", [0, 1.5]);
            
            pg_2.rect(0, 0, width, height);

            image(pg_2, 0, 0);
            textSize(32);
            text(s, 10, 30);
        }
        else if(s==2){

            shader_3.setUniform("uResolution", [width, height]);
            shader_3.setUniform("uTexture", img);
            pg_3.texture(img);
            pg_3.beginShape();
            pg_3.vertex(-width / 2, height / 2, 0, 1);
            pg_3.vertex(width / 2, height / 2, 1, 1);
            pg_3.vertex(width / 2, -height / 2, 1, 0);            
            pg_3.vertex(-width / 2, -height / 2, 0, 0);            
            pg_3.endShape(CLOSE);
            image(pg_3, 0, 0);
            textSize(32);
            text(s, 10, 30);

        } 
        else if(s==3){

            shader_4.setUniform("uResolution", [width, height]);
            shader_4.setUniform("uTexture", img);
            pg_4.texture(img);
            pg_4.beginShape();
            pg_4.vertex(-width / 2, height / 2, 0, 1);
            pg_4.vertex(width / 2, height / 2, 1, 1);
            pg_4.vertex(width / 2, -height / 2, 1, 0);            
            pg_4.vertex(-width / 2, -height / 2, 0, 0);            
            pg_4.endShape(CLOSE);
            image(pg_4, 0, 0);
            textSize(32);
            text(s, 10, 30);

        }
        else{
           image(img, 0, 0); 
           textSize(32);
           fill(255);
            text('Original', 10, 30);
        }
        
    }

    function mousePressed(){
        if(s<3) s++;
        else s=0;
    }

{{< /p5-global-iframe >}}
</center>


# Código

{{<details "Código general">}}
    //Blur
    let pg_1, pg_2;
    let shader_1, shader_2;

    //Invertir colores
    let pg_3;
    let shader_3;

    //filtro anglifico
    let pg_4;
    let shader_4;

    let s = 0;

    let img;

    function preload() {
        shader_1 = loadShader('shader.vert','shader.frag');
        shader_2 = loadShader('shader.vert','shader.frag');   
        shader_3 = loadShader('shader_ic.vert','shader_ic.frag');
        shader_4 = loadShader('shader_ang.vert','shader_ang.frag');
        img = loadImage('ne.jpg');
    }

    function setup() {
        createCanvas(512, 405);
        pg_1 = createGraphics(width, height, WEBGL);
        pg_2 = createGraphics(width, height, WEBGL);
        pg_3 = createGraphics(width, height, WEBGL);
        pg_4 = createGraphics(width, height, WEBGL);
        

        pg_1.shader(shader_1);
        pg_2.shader(shader_2);
        pg_3.shader(shader_3);
        pg_4.shader(shader_4);
        
        
    }



    function draw() {
        if (s==1){
            shader_1.setUniform("tex", img);
            shader_1.setUniform("resolution", [width, height]);
            shader_1.setUniform("direction", [1.5, 0]);

            pg_1.rect(0, 0, width, height);

            shader_2.setUniform("tex", pg_1);
            shader_2.setUniform("resolution", [width, height]);
            shader_2.setUniform("direction", [0, 1.5]);
            
            pg_2.rect(0, 0, width, height);

            image(pg_2, 0, 0);
            textSize(32);
            text(s, 10, 30);
        }
        else if(s==2){

            shader_3.setUniform("uResolution", [width, height]);
            shader_3.setUniform("uTexture", img);
            pg_3.texture(img);
            pg_3.beginShape();
            pg_3.vertex(-width / 2, height / 2, 0, 1);
            pg_3.vertex(width / 2, height / 2, 1, 1);
            pg_3.vertex(width / 2, -height / 2, 1, 0);            
            pg_3.vertex(-width / 2, -height / 2, 0, 0);            
            pg_3.endShape(CLOSE);
            image(pg_3, 0, 0);
            textSize(32);
            text(s, 10, 30);

        } 
        else if(s==3){

            shader_4.setUniform("uResolution", [width, height]);
            shader_4.setUniform("uTexture", img);
            pg_4.texture(img);
            pg_4.beginShape();
            pg_4.vertex(-width / 2, height / 2, 0, 1);
            pg_4.vertex(width / 2, height / 2, 1, 1);
            pg_4.vertex(width / 2, -height / 2, 1, 0);            
            pg_4.vertex(-width / 2, -height / 2, 0, 0);            
            pg_4.endShape(CLOSE);
            image(pg_4, 0, 0);
            textSize(32);
            text(s, 10, 30);

        }
        else{
           image(img, 0, 0); 
           textSize(32);
           fill(255);
            text('Original', 10, 30);
        }
        
    }

    function mousePressed(){
        if(s<3) s++;
        else s=0;
    }
{{</details>}}

{{<details "Código shader frag Blur">}}
    precision mediump float;

    varying vec2 vTexCoord;
    uniform sampler2D tex;
    uniform vec2 resolution;
    uniform vec2 direction;

    vec3 gaussianBlur( sampler2D t, vec2 texUV, vec2 stepSize ){   
	vec3 colOut = vec3( 0.0 );                                                                                                                                   

	const int stepCount = 9;

	float gWeights[stepCount];
	    gWeights[0] = 0.10855;
	    gWeights[1] = 0.13135;
	    gWeights[2] = 0.10406;
	    gWeights[3] = 0.07216;
	    gWeights[4] = 0.04380;
	    gWeights[5] = 0.02328;
	    gWeights[6] = 0.01083;
	    gWeights[7] = 0.00441;
	    gWeights[8] = 0.00157;

	float gOffsets[stepCount];
	    gOffsets[0] = 0.66293;
	    gOffsets[1] = 2.47904;
	    gOffsets[2] = 4.46232;
	    gOffsets[3] = 6.44568;
	    gOffsets[4] = 8.42917;
	    gOffsets[5] = 10.41281;
	    gOffsets[6] = 12.39664;
	    gOffsets[7] = 14.38070;
	    gOffsets[8] = 16.36501;
	
	for( int i = 0; i < stepCount; i++ ){  

		vec2 texCoordOffset = gOffsets[i] * stepSize;

		vec3 col = texture2D( t, texUV + texCoordOffset ).xyz + texture2D( t, texUV - texCoordOffset ).xyz; 

		col *= gWeights[i];

		colOut +=  col;                                                                                                                               
	}

	return colOut;                                                                                                                                                   
    } 

    void main() {

    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y;
    
    vec2 texel = 1.0 / resolution;
    vec2 stepSize = texel * direction;

    vec3 blur = gaussianBlur(tex, uv, stepSize);
    
    gl_FragColor = vec4(blur, 1.0);

    }
{{</details>}}

{{<details "Código shader frag Inversion de colores">}}
    precision mediump float;

    uniform vec2 uResolution;
    uniform sampler2D uTexture;


    void main() {
    vec2 st = vec2(gl_FragCoord.x / uResolution.x, 1.0 - gl_FragCoord.y / uResolution.y);
    vec4 color = texture2D(uTexture, st);
    color.rgb = 1.0 - color.rgb; // Invertir los colores
    gl_FragColor = color;
    }
{{</details>}}

{{<details "Código shader frag filtro anaglifo">}}
    precision mediump float;

    uniform vec2 uResolution;

    uniform sampler2D uTexture;

    void main() {
    vec2 st = vec2((gl_FragCoord.x / uResolution.x)-0.02, 1.0 - gl_FragCoord.y / uResolution.y);
    vec4 r = texture2D(uTexture, st);
    vec2 st2 = vec2((gl_FragCoord.x / uResolution.x)+0.02, 1.0 - gl_FragCoord.y / uResolution.y);
    vec4 gb = texture2D(uTexture, st2);
    gl_FragColor = vec4(r.r, gb.g, gb.b, 1.0);
    }
{{</details>}}

# Conclusiones

Los efectos de postprocesado junto con el uso de shaders, son una herramienta bastante util para poder manipular las imágenes en tiempo real y con un tiempo de procesamiento bastante reducido.

# Trabajo Futuro

Es necesario ajustar  el filtro anaglifo ya que al realizar el desplazamiento de las capas de color, estas generan unos bordes indeseados, donde se al parecer la ultima linea de pixeles se replica para rellenar el espacio de trabajo.

También seria interesante aplicar estos efectos a videos con el fin de analizar su rendimiento y poder observar el uso de cada filtro de una mejor manera.


