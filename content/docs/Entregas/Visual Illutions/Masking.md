# Entrega 1

## App de procesamiento de imágenes 
{{< hint info >}} 

`1` seleccione el filtro de color en la esquina izquierda superior.  
`2` seleccione el tipo de kernel para hacer la convolución.  
`3` ajuste el brillo de la imagen usando el slider.  
`4` opcionalmente puede descargar la imagen o cargar una del dispositivo. 


{{< /hint >}}

{{< p5-iframe sketch="/showcase/sketches/e13.js" lib1="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.min.js" width="760" height="750" >}}
***
## Introducción 
Las imágenes están compuestas de pixeles los cuales pueden ser manipulados para generar diferentes efectos y transformaciones interesantes.  
Este es el caso de las máscaras de convolución. En el presente trabajo se desea mostrar algunos efectos de color, brillo y filtros que se pueden lograr mediante la manipulación de pixeles y al aplicar diferentes máscaras de convolución.

 ![conv](/showcase/sketches/p2.gif)



{{< katex display left >}}
g(x, y) = w * f(x,y) = \sum_{\mathclap{dx = -a}}^{a} \quad \sum_{\mathclap{dy = -b}}^{b} w(dx, dy) f(x - dx, y - dy)
{{< /katex >}}

{{< katex display >}} \text{Donde } g(x,y) \thickspace \text { es la imagen filtrada, } f(x, y) \text { es la imagen original, } w \text { es el filtro kernel.} \newline
\text {Todo elemento del filtro kernel se toma así } -a\le dx \le a \text{ y } -b\le dy \le b \text{. }{{< /katex >}}

# Código y resultados


## Implementación del filtro
```tpl
function performConvolution(matrix, buffer, kernel){
    for(let i = 1; i < img.height; i++){
      
      if(i + 1 >= img.height) continue;
      
      for(let j = 1; j < img.width; j++){
         let rSum = 0;
         let gSum = 0;
         let bSum = 0;
        
         if(j + 1 >= img.width ) break;
        
         //bottom right
         rSum += kernel[2][2] * matrix[i+1][j+1][0];
         gSum += kernel[2][2] * matrix[i+1][j+1][1];
         bSum += kernel[2][2] * matrix[i+1][j+1][2];
        .
        .// repeat for all other 7
        .
        //center pixel
         rSum += kernel[1][1] * matrix[i][j][0];
         gSum += kernel[1][1] * matrix[i][j][1];
         bSum += kernel[1][1] * matrix[i][j][2];
        
         buffer[i][j][0] = rSum;
         buffer[i][j][1] = gSum;
         buffer[i][j][2] = bSum;
      
      }
     
      
    }
  return buffer;
  
}
```
## Ejemplos de kernels
Estos dos kernels producen el mismo efecto, sin embargo la diferencia es dónde la parte clara del contorno se ubica, derecha o izquierda.
```tpl
//left sobel

             [[1, 0, -1],
              [2, 0, -2],
              [1, 0, -1],
              ];

  
//right sobel
             [[-1, 0, 1],
              [-2, 0, 2],
              [-1, 0, 1],
             ];
  
```




## Conclusiones y trabajo futuro

Al usar diferentes tipos de colores los kernels pueden variar su comportamiento. Esto sirve para darle diferentes efectos a dichos kernels.También es interesante que estos filtros se pueden mezclar para generar diferentes efectos. Un posible trabajo futuro es analizar que efectos
tiene el aplicar una serie de filtros a una imagen (donde también es interesante repetir el mismo filtro y en ordenes diferentes) para generar
efectos variados que siempre tengan un resultado similar. Es decir, saber qué secuencia de filtros produce un efecto nuevo. 

