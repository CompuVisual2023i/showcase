# Efectos de post-procesado 


Hacer Click en la imagen para cambiar el efecto.
1. Bloom
2. Invertir colores  

{{< p5-global-iframe id="breath" width="535" height="430" >}}

    //Bloom
    let pg_1, pg_2;
    let shader_1, shader_2;

    //Invertir colores
    let pg_3;
    let shader_3;


    let s = 0;

    let img;

    function preload() {
        shader_1 = loadShader('shader.vert','shader.frag');
        shader_2 = loadShader('shader.vert','shader.frag');   
        shader_3 = loadShader('shader_ic.vert','shader_ic.frag');
        img = loadImage('ne.jpg');
    }

    function setup() {
        createCanvas(512, 405);
        pg_1 = createGraphics(width, height, WEBGL);
        pg_2 = createGraphics(width, height, WEBGL);
        pg_3 = createGraphics(width, height, WEBGL);
        noStroke;
        pg_1.noStroke();
        pg_2.noStroke();
        pg_1.image(img,-512/2,-405/2);
        pg_3.image(img,-512/2,-405/2);
        
    }



    function draw() {
        if (s==1){
            pg_1.shader(shader_1);

            shader_1.setUniform("tex", img);
            shader_1.setUniform("resolution", [width, height]);
            shader_1.setUniform("direction", [1.5, 0]);

            pg_1.rect(0, 0, width, height);

            pg_2.shader(shader_2);

            shader_2.setUniform("tex", pg_1);
            shader_2.setUniform("resolution", [width, height]);
            shader_2.setUniform("direction", [0, 1.5]);
            
            pg_2.rect(0, 0, width, height);

            image(pg_2, 0, 0);
        }
        else if(s==2){
            pg_3.shader(shader_3);
            shader_3.setUniform("uResolution", [width, height]);
            shader_3.setUniform("uTexture", img);
            pg_3.beginShape();
            pg_3.vertex(-width / 2, height / 2, 0, 1);
            pg_3.vertex(width / 2, height / 2, 1, 1);
            pg_3.vertex(width / 2, -height / 2, 1, 0);            
            pg_3.vertex(-width / 2, -height / 2, 0, 0);            
            pg_3.endShape(CLOSE);
            image(pg_3, 0, 0);

        } 
        else
           image(img, 0, 0); 
        
    }

    function mousePressed(){
        if(s<2) s++;
        else s=0;
    }

{{< /p5-global-iframe >}}