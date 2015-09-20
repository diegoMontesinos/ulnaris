var ulnaris;
var slidesSequence = [
	"solo-logo",
	"intro-video",
	"intro",
	"porque-be",
	"be",
	"ingram-micro-es",
	"bienvenidos",
	"lider-global-en-tecnologia",
	"incomparable-alcance",
	"billion-revenue"
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
