var ulnaris = new (function () {

	this.init = function (args) {

		// Carga los archivos de las diapositivas
		loadSlides(args.slides, function () {

			// Inicia impress
			impress().init();
		},	
		function (error) {
			console.log(error);
		});
	};

	function loadSlides (files, successCallback, errorCallback) {

		// Filesys
		var fs = require("fs");

		// Cargamos cada archivo de diapositiva
		var fileCount = 0;
		for (var i = 0; i < files.length; i++) {
			var fileName = files[i];
			fs.readFile("slides/" + files[i] + ".html", "utf8", function (error, data) {
				if (!error) {

					// Agregamos la diapositiva y su estilo
					$("#impress").append(data);

					// Aumentamos el contador y checamos si ya terminamos
					fileCount++;
					if(fileCount == files.length)
						successCallback();
				} else {
					errorCallback(error);
					return;
				}
			});
		}
	}
})();