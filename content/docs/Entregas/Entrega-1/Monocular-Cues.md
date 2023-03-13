# Entrega 1

## App sobre Monocular Cues

***
## Introducción

Cuando un observador se mueve y ve objetos pasar, los objetos más cercanos dan la impresión de moverse más rápido que los que se encuentran más lejanos del observador. Este efecto se conoce como *parallax*.

## Código

En la siguiente aplicación se va a usar el mismo principio. La escena está enteramente en 2D. Sin embargo, al cambiar el tamaño relativo de cada rectángulo, estos dan una impresión de 3D. El siguiente código muestra la función principal para dar el efecto 3D. La velocidad de cada rectángulo es relativa, entre más se aleja del observador se mueve más lento. El tamaño cambia de forma análoga, de tal forma que los rectángulos más lejanos disminuyen su tamaño. Los objetos rectángulo se guardan en un arreglo para luego dibujar en el canvas.

```tpl
 function createPerspective(){
  let referenceDistance = 1;
  let referenceVelocity = 50; 
   //create objects
  for(let i = 0; i < 20; i++){
     pos = {x:mouseX, y:mouseY};
     myColor = {r:0, g:10*i, b:0, t:20};
    
    //calculate scale from a distance
    let referenceScale = 400;
    let observerDistance = referenceDistance*i;
    let apparentSize = referenceScale / (observerDistance * referenceDistance);
    let velocity = referenceVelocity/observerDistance;
    
    ob = new Object2D(pos, myColor, velocity, apparentSize, "r");
    objects.push(ob);
  
  }
}
```

{{< hint info >}} 

-Haga `doble clic` para generar conjunto de planos.
-`Clic izquierdo` sostenido y `mover el ratón` para cambiar vista.


{{< /hint >}}

{{< p5-iframe sketch="/showcase/sketches/e12.js" lib1="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.min.js" width="625" height="625" >}}



## Conclusiones y trabajo a futuro

Sería interesante generar imágenes 3D a partir de capas en 2D y medir su rendimiento vs imágenes 3D. Por supuesto esta forma de procesar imágenes tiene sus limitaciones, sin embargo se puede aplicar en ciertas ocasiones puntuales. En la foto de abajo se aprecia una escultura de papel que puede descomponerse en muchas capas.  


 ![papel](/showcase/sketches/p1.png)





