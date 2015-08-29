Ulnaris v1.0.0
==============================

Es una aplicación para presentaciones ejecutivas controladas por gestos hechos con el brazo. Estos gestos son capturados por el sensor [**Myo Gesture Control Armband**](https://www.myo.com/).

Todo el control, y la lógica de las presentaciones están hechas con Javascript usando el framework para aplicaciones de escritorio escritas como Web: [**Node Webkit**](https://github.com/nwjs/nw.js/).

Esto nos permite que las presentaciones sean archivos HTML5 con estilo CSS. Con esto se aprovecha el potencial de Webkit para el render del contenido: video, animaciones, estilos, transiciones, etc. Además de tener a disposición los diversos módulos que existen para NodeJS.

La intención del proyecto es crear una base para hacer varias presentaciones con distinto diseño y contenido. Así que no es una aplicación para crear presentaciones, sino para controlar presentaciones hechas con ciertas características.
Para crear una nueva presentación, por lo tanto, se debe copiar este proyecto y modificar el contenido HTML que viene por default.


Presentaciones y diapositivas
------------------------------

Cada presentación está conformada por una serie de diapositivas (*Slides*).
Los *Slides* se deben de guardar en la carpeta.

Los gestos controlan:

* Cambios de dipositiva
* Control de Video
* Control de audio
