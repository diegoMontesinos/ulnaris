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
	"market-share-bu",
	"bussiness-market-share"
	"escenario-para-negocios-tic",
	"compromisos",
	"compromisos2",
	"logros",
	"logros2",
	"estructura-ingram",
	"haciadondevamos",
	"be-soluciones-avanzadas",
	"oportunidades-de-negocios",
	"experiencia",
	"la-mayor-experiencia",
	"marketing",
	"end",
	"outro-video"
];

function main (debug) {
	
	// Iniciamos Ulnaris
	ulnaris = new Ulnaris();
	ulnaris.init({
		slides: slidesSequence,
		myo: false,
		debug: true,
		onError: function (error) {
			console.log(error);
		}
	});
}
