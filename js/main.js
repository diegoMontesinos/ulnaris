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
	"indices-macroeconomicos",
	"perspectivas",
	"crecimiento-ti",
	"ingram-micro-market-share",
	"market-share-by-bu",
	"escenario-para-negocios-tic",
	"compromisos",
	"logros",
	"haciadondevamos",
	"marketing",
	"end"
];

function main (debug) {
	
	// Iniciamos Ulnaris
	ulnaris = new Ulnaris();
	ulnaris.init({
		slides: slidesSequence,
		myo: true,
		debug: true,
		onError: function (error) {
			console.log(error);
		}
	});
}
