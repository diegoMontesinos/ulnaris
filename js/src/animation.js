
function UlnarisAnimation () {

	// Animations
	var animationTimeouts = [];
	var animationCleanupWaiting = [];

	// Procesa un paso
	document.addEventListener("impress:applyStep", function (evt) {

		// Argumentos del evento
		var step = evt.detail.step;
		var eventData = evt.detail.eventData;
		
		// Leemos todas las animaciones de los elementos
		var substepsData = {};
		var substeps = [];

		// Obtenemos todos los que tengan datos de animacion
		$(step)
		.find("[data-ulnaris-fx]")
		.each(function (idx, element) {
			if($(element).closest(".step").is(step)) {
				substeps.push({ element: element });
			}
		});

		// Si no hubo subpasos, no hacemos nada
		if(substeps.length === 0) {
			return;
		}

		// Recorremos la lista
		$.each(substeps, function (idx, substep) {
			var dataStr = $(substep.element).data("ulnaris-fx");
			substep.info = parseSubstepInfo(dataStr);

			$(substep.element).addClass(substep.info.willClass);
			substep._on = [];
			substep._after = null;
		});

		// El paso cero auxiliar
		var current = {
			_after: undefined,
			_on: [],
			info: {}
		};

		// Recorremos los subpasos configurando
		$.each(substeps, function (idx, substep) {

			// El de despues
			var other = substep.info.after;
			if(other) {

				// Con el paso
				if(other === "step") {
					other = current;
				}

				// Previo
				else if(other === "prev") {
					other = substeps[idx - 1];
				}
				else {
					var index = find(substeps, other, 0, idx - 1);
					if(index === undefined) {
						index = find(substeps, other);
					}
					other = (index === undefined || index === idx) ? substeps[idx - 1] : substeps[index];
				}
			}

			// No hay otro
			else {
				other = substeps[idx - 1];
			}

			// Si hay otro
			if(other) {
				if(!substep.info.delay) {
					if(!other._after) {
						other._after = substep;
						return;
					}
					other = other._after;
				}
				other._on.push({
					substep: substep,
					delay: substep.info.delay || 0
				});
			}
		});

		// Obtenemos ahora si el paso cero
		if(current._after === undefined && current._on.length === 0) {
			var startStep = find(substeps, eventData.stepData.startSubstep) || 0;
			current._after = substeps[startStep];
		}

		// Los ordenamos
		var substepsInOrder = [];

		// Para encontrar la siguiente funcion
		function findNextFunc (idx, item) {
			if(item.substep._after) {
				current = item.substep._after;
				return false;
			}
		}

		do {
			var substepList = [{
				substep: current,
				delay: 0
			}];

			addOn(substepList, current, 0);
			substepsInOrder.push(substepList);
			current = null;
			$.each(substepList, findNextFunc);
		} while(current);

		substepsData.list = substepsInOrder;
		$(step).data("substepsData", substepsData);
	}, false);

	// Setea un paso activo
	document.addEventListener("impress:setActive", function (evt) {

		// Argumentos del evento
		var step = evt.detail.step;
		var eventData = evt.detail.eventData;

		// Obtenemos los datos de los subpasos
		var substepsData = $(step).data("substepsData");
		if(!substepsData) {
			return;
		}

		if(eventData.substep === undefined) {
			if(eventData.reason === "prev") {
				eventData.substep = substepsData.list.length - 1;
			} else {
				eventData.substep = 0;
			}
		}

		// Seteamos los timeouts
		var substep = eventData.substep;
		$.each(animationTimeouts, function (idx, timeout) {
			clearTimeout(timeout);
		});
		animationTimeouts = [];

		$.each(substepsData.list, function (idx, activeSubsteps) {
			var applyHas = idx < substep;
			var applyDo = idx <= substep;
			$.each(activeSubsteps, function (idx, substep) {
				if(substep.substep.info.hasClass) {
					$(substep.substep.element)[(applyHas ? "add" : "remove") + "Class"](substep.substep.info.hasClass);
				}

				function applyIt() {
					$(substep.substep.element).addClass(substep.substep.info.doClass);
				}
				if(applyDo && !applyHas && substep.delay && eventData.reason !== "prev") {
					if(substep.substep.info.doClass) {
						$(substep.substep.element).removeClass(substep.substep.info.doClass);
						animationTimeouts.push(setTimeout(applyIt, substep.delay));
					}
				} else {
					if(substep.substep.info.doClass) {
						$(substep.substep.element)[(applyDo ? "add" : "remove") + "Class"](substep.substep.info.doClass);
					}
				}
			});
		});
	}, false);

	/*

	this.unapplyStep = function (step, eventData) {

		// Obtenemos los datos de los subpasos
		var substepsData = $(step).data("substepsData");
		if(substepsData) {
			$.each(substepsData.list, function (idx, activeSubsteps) {
				$.each(activeSubsteps, function (idx, substep) {
					if(substep.substep.info.willClass) {
						$(substep.substep.element).removeClass(substep.substep.info.willClass);
					}
					if(substep.substep.info.hasClass) {
						$(substep.substep.element).removeClass(substep.substep.info.hasClass);
					}
					if(substep.substep.info.doClass) {
						$(substep.substep.element).removeClass(substep.substep.info.doClass);
					}
				});
			});
		}
	};

	this.setInactive = function (step, eventData) {
		if(eventData.nextStep === step) {
			return;
		}

		function cleanupAnimation (substepsData) {
			$.each(substepsData.list, function (idx, activeSubsteps) {
				$.each(activeSubsteps, function (idx, substep) {
					if(substep.substep.info.hasClass) {
						$(substep.substep.element).removeClass(substep.substep.info.hasClass);
					}
					if(substep.substep.info.doClass) {
						$(substep.substep.element).removeClass(substep.substep.info.doClass);
					}
				});
			});
		}
		$.each(eventData.current.animationCleanupWaiting, function (idx, item) {
			cleanupAnimation(item);
		});

		eventData.current.animationCleanupWaiting = [];
		var substepsData = $(step).data("substepsData");
		if(substepsData) {
			eventData.current.animationCleanupWaiting.push( substepsData );
		}
	};

	this.selectNext = function (step, eventData) {
		if(eventData.substep === undefined) {
			return;
		}
		var substepsData = $(step).data("substepsData");
		if(!substepsData) {
			return;
		}
		if(eventData.substep < substepsData.list.length - 1) {
			return {
				step: step,
				substep: eventData.substep + 1
			};
		}
	};

	this.selectPrev = function (step, eventData) {
		if(eventData.substep === undefined) {
			return;
		}
		var substepsData = $(step).data("substepsData");
		if(!substepsData) {
			return;
		}
		if(eventData.substep > 0) {
			return {
				step: step,
				substep: eventData.substep - 1
			};
		}
	};
*/

	function parseSubstepInfo (str) {

		// Parseamos la cadena
		var arr = str.split(" ");
		var className = arr[0];
		var config = {
			willClass: "will-" + className,
			doClass: "do-" + className,
			hasClass: "has-" + className
		};

		// Iteramos los argumentos
		var state = "";
		for(var i = 1; i < arr.length; i++) {

			// Leemos el estado
			var s = arr[i];
			switch(state) {
				case "":
					if(s === "after") {
						state = "after";
					} else {
						console.log("Ulnaris Animation: unknown keyword in '" + str + "'. '" + s + "' unknown.")
					}
					break;

				case "after":

					// Duración
					if(s.match(/^[1-9][0-9]*m?s?/)) {
						var value = parseFloat(s);
						if(s.indexOf("ms") !== -1) {
							value *= 1;
						} else if(s.indexOf("s") !== -1) {
							value *= 1000;
						} else if(s.indexOf("m") !== -1) {
							value *= 60000;
						}
						config.delay = value;
					} else {
						config.after = Array.prototype.slice.call(arr, i).join(" ");
						i = arr.length;
					}
					break;
			}
		}

		return config;
	}

	function find (array, selector, start, end) {
		end = end || (array.length - 1);
		start = start || 0;
		for(var i = start; i < end + 1; i++) {
			if($(array[i].element).is(selector)) {
				return i;
			}
		}
	}

	function addOn (list, substep, delay) {
		$.each(substep._on, function (idx, child) {
			list.push({
				substep: child.substep,
				delay: child.delay + delay
			});
			addOn(list, child.substep, child.delay + delay);
		});
	}
}