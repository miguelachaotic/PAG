# Tercera Práctica de Programación de Aplicaciones Gráficas
Esta práctica consiste en crear un modelo 3D de un tanque.

## Visualización en la Web

Puedes hacer click <a href="https://miguelachaotic.github.io/PAG/src/index.html" target="_blank">aquí</a> para visualizarlo en la Web.

## Localización del código

Todo el código se encuentra dentro de la carpeta [src](./src). Dentro de esta carpeta
existen 3 ficheros y 3 carpetas. Los ficheros son el [index](./src/index.html) donde
se encuentra el contenido básico de la página web, el [estilo](./src/style.css) donde 
están los estilos usados y por último, el [código javascript](./src/tanque.js) donde
se encuentra toda la lógica del programa y la creación del modelo 3D.

Dentro de la carpeta [components](src/components) se encuentran partes separadas del tanque
que he decidido modelarlas por separado debido a que aumentaban mucho la complejidad del programa.

Dentro de la carpeta [utils](src/utils) se encuentra un fichero con varias utilidades varias
que he considerado que eran necesarias y que posiblemente se usarían a lo largo de varios módulos.

Por último, dentro de la carpeta [textures](src/textures) se encuentran todas las texturas usadas.

A mayores, todo el código perteneciente a Three.js se encuentra en la carpeta 
[three.js-master](three.js-master)

## Instalación
Para instalar el proyecto, debe funcionar sobre un servidor web. Recomiendo usar el IDE Webstorm, de JetBrains ya que proporciona un servidor web por defecto al visualizar ficheros HTML. Con alguna extensión de Visual Studio Code debería funcionar también.

Para ejecutarlo, hay que abrir el fichero HTML con el servidor web.
Se puede usar este comando

`git clone https://github.com/miguelachaotic/PAG` para clonar el repositorio en local.

## Controles del modelo
En la parte superior izquierda se muestra un pequeño recuadro que indica en qué modo te encuentras. El modo inicial es el modo cámara.
Los controles de la cámara son WASD para moverse hacia adelante, izquierda, atrás y derecha respectivamente, y QE para moverse hacia arriba y abajo respectivamente.

Si se pulsa la barra espaciadora se cambia el texto de la parte superior izquierda a "Modo tanque". Si se vuelve a pulsar se vuelve a "Modo cámara".

En el modo tanque los controles son los siguientes: WS para mover el tanque hacia adelante y hacia atrás respectivamente, AD para girar hacia izquierda y derecha, y las flechas izquierda y derecha para rotar la torreta del tanque.

## Bibliotecas usadas

Para esta práctica solo se ha usado los elementos que vienen en Three.js Vanilla, es decir;
sin addons, ejemplos u otras características. 
