---
weight: 2
---



## Santiago Gomez



Hola, mi nombre completo es Santiago Jesus Gomez Gil, soy estudiante de ingeniería de sistemas y computación de la Universidad Nacional de Colombia. Me gustan los temas relacionados con redes, programación y electronica. Mi genero preferido de música es el rock, generalmente el de los 90's y  el indie. En mis ratos libres me gusta jugar videojuegos y  ver series o películas.


<center>
{{< p5-instance-div id="square" >}}

    let angulo = 0;
    let b = true;

    p5.setup = function(){
        p5.createCanvas(300,300, p5.WEBGL);
        myShader = p5.loadShader('shader.vert','shader.frag');
        p5.noStroke();        
    }

    p5.draw = function(){
        p5.background(0);
        p5.push();
        p5.rotate(angulo);
        p5.fill(200);
        p5.rect(-100,-100,200,200);
        p5.pop();
        if(b){
            p5.fill(255);
            p5.rect(-150,-150,130,130);
            p5.rect(20,-150,130,130);
            p5.rect(-150,20,130,130);
            p5.rect(20,20,130,130);
        }
        angulo += 0.02
        
    }

    p5.mouseClicked = function (){
        if (b == true) {
            b = false
        }
        else b = true
    }

{{< /p5-instance-div >}}
</center>