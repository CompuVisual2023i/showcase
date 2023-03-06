# Color Blind

{{< p5-global-iframe id="breath" width="300" height="200" >}}
    let img;
    let button;
    let filtro;
    let num = 0;
    
    function preload(){
        img = loadImage('img.svg');
    }

    function setup() {
        button = createButton('Cambiar filtro');
        button.position(0, 0);
        button.mousePressed(changeFilter);
        createCanvas(img.width, img.height);
        textSize(32);        
    }

    function draw(){
        image(img,0,0);
        daltonize();
        text(filtro, 10, img.height - 10);
    }

    function changeFilter() {
        img = loadImage('img.svg');
        num = ((num+1) % 4)
        if (num === 0)
            filtro = 'Ninguno'
        else if (num === 1)
            filtro = 'Protanopia';
        else if (num===2)
            filtro = 'Deuteranopia';
        else if (num===3)
            filtro = 'Tritanopia';
        
    }

    function daltonize() {
        loadPixels();
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];

            if (filtro === "Protanopia") {
                let newR = 0.56667 * g + 0.43333 * b;
                let newG = 0.55833 * r + 0.44167 * b;
                let newB = 0 * r + 0.24167 * g + 0.75833 * b;
                pixels[i] = newR;
                pixels[i + 1] = newG;
                pixels[i + 2] = newB;
            } 
            else if (filtro === "Deuteranopia") {
                let newR = 0.625 * g + 0.375 * b;
                let newG = 0.7 * r + 0.3 * b;
                let newB = 0 * r + 0.3 * g + 0.7 * b;
                pixels[i] = newR;
                pixels[i + 1] = newG;
                pixels[i + 2] = newB;
            } 
            else if (filtro === "Tritanopia") {
                let newR = 0.95 * r + 0.05 * g;
                let newG = 0.433 * r + 0.567 * g + 0.1 * b;
                let newB = 0 * r + 0.475 * g + 0.525 * b;
                pixels[i] = newR;
                pixels[i + 1] = newG;
                pixels[i + 2] = newB;
            }
        }
        updatePixels();
    }
{{< /p5-global-iframe >}}
