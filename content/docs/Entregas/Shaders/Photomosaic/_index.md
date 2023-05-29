# Photomosaic

{{< p5-global-iframe id="breath" width="570" height="330" >}}

    let img;
    let pg_1;
    let shader_ms;
    let resolution;
    let paintings; 
    let n = 10;

    function preload(){
        img = loadImage('rj.jpg');
        paintings = [];
        for(let i =1;i<n;i++) paintings.push(loadImage(`im${i}.jpg`));
        shader_ms = loadShader('shader.vert','shader.frag');
    }

    function setup(){
        createCanvas(540,304, WEBGL);
        pg_1 = createGraphics(width, height * n, WEBGL);
        textureMode(NORMAL);
        noStroke();
        resolution = createSlider(1,100,30,1);
        resolution.position(10,10);
        resolution.input(() => shader_ms.setUniform('resolution', resolution.value()));
        shader(shader_ms);
        shader_ms.setUniform('uResolution',[width, height]);
        shader_ms.setUniform('uTexture',img);
        shader_ms.setUniform('fTexture',img);
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