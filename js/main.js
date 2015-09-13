var ulnaris;
var slidesSequence = [
	"intro"
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
