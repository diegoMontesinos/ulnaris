var ulnaris;
var slidesSequence = [
	"bienvenidos",
	"solo-logo",
	"intro",
	"porque-be",
	"be",
	"ingram-micro-es",
	"lider-global-en-tecnologia",
	"incomparable-alcance"
];

function main (debug) {
	if(debug) {
		require('nw.gui').Window.get().showDevTools();
	}

	// Iniciamos Ulnaris
	ulnaris = new Ulnaris();
	ulnaris.init({
		slides: slidesSequence,
		onError: function (error) {
			console.log(error);
		}
	});
}
