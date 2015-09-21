var ulnaris;
var slidesSequence = [
	"solo-logo",
	"intro-video",
	"intro",
	"porque-be",
	"be",
	"ingram-micro-es",
	"bienvenidos",
	"global",
	"lider-global-en-tecnologia",
	"incomparable-alcance",
	"billion-revenue",
	"capitalizando",
	"valores",
	"expectativas",
	"perspectivas",
	"crecimiento-ti",
	"bussiness-market-share",
	"marketing-share-bu",
	"marketing"
];

function main (debug) {
	
	// Iniciamos Ulnaris
	ulnaris = new Ulnaris();
	ulnaris.init({
		slides: slidesSequence,
		myo: false,
		debug: debug,
		onError: function (error) {
			console.log(error);
		}
	});
}
