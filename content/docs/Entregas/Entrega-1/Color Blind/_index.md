# Introducción 
## Daltonismo (Color Blind)

El daltonismo es una discapacidad visual que afecta la percepción del color. Se produce cuando los conos de la retina, células especializadas en detectar diferentes colores de la luz, no funcionan correctamente. Como resultado, las personas con daltonismo tienen dificultades para distinguir ciertos colores o los ven de forma diferente a como las personas con visión normal los perciben.

Existen diferentes tipos de daltonismo, pero el más común es el deuteranomalía, que afecta la capacidad de diferenciar entre el verde y el rojo. También hay casos de protanopia, que afecta la percepción del rojo, y de tritanopia, que afecta la percepción del azul.

El daltonismo es más común en los hombres que en las mujeres, ya que es una condición genética ligada al cromosoma X. Aunque no existe una cura para el daltonismo, las personas afectadas pueden aprender a adaptarse a su condición y utilizar herramientas como lentes de contacto o aplicaciones móviles para ayudarles a diferenciar los colores.

# Antecedentes y trabajo previo
## Simulación de tipos de daltonismo

Para poder simular los tipos de daltonismo es necesario saber que el ojo humano percibe los colores según su longitud de onda y por ende es necesario trabajar en un espacio de colores LMS (L (longitud de onda larga), M (longitud de onda media) y S (longitud de onda corta)), pero p5 trabaja con un espacio en RGB (Red, Green, Blue), entonces, es necesario realizar una conversión entre estos dos espacios de colores.

### Conversión de RGB a LMS
### Imagen Original

{{< p5-global-iframe id="breath" width="270" height="175" >}}
    let img;

    function preload(){
        img = loadImage('img.svg');
    }

    function setup() {
        createCanvas(img.width, img.height);
        image(img,0,0)       
    }

    function draw(){
        
    }


{{< /p5-global-iframe >}}

Para esto multiplicamos el vector de píxeles RGB por una matriz de conversión obtenida de simplificar la conversión de RGB --> XYZ --> LMS.

{{< katex class="text-center">}}
v =
    \begin{pmatrix}
        r \\
        g \\
        b  
    \end{pmatrix},
    M_c=
    \begin{pmatrix}
        0.31399022 & 0.63951294 & 0.04649755 \\
        0.15537241 & 0.75789446 & 0.08670142 \\
        0.01775239 & 0.10944209 &  0.87256922  
    \end{pmatrix}
    
    \newline
    M_c \cdot v = \begin{pmatrix} r_l \\ g_l \\ b_l \end{pmatrix} = v_l
{{< /katex >}}

Ahora el vector obtenido se multiplica por una matriz que aplica una simulación de daltonismo al espacio LMS.
En este caso para la protanopia.

{{< katex class="text-center">}}
S_p = \begin{pmatrix} 0 & 1.05118294 & -0.05116099 \\
            0&1&0\\
            0&0&1 \end{pmatrix}
\newline
S_p \cdot v_l = \begin{pmatrix} r_p \\ g_p \\ b_p \end{pmatrix} = v_p
{{< /katex >}}

y finalmente regresamos al espacio RGB multiplicando por la inversa de la matriz de conversión.

{{< katex class="text-center">}}

    M_c^-1=
    \begin{pmatrix}
        5.47221206 & −4.6419601 & 0.16963708\\
        −1.1252419 & 2.29317094 & −0.1678952\\
        0.02980165 & −0.19318073 & 1.16364789  
    \end{pmatrix}
    
    \newline
    M_c^-1 \cdot v_p 
{{< /katex >}}


Esto es una resumen de un articulo web de Jim Schmitz, un artista y explorador digital, en su sitio  [ixora](https://ixora.io/projects/colorblindness/color-blindness-simulation-research/).


### Imagen con Protanopia

Matriz de simulación,

{{< katex class="text-center">}}
S_p = \begin{pmatrix} 0 & 1.05118294 & -0.05116099 \\
            0&1&0\\
            0&0&1 \end{pmatrix}

{{< /katex >}}  
{{< p5-global-iframe id="breath" width="270" height="175" >}}
    let img;

    function preload(){
        img = loadImage('img.svg');
    }

    function setup() {
        createCanvas(img.width, img.height);
        colorMode(RGB, 255); // Establecer el modo de color en RGB
        background(255); // Fondo blanco
        image(img, 0, 0); // Dibujar la imagen en el lienzo
        simProtanopia();
    }

    function draw() {
        
    }

    function simProtanopia(){
        loadPixels();

        //convertir rgb a xyz   
             
        let mc = [
            [0.4124564,0.3575761,0.1804375],
            [0.2126729,0.7151522,0.0721750],
            [0.0193339,0.1191920,0.9503041]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        //convertir xyz a lms
        mc = [
            [0.4002,0.7076,-0.0808],
            [-0.2263,1.1653,0.0457],
            [0,0,0.9182]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        //sim

        mc = [
            [0,1.05118294,-0.05116099],
            [0,1,0],
            [0,0,1]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        //lms to rgb
        mc = [
            [5.47221206,-4.6419601,0.16963708],
            [-1.1252419,2.29317094,-0.1678952],
            [0.02980165,-0.19318073,1.16364789]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        updatePixels();
    }



{{< /p5-global-iframe >}}  
### Imagen con Deutaranopia
Matriz de simulación,

{{< katex class="text-center">}}
S_d = \begin{pmatrix} 1&0&0\\
            0.9513092&0&0.04866992\\
            0&0&1 \end{pmatrix}
            \newline
{{< /katex >}}
  

{{< p5-global-iframe id="breath" width="270" height="175" >}}
    let img;

    function preload(){
        img = loadImage('img.svg');
    }

    function setup() {
        createCanvas(img.width, img.height);
        colorMode(RGB, 255); // Establecer el modo de color en RGB
        background(255); // Fondo blanco
        image(img, 0, 0); // Dibujar la imagen en el lienzo
        simDeutaranopia();
    }

    function draw() {
        
    }

    function simDeutaranopia(){
        loadPixels();

        //convertir rgb a lms       
        let mc = [
            [0.31399022,0.63951294,0.04649755],
            [0.15537241,0.75789446,0.08670142],
            [0.01775239,0.10944209,0.87256922]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        //sim

        mc = [
            [1,0,0],
            [0.9513092,0,0.04866992],
            [0,0,1]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        //lms to rgb
        mc = [
            [5.47221206,-4.6419601,0.16963708],
            [-1.1252419,2.29317094,-0.1678952],
            [0.02980165,-0.19318073,1.16364789]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        updatePixels();
    }



{{< /p5-global-iframe >}}
### Imagen con Tritanopia
Matriz de simulación,

{{< katex class="text-center">}}
S_t = \begin{pmatrix} 1&0&0\\
            0&1&0\\
            -0.86744736&1.86727089&0 \end{pmatrix}
            \newline
{{< /katex >}}
{{< p5-global-iframe id="breath" width="270" height="175" >}}
    let img;

    function preload(){
        img = loadImage('img.svg');
    }

    function setup() {
        createCanvas(img.width, img.height);
        colorMode(RGB, 255); // Establecer el modo de color en RGB
        background(255); // Fondo blanco
        image(img, 0, 0); // Dibujar la imagen en el lienzo
        simTritanopia();
    }

    function draw() {
        
    }

    function simTritanopia(){
        loadPixels();

        //convertir rgb a lms       
        let mc = [
            [0.31399022,0.63951294,0.04649755],
            [0.15537241,0.75789446,0.08670142],
            [0.01775239,0.10944209,0.87256922]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        //sim

        mc = [
            [1,0,0],
            [0,1,0],
            [-0.86744736,1.86727089,0]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        //lms to rgb
        mc = [
            [5.47221206,-4.6419601,0.16963708],
            [-1.1252419,2.29317094,-0.1678952],
            [0.02980165,-0.19318073,1.16364789]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        updatePixels();
    }



{{< /p5-global-iframe >}}



# Solución
## Corrección de colores para los daltónicos

Esta corrección la podemos lograr cambiando la matriz de simulación por una de corrección, donde modificaremos los valores RGB de los pixeles con el fin de lograr una combinación colores que logre simular los colores reales.

### Protanopia

Matriz de corrección,

{{< katex class="text-center">}}
S_c = \begin{pmatrix} 0.567&0.433&0\\
            0.558&0.442&0\\
            0&0.242&0.758 \end{pmatrix}
            \newline
{{< /katex >}}

{{< p5-global-iframe id="breath" width="270" height="175" >}}
    
    let img;

    function preload(){
        img = loadImage('img.svg');
    }

    function setup() {
        createCanvas(img.width, img.height);
        colorMode(RGB, 255); // Establecer el modo de color en RGB
        background(255); // Fondo blanco
        image(img, 0, 0); // Dibujar la imagen en el lienzo
        simProtanopia();
    }

    function draw() {
        
    }

    function simProtanopia(){
        loadPixels();

        //convertir rgb a lms       
        let mc = [
            [0.31399022,0.63951294,0.04649755],
            [0.15537241,0.75789446,0.08670142],
            [0.01775239,0.10944209,0.87256922]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        //sim

        mc = [
            [0.567, 0.433, 0],
            [0.558, 0.442, 0],
            [0    , 0.242, 0.758]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        //lms to rgb
        mc = [
            [5.47221206,-4.6419601,0.16963708],
            [-1.1252419,2.29317094,-0.1678952],
            [0.02980165,-0.19318073,1.16364789]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        updatePixels();
    }



{{< /p5-global-iframe >}}
### Deuteranopia

Matriz de corrección,

{{< katex class="text-center">}}
S_c = \begin{pmatrix} 0.625&0.375&0\\
            0.7&0.3&0\\
            0&0.3&0.7 \end{pmatrix}
            \newline
{{< /katex >}}
  

{{< p5-global-iframe id="breath" width="270" height="175" >}}
    let img;

    function preload(){
        img = loadImage('img.svg');
    }

    function setup() {
        createCanvas(img.width, img.height);
        colorMode(RGB, 255); // Establecer el modo de color en RGB
        background(255); // Fondo blanco
        image(img, 0, 0); // Dibujar la imagen en el lienzo
        simDeuteranopia();
    }

    function draw() {
        
    }

    function simDeuteranopia(){
        loadPixels();

        //convertir rgb a lms       
        let mc = [
            [0.31399022,0.63951294,0.04649755],
            [0.15537241,0.75789446,0.08670142],
            [0.01775239,0.10944209,0.87256922]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        //sim

        mc = [
            [0.625, 0.375, 0 ],
            [0.7  , 0.3  , 0],
            [0    , 0.3  , 0.7]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        //lms to rgb
        mc = [
            [5.47221206,-4.6419601,0.16963708],
            [-1.1252419,2.29317094,-0.1678952],
            [0.02980165,-0.19318073,1.16364789]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        updatePixels();
    }



{{< /p5-global-iframe >}}
### Tritanopia
Matriz de corrección,

{{< katex class="text-center">}}
S_c = \begin{pmatrix} 0.95&0.05&0\\
            -0.38&1.38&0\\
            0&0&1 \end{pmatrix}
            \newline
{{< /katex >}}
{{< p5-global-iframe id="breath" width="270" height="175" >}}
    let img;

    function preload(){
        img = loadImage('img.svg');
    }

    function setup() {
        createCanvas(img.width, img.height);
        colorMode(RGB, 255); // Establecer el modo de color en RGB
        background(255); // Fondo blanco
        image(img, 0, 0); // Dibujar la imagen en el lienzo
        simTritanopia();
    }

    function draw() {
        
    }

    function simTritanopia(){
        loadPixels();

        //convertir rgb a lms       
        let mc = [
            [0.31399022,0.63951294,0.04649755],
            [0.15537241,0.75789446,0.08670142],
            [0.01775239,0.10944209,0.87256922]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        //sim

        mc = [
            [0.95, 0.05, 0],
            [-0.38, 1.38, 0],
            [0, 0, 1]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        //lms to rgb
        mc = [
            [5.47221206,-4.6419601,0.16963708],
            [-1.1252419,2.29317094,-0.1678952],
            [0.02980165,-0.19318073,1.16364789]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        updatePixels();
    }



{{< /p5-global-iframe >}}

# Código

{{<details "Código RGB a XYZ a LMS">}}
    let img;

    function preload(){
        img = loadImage('img.svg');
    }

    function setup() {
        createCanvas(img.width, img.height);
        colorMode(RGB, 255); // Establecer el modo de color en RGB
        background(255); // Fondo blanco
        image(img, 0, 0); // Dibujar la imagen en el lienzo
        simProtanopia();
    }

    function draw() {
        
    }

    function simProtanopia(){
        loadPixels();

        //convertir rgb a xyz        
        let mc = [
            [0.4124564,0.3575761,0.1804375],
            [0.2126729,0.7151522,0.0721750],
            [0.0193339,0.1191920,0.9503041]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        //convertir xyz a lms
        mc = [
            [0.4002,0.7076,-0.0808],
            [-0.2263,1.1653,0.0457],
            [0,0,0.9182]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        //sim

        mc = [
            [0,1.05118294,-0.05116099],
            [0,1,0],
            [0,0,1]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        //lms to rgb
        mc = [
            [5.47221206,-4.6419601,0.16963708],
            [-1.1252419,2.29317094,-0.1678952],
            [0.02980165,-0.19318073,1.16364789]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        updatePixels();
    }
{{</details>}}

{{<details "Código RGB a LMS">}}
    let img;

    function preload(){
        img = loadImage('img.svg');
    }

    function setup() {
        createCanvas(img.width, img.height);
        colorMode(RGB, 255); // Establecer el modo de color en RGB
        background(255); // Fondo blanco
        image(img, 0, 0); // Dibujar la imagen en el lienzo
        simDeutaranopia();
    }

    function draw() {
        
    }

    function simDeutaranopia(){
        loadPixels();

        //convertir rgb a lms       
        let mc = [
            [0.31399022,0.63951294,0.04649755],
            [0.15537241,0.75789446,0.08670142],
            [0.01775239,0.10944209,0.87256922]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        //sim

        mc = [
            [1,0,0],
            [0.9513092,0,0.04866992],
            [0,0,1]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        //lms to rgb
        mc = [
            [5.47221206,-4.6419601,0.16963708],
            [-1.1252419,2.29317094,-0.1678952],
            [0.02980165,-0.19318073,1.16364789]
        ]
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let newR = mc[0][0]*r + mc[0][1]*g + mc[0][2]*b;
            let newG = mc[1][0]*r + mc[1][1]*g + mc[1][2]*b;
            let newB = mc[2][0]*r + mc[2][1]*g + mc[2][2]*b;
            pixels[i] = newR;
            pixels[i + 1] = newG;
            pixels[i + 2] = newB;
        }

        updatePixels();
    }
{{</details>}}

# Conclusiones

El uso de este tipo de filtro ayuda a las personas daltónicas a tener una mejor aproximación de los colores que solían ver, mejorando su interacción con el entorno. 
# Trabajo Futuro

Es ideal mejorar la aproximación de las matrices de corrección con el fin de obtener una combinación más acertada de los colores reales y aplicar este método a videos con el fin de analizar su rendimiento.




