# Additive color models

{{< p5-global-iframe id="breath" width="500" height="400" >}}

    let formato; 
    let num = 0;
    let button;
    let x,y,z;
    let sliderx, slidery, sliderz;
    let imagen;
   
     function preload(){
        imagen =  imagen = createImage(200, 200);
    }

    function setup() {
        button = createButton('Cambiar formato');
      
        sliderx = createSlider(0, 360, 180);
        slidery = createSlider(0, 100, 50);
        sliderz = createSlider(0, 100, 50);
        
        sliderx.position(10, 340);
        slidery.position(150, 340);
        sliderz.position(290, 340);

        button.position(0, 0);
        button.mousePressed(changeFormat);
        createCanvas(450,350);
        textSize(26);        
    }

    function draw()
    {
        background(220);

        image(imagen, 0, 0);
        format();

        text(formato,350,25);
        text(sliderx.value(),10,300);
        text(slidery.value(),150,300);
        text(sliderz.value(),290,300);

        text(x,10,330);
        text(y,150,330);
        text(z,290,330);
    }

    function changeFormat() {
        num = ((num+1) % 3)
        if (num === 0){
            formato = 'HSL';
            x='H';
            y='S';
            z='L';

        }else if (num === 1){
            formato = 'HSB';
            x='H';
            y='S';
            z='B';
        }else if (num===2){
            formato = 'XYZ';
            x='X';
            y='Y';
            z='Z';
        }
        
    }

    function format()
    {

        if(formato === 'HSL'){
        for (let i = 0; i < imagen.width; i++) {
            for (let j = 0; j < imagen.height; j++) {
                imagen.set(i, j, color(sliderx.value(), slidery.value(), sliderz.value()));
            }           
        }
        imagen.updatePixels();
        image(imagen, 0, 0);
        }else if(formato === 'HSB')
        { for (let i = 0; i < imagen.width; i++) 
            {
                for (let j = 0; j < imagen.height; j++) 
                {
                imagen.set(i, j, color(slidery.value(), sliderx.value(), sliderz.value()));
                }
            }          
            imagen.updatePixels();
            image(imagen, 0, 0);
        }
        else if(formato === 'XYZ')
        {}
    }

{{< /p5-global-iframe >}}
