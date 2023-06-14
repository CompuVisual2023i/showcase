# Transformaciones - video juego

{{< hint info >}} 

Presione `ENTER` para pausar. 

{{< /hint >}}

{{< p5-iframe sketch="/showcase/sketches/game.js" lib1="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.min.js" lib2="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="820" height="670" >}}

{{< hint info >}} 

`1` use las teclas `WAD` para moverse y `espacio` o  `W` para disparar.  
`2` con el slider puede disminuir el volumen todo a la izquierda.
 

El video juego tiene 9 niveles de dificultad y un jefe final. 

{{< /hint >}}
***
## Introducción 

La industria de los video juegos a venido creciendo de forma exponencial. Años atrás los  
videojuegos eran exclusivos de plataformas específicas. Hoy día en un computador y un  
buscador se pueden acceder a ellos. En el trabajo presente se da una muestra de lo que  
se puede lograr con tecnologías web, tales como p5.js en el desarrollo 3D.

## Código y resultados

El código es bastante extenso así que se puede consultar aquí en [P5 editor](https://editor.p5js.org/jjmontoyag/sketches/PgGU6jCsc). 
Para la elaboración del video juego se usa conceptos clave encontrados en 
 [Visual computing/transformations](https://visualcomputing.github.io/docs/space_transformations/) 

 Trabajar 3D con p5 es muy fácil y tiene una amplia gama de funcionalidades. El trabajo con las   
 coordenadas es simplificado con el uso de `push()` y `pop()`. Si queremos pasar de marco de  
 referencia podemos entrar en las ramas de nuestra escena. Cada vez que se aplica  `push()`   
 se garantiza que todas las transformaciones en ese marco de referencia se realiza con relación  
 al marco de referencia padre.  En cuanto al terreno, este es generado con ruido de Perlin como  
 se puede ver en la sección de Visual Illusions. En cuanto a la iluminación se usa `directionalLight`, 
 hay dos fuentes de luz, una que sirve para simular el sol y otra para simular la luz reflejada del cielo.

 El game loop es también sencillo de manejar ya que por defecto se tiene 60FPS y no es necesario código extra.
 Todos las funciones de update y draw se pueden llamar desde p5.draw. 

 Las colisiones se manejan con círculos para simplificar los cálculos. 



## Conclusiones y trabajo futuro.

El uso de shaders puede ampliar de forma significativa los efectos de luz y texturas, por lo que  
en un trabajo posterior se pueden aplicar efectos adicionales y más realistas al trabajar con videojuegos. 
Durante el desarrollo del trabajo se encontró un posible `memory leak` en la librería de sonido. Cuando se 
usa el método `play()` en modo `restart` se espera que no se creen copias de ese sonido. Sin embargo, al repetir el sonido 
de disparo muchas veces, este se distorsiona al pasar unos minutos.

P5 como herramienta para trabajar de forma rápida y efectiva en 3D es una excelente opción. 