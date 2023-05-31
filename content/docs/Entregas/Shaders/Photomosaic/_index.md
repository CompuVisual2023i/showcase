# Photomosaic

{{< p5-global-iframe id="breath" width="570" height="330" >}}

    let img;
    let pg_1;
    let shader_ms;
    let resolution;
    let paintings = []; 
    let n = 10;
    let img2;
    let num = [];
    let paintings2 = [];

    function preload(){
        
        paintings ;
        for(let i =1;i<=n;i++) paintings.push(loadImage(`im${i}.jpg`));
        img = random(paintings);
        shader_ms = loadShader('shader.vert','shader.frag');
    }

    function setup(){
        
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
        num = sort(num);
        

        createCanvas(540,304, WEBGL);
        pg_1 = createGraphics(width * n, height, WEBGL);

        for (let i = 0; i < n; i++){
            for (let j = 0; j < n ; j++)
                if(num[i]==paintings2[j][0])
                    pg_1.image(paintings2[j][1],(-pg_1.width/2) + (pg_1.width/n) *i,-pg_1.height/2);
        }


        textureMode(NORMAL);
        noStroke();
        resolution = createSlider(1,100,30,1);
        resolution.position(10,10);
        resolution.input(() => shader_ms.setUniform('resolution', resolution.value()));
        shader(shader_ms);
        shader_ms.setUniform('uResolution',[width, height]);
        shader_ms.setUniform('uTexture',img);
        shader_ms.setUniform('nTexture',pg_1);
        shader_ms.setUniform('resolution',resolution.value());
        shader_ms.setUniform('n',n);
        
        
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