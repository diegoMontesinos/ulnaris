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
	"bussiness-market-share",
	"escenario-para-negocios-tic",
	"compromisos",
	"compromisos2",
	"logros",
	"logros2",
	"estructura-ingram",
	"haciadondevamos",
	"estrategia2016",
	"mercados",
	"soluciones-avanzadas",
	"consolidacion-modelo-negocios",
	"estructura2015",
	"preventa-posventa-a",
	"preventa-posventa-b",
	"seguridad-fisica",
	"global-training-center",
	"cloud",
	"crecimiento-negocios-tic",
	"cloud-market-place",
	"test01",
	"test02",
	"test03",
	"test04",
	/*
	"movilidad",
	"oportunidades-de-negocios",
	"atencion",
	"be-soluciones-avanzadas",
	"experiencia",
	"la-mayor-experiencia",
	"marketing",
	*/
	"end",
	"outro-video"
];

function main (debug) {
	
	// Iniciamos Ulnaris
	ulnaris = new Ulnaris();
	ulnaris.init({
		slides: slidesSequence,
		myo: false,
		debug: false,
		onError: function (error) {
			console.log(error);
		}
	});
}
