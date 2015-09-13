function Ulnaris () {

	// Slides
	var slides;

	// Animation Manager
	var animations;

	// Myo Communication
	var myoComm;

	this.init = function (args) {

		// Carga los archivos de las diapositivas
		loadSlides(args.slides, function () {

			// Creamos e iniciamos la comunicacion con el Myo
			//myoComm = new UlnarisMyo();
			//myoComm.init();

			// Creamos el manejador de animaciones
			animations = new UlnarisAnimation();

			// Comenzamos con la presentación :D
			impress().init();
		}, args.onError);

		// Cargamos los eventos relacionados con Impress
		$(document).on("impress:stepenter", onEnterSlide);
	};

	function loadSlides (files, success, error) {

		// Creamos el objeto de diapositivas
		slides = {};

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

				// Agregamos el contenido de la diapositiva a la presentacion
				domSlide.appendTo("#impress");

				// Obtenemos el div de la diapositiva
				var stepElement = undefined;
				for (var j = 0; j < domSlide.length; j++) {
					if($(domSlide[j]).hasClass("step")) {
						stepElement = domSlide[j];
						break;
					}
				}

				// Creamos el registro de la diapositiva
				var slideId = $(stepElement).attr("id");

			} catch(err) {
				error(err);
				return;
			}
		}

		// Si no hubo un error regresamos
		success();
	}

	function loadAnimations () {
		// body...
	}

	function onEnterSlide (evt) {
		//console.log(evt);
	}
};
