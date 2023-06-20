# Entrega 2

# Raycasting app
{{< hint info >}} 

`1` use las teclas `WSAD` para moverse en el mapa  
`2` con el slider puede cambiar la resolución(número de rayos emitidos).  


{{< /hint >}}

{{< p5-iframe sketch="/showcase/sketches/raycasting.js" lib1="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.min.js" width="800" height="500" >}}

***
## Introducción 

Raycasting es una técnica imitar 3D. Fue usado en el desarrollo de videojuegos clásicos como Wolfenstein. Esta técnica permitía renderizar imágenes con el procesador para dar la impresión 
de 3D. Hoy día existen técnicas muy avanzadas como el raytracing y el raymarching que en principio se parecen al raytracing, pero son mucho más avanzadas y flexibles. 

## Código y resultados

El código de este app está basado en el siguiente video [Raycasting](https://www.youtube.com/watch?v=vYgIKn7iDH8) y conceptos clave en 
 [Visual computing](https://visualcomputing.github.io) 

 Este ejercicio expande lo explicado en el video mencionado, pero aquí se mejora el efecto de ojo de pescado. Básicamente es cuestión de ajustar algunos parámetros al momento de dibujar la escena.  
 
 Adicionalmente, se creo una escena donde se dibujan las paredes de forma similar como se hizo en el juego [Wolfenstein](https://en.wikipedia.org/wiki/Ray_casting). Para dibujar las paredes, se toma la distancia al observador, si el rayo toca una pared muy lejana, está se dibuja de menor altura con  respecto a las más cercanas. Es decir, se van lanzando rayos constantemente para saber la posición de cada pared en el laberinto. 
 
[Código completo](https://editor.p5js.org/jjmontoyag/sketches/fquKyRPR4) 

## Conclusiones y trabajo futuro.

Actualmente raytracing no se usa para dibujar escenas en 3D, primero porque es muy costoso computacionalmente en altas resoluciones. Sin embargo, se puede usar para detección de colisión. 