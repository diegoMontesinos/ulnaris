function Ulnaris () {

	// NW Window
	var nwWindow;

	// Videos en la presentación
	var videos = [];

	// Myo Communication
	var myoComm;
	
	this.D3 = new UlnarisD3();

	this.init = function (args) {

		// Referencia al nodewebkit
		nwWindow = require('nw.gui').Window.get();
		if(args.debug) {
			nwWindow.showDevTools();
		}

		// Obtenemos la configuracion del teclado
		var keyboardConfig = getKeboardConfig(args.myo);

		// Manejo de diapositivas
		if(args.myo) {

			// Creamos e iniciamos la comunicacion con el Myo
			myoComm = new UlnarisMyo();
			myoComm.init();
		}

		// Carga los archivos de las diapositivas
		loadSlides(args.slides, function () {

			// Inicializamos Reveal para la presentación
			Reveal.initialize({
				controls  : false,
				progress  : false,
				fragments : true,
				history   : true,
				center    : true,
				keyboard  : keyboardConfig,

				autoSlide          : 1000,
				autoSlideStoppable : false,

				width     : 2048,
				height    : 768,

				transition: 'concave',
				dependencies: [
					{ src: 'plugin/notes/notes.js', async: true }
				]
			});

			// Manejador de cambio de diapositiva
			Reveal.addEventListener("slidechanged", function( event ) {

				// Seteamos los videos
				for (var i = 0; i < videos.length; i++) {

					// Obtenemos el slide
					var slide = $(videos[i]).closest("section")[0];
					if(slide === event.currentSlide) {
						videos[i].currentTime = 0.0;
						videos[i].volume = 1.0;
						videos[i].play();
					}
					else {
						videos[i].pause();
					}
				}
			});
		}, args.onError);
	};

	this.associateVideo = function (video) {
		if(typeof video === "string") {
			video = $(video)[0];
		}

		if(video) {
			videos.push(video);
		}
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

	function getKeboardConfig (useMyo) {
		document.body.addEventListener("keypress", function (event) {
			console.log(event.which);
		}, false);

		var keyboard = {
			70 : function() {
				nwWindow.toggleFullscreen();
			}
		};

		return keyboard;
	}
}