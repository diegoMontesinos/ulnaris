function Ulnaris () {

	// Videos en la presentación
	var videos = [];

	this.init = function (args) {

		// Carga los archivos de las diapositivas
		loadSlides(args.slides, function () {

			// Inicializamos Reveal para la presentación
			Reveal.initialize({
				controls  : false,
				progress  : false,
				fragments : true,
				history   : true,
				center    : true,

				autoSlide          : 1000,
				autoSlideStoppable : false,

				width     : 2048,
				height    : 768,

				//minScale  : 1.0,
				//maxScale  : 1.0,

				transition: 'concave',
				dependencies: [
					{ src: 'plugin/notes/notes.js', async: true }
				]
			});

			// Manejador de cambio de diapositiva
			Reveal.addEventListener("slidechanged", function( event ) {
			    // event.previousSlide, event.currentSlide, event.indexh, event.indexv
			    //console.log(event.currentSlide);
			});

			//Reveal.slide(2, 0, 0);
		}, args.onError);
	};

	this.associateVideo = function (video, state) {
		console.log(video);
		console.log(state);
		/*if(typeof video === "string") {
			video = $(video)[0];
		}*/
		/*Reveal.addEventListener(state, function () {
		}, false);*/
	};

	function loadSlides (files, success, error) {

		// Filesys
		var fs = require("fs");

		// Cargamos cada archivo de diapositiva
		var fileName, fileContent;
		for (var i = 0; i < files.length; i++) {
			fileName = "slides/" + files[i] + ".html";
			try {

				// Leemos el contenido del archivo
				fileContent = fs.readFileSync(fileName, "utf8");

				// Creamos el contenido DOM de la diapositiva
				var domSlide = $(fileContent);

				// Cargamos la hoja de estilo si es que tiene
				var cssFileName = "slides/css/" + files[i] + ".css";
				if(fs.existsSync(cssFileName)) {
					var linkCSS = document.createElement("link");
					linkCSS.rel = "stylesheet";
					linkCSS.href = cssFileName;
					
					domSlide.append(linkCSS);
				}

				// Agregamos el contenido de la diapositiva a la presentacion
				domSlide.appendTo("#reveal-slides");
			} catch(err) {
				error(err);
				return;
			}
		}

		// Si no hubo un error regresamos
		success();
	}
}