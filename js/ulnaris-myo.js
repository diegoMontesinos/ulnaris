function UlnarisMyo () {

	this.init = function (error) {

		// Configura los eventos con el Myo
		setupMyo(error);
	};

	function setupMyo (error) {

		// Verificamos que Myo.js haya sido incluida
		if(!Myo) {
			error(new Error("No se encontró la biblioteca Myo.js"));
			return;
		}

		/***************
		 * EVENTOS MYO *
		 ***************/

		// Error del Myo
		Myo.onError = function (err) {  
			error(err);
		}

		// Myo conectado
		Myo.on("connected", function() {
			console.log("El Myo '" + this.name + "' está conectado a Ulnaris!");
		});

		// Mano hacia adentro (Diapositiva anterior)
		Myo.on("wave_in", function() {
			Reveal.prev();
			this.vibrate();
		});

		// Mano hacia afuera (Siguiente diapositiva)
		Myo.on('wave_out', function() {
			Reveal.next();
			this.vibrate();
		});

		// Conecta el Myo
		Myo.connect();
	}
}