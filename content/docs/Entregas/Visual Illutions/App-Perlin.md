# Entrega 1

## App de visualización de terreno

***
## Introducción 
La naturaleza se forma en patrones interesantes, como las nubes, las montañas e inclusive los cúmulos de galaxias. 
En la computación gráfica, muchas veces se quiere emular este comportamiento *aleatorio*. Un ejemplo es la generación de terreno ya sea con fines de 
simular o en el área de los videojuegos.

En 1983, Ken Perlin desarrolló un método para generar gráficos con un aspecto menos *computarizado* de texturas y superficies.


## Código y resultados

{{< hint info >}} 

Esta app usa Perlin noise para generar terreno. Inspirado en este [video de Youtube](https://www.youtube.com/watch?v=IKB1hWWedMk).   

{{< /hint >}}


{{< p5-iframe sketch="/showcase/sketches/e11.js" lib1="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.min.js" width="625" height="625" >}}



{{< hint info >}} 

Para mover la cámara mueva el cursor para `arriba` y para `abajo`.


{{< /hint >}}


`El sombreado` se hace dependiendo de la altura,  o sea del  del valor del eje `z` que es obtenido de la función en `noise()` en ,`p5` a mayor altura el color se hace más claro. Es una forma de sombreado sencilla y computacionalmente no costosa.  Abajo se muestra el código que va dentro de los dos `for`s anidados que
dibujan la grilla en el canvas:

```tpl
 {
        fill(0, 
             map(z, ml, mh, 0, 200),
             map(z, ml, mh, 0, 200));

      vertex(x*scl, y*scl, z);
      vertex(x*scl, (y+1)*scl, terrain[y+1][x]);
      }
```



## Efecto bloom
Como se puede visualizar, hay una implementación rudimentaria de efecto bloom. Es más una ilusión óptica al colorear de forma diferente los triángulos
que están más alejados de la *cámara*.

El valor que se quiere mapear es `z` para obtener valores acordes con el color verde, en este caso la combinación de verde y azul. 

```tpl
 {
        
      //mountain
     fill(map(z, ml, mh, 0, 180), 
          map(z, ml, mh, 0, 255),
          255-20*y); 
      
      
      //top of mountain. Lighter green color
      if(z > mountainPeak){
        fill(map(z, ml, mh, 0, 200), 
             map(z, ml, mh, 0, 255),
             255-20*y)
      }
      
      
      vertex(x*scl, y*scl, z);
      vertex(x*scl, (y+1)*scl, terrain[y+1][x]);
      }
```




## Efecto de agua

Otra aplicación sencilla de ruido de Perlin es la generación de cuerpos de agua grandes. También es computacionalmente no costoso realizarlo y tiene un efecto visual interesante. 

{{< p5-iframe sketch="/showcase/sketches/e111.js" lib1="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.min.js" width="625" height="625" >}}


## Conclusiones y trabajo futuro.

El ruido de Perlin puede ser usado en una infinidad de formas para dar diferentes efectos visuales sin congestionar la GPU. En la implementación del efecto bloom, sería interesante recorrer el arreglo que contiene el terreno de tal forma que simule una fuente de luz. De tal manera que el efecto sea dinámico y dependa de el origen de la luz. El efecto de agua se puede complementar con iluminación, para un efecto más realista y añadir detección de colisión para permitir que objetos puedan flotar en el agua. 

