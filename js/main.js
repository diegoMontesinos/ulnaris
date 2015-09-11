
var ulnaris;
var slidesSequence = [
	"intro",
	"be-se-refiere"
];

function Main() {
	require('nw.gui').Window.get().showDevTools();

	ulnaris = new Ulnaris();
	ulnaris.init({
		slides: slidesSequence,
		onError: function (error) {
			console.log(error);
		}
	});
}

$(document).ready(Main);