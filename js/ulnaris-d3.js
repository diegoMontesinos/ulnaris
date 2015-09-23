function UlnarisD3 () {

	this.buildStackedBar = function (options) {

		// Dimensiones
		var margin = options.margin;
		var width  = options.width - margin.left - margin.right;
		var height = options.height - margin.top - margin.bottom;

		// Escalas
		var x = d3.scale.ordinal()
		.rangeRoundBands([ 0, width ], options.columnWidth);

		var y = d3.scale.linear()
		.rangeRound([ height, 0 ]);

		// Paleta de colores
		var color = options.colors;

		// Ejes
		var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

		var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format(".2s"));

		// SVG
		var svg = d3.select(options.container)
		.append("svg")
		.attr("width", width + margin.left + margin.right + 200)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Leemos los datos
		d3.json(options.jsonPath, function (error, root) {
			if (error) throw error;

			var data = root.data;
			var categories = root.categories;
			var names = data.map(function (d) { return d.name });

			// Dominio
			color.domain(d3.keys(categories));

			// Acomodamos los datos
			data.forEach(function (d) {
				var y0 = 0;
				d.stackedValues = color.domain().map(function (name) {
					return {
						name: name,
						y0: y0,
						y1: y0 += +d.value[name],
						value: +d.value[name]
					};
				});
				d.total = d.stackedValues[d.stackedValues.length - 1].y1;
			});

			// Dominios
			x.domain(names);
			y.domain([0, d3.max(data, function (d) { return d.total; })]);

			// Ejes
			svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

			svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);

			// Barras
			var stacked = svg.selectAll(".stackedValue")
			.data(data)
			.enter().append("g")
			.attr("class", "stackedValue")
			.attr("transform", function (d) {
				return "translate(" + x(d.name) + ",0)";
			});

			stacked.selectAll("rect")
			.data(function (d) { return d.stackedValues; })
			.enter().append("rect")
			.attr("width", x.rangeBand())
			.attr("y", function (d) { return y(d.y1); })
			.attr("height", function (d) { return y(d.y0) - y(d.y1); })
			.style("fill", function (d) { return color(d.name); });

			// Labels
			var stackedlabels = svg.selectAll(".stackedLabel")
			.data(data)
			.enter().append("g")
			.attr("class", "stackedLabel")
			.attr("transform", function (d) {
				return "translate(" + x(d.name) + ",0)";
			});

			stackedlabels.selectAll("text")
			.data(function (d) { return d.stackedValues; })
			.enter().append("text")
			.style("fill", "#fff")
			.style("font-size", "18px")
			.attr("x", -45)
			.attr("y", function (d) {
				var height = y(d.y0) - y(d.y1)
				return y(d.y1) + (height * 0.65);
			})
			.text(function (d) {
				if(d.value > 0) {
					return d.value + "%";
				} else {
					return "";
				}
			});

			// Legends
			var legend = stacked.selectAll(".legend")
			.data(color.domain().slice().reverse())
			.enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

			legend.append("rect")
			.attr("x", width - 10)
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", color);

			legend.append("text")
			.attr("x", width + 10)
			.attr("y", 9)
			.attr("dy", "0.35em")
			.style("text-anchor", "start")
			.text(function (d) {
				return categories[d];
			});

			options.onload(svg, x, y, color);
		});
	};

	this.buildDonut3D = function (options) {
		var id   = options.id,
			data = options.data,
			x    = options.x,   y = options.y,
			rx   = options.rx, ry = options.ry,
			h    = options.height,
			ir   = options.innerRadius;
		var width = $("#" + id).closest("svg").width();

		var _data = d3.layout.pie()
		.sort(null)
		.value(function (d) { return d.value; })(data);

		var slices = d3.select("#" + id)
		.append("g")
		.attr("transform", "translate(" + x + "," + y + ")")
		.attr("class", "slices");

		slices.selectAll(".innerSlice")
		.data(_data)
		.enter().append("path")
		.attr("class", "innerSlice")
		.style("fill", function (d) { return d3.hsl(d.data.color).darker(0.7); })
		.attr("d",function (d){ return pieInner(d, rx + 0.5, ry + 0.5, h, ir); })
		.each(function (d) { this._current = d; });
		
		slices.selectAll(".topSlice")
		.data(_data).enter().append("path")
		.attr("class", "topSlice")
		.style("fill", function (d) { return d.data.color; })
		.style("stroke", function (d) { return d.data.color; })
		.attr("d",function (d) { return pieTop(d, rx, ry, ir); })
		.each(function (d) { this._current = d; });
		
		slices.selectAll(".outerSlice")
		.data(_data).enter().append("path")
		.attr("class", "outerSlice")
		.style("fill", function (d) { return d3.hsl(d.data.color).darker(0.7); })
		.attr("d",function (d) { return pieOuter(d, rx-.5,ry-.5, h); })
		.each(function (d) { this._current = d ;});

		slices.selectAll(".percent")
		.data(_data).enter().append("text")
		.attr("class", "percent")
		.attr("x",function (d) { return 1.05*rx*Math.cos(0.5*(d.startAngle+d.endAngle)); })
		.attr("y",function (d) { return 1.05*ry*Math.sin(0.5*(d.startAngle+d.endAngle)); })
		.text(getPercent).each(function (d) { this._current = d;});

		// Legends
		var legend = d3.select("#" + id).selectAll(".legend")
		.data(_data).enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) {
			return "translate(" + (width - 250) + "," + (i * 30 + 90) + ")";
		});

		legend.append("rect")
		.attr("x", 10)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", function (d) {
			return d.data.color;
		});

		legend.append("text")
		.attr("x", 35)
		.attr("y", 9)
		.attr("dy", "0.35em")
		.style("text-anchor", "start")
		.text(function (d) {
			return d.data.label;
		});
	};

	this.transitionDonut3D = function (options) {
		var id = options.id,
			data = options.data,
			rx = options.rx, ry = options.ry,
			h = options.height,
			ir = options.innerRadius,
			duration = options.duration;

		function arcTweenInner (a) {
			var i = d3.interpolate(this._current, a);
			this._current = i(0);
			return function (t) {
				return pieInner(i(t), rx+0.5, ry+0.5, h, ir);
			};
		}

		function arcTweenTop (a) {
			var i = d3.interpolate(this._current, a);
			this._current = i(0);
			return function (t) {
				return pieTop(i(t), rx, ry, ir);
			};
		}

		function arcTweenOuter(a) {
			var i = d3.interpolate(this._current, a);
			this._current = i(0);
			return function (t) {
				return pieOuter(i(t), rx-.5, ry-.5, h);
			};
		}

		function textTweenX (a) {
			var i = d3.interpolate(this._current, a);
			this._current = i(0);
			return function (t) {
				return 1.05 * rx * Math.cos(0.5 * (i(t).startAngle + i(t).endAngle));
			};
		}

		function textTweenY (a) {
			var i = d3.interpolate(this._current, a);
			this._current = i(0);
			return function (t) {
				return 1.05 * ry * Math.sin(0.5 * (i(t).startAngle + i(t).endAngle));
			};
		}

		var _data = d3.layout.pie()
		.sort(null)
		.value(function (d) {
			return d.value;
		})(data);
		
		d3.select("#" + id).selectAll(".innerSlice")
		.data(_data)
		.transition()
		.duration(duration)
		.attrTween("d", arcTweenInner); 
		
		d3.select("#" + id).selectAll(".topSlice")
		.data(_data)
		.transition()
		.duration(duration)
		.attrTween("d", arcTweenTop); 
		
		d3.select("#" + id).selectAll(".outerSlice")
		.data(_data)
		.transition()
		.duration(duration)
		.attrTween("d", arcTweenOuter);

		d3.select("#" + id).selectAll(".percent")
		.data(_data)
		.transition()
		.duration(duration)
		.attrTween("x", textTweenX)
		.attrTween("y", textTweenY)
		.text(getPercent);
	};

	this.buildLineChart = function (options) {

		// Dimensiones
		var margin = options.margin;
		var width  = options.width - margin.left - margin.right;
		var height = options.height - margin.top - margin.bottom;

		// Escalas
		var x = d3.scale.ordinal()
		.rangeRoundBands([ 0, width ], options.rangeWidth);

		var y = d3.scale.linear()
		.range([ height, 0 ]);

		// Ejes
		var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

		var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

		// Linea
		var lineFunc = d3.svg.line()
		.x(function (d) {
			return x(d.label);
		})
		.y(function (d) {
			return y(d.value);
		});

		// SVG
		var svg = d3.select(options.container).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);

		// Grafica
		svg = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Cargamos los datos
		var linesData = options.linesData;

		// Dominio
		x.domain(linesData[0].map(function (d) { return d.label }));
		y.domain([
			d3.min(linesData, function (d) { return d3.min(d, function (d) { return d.value })}),
			d3.max(linesData, function (d) { return d3.max(d, function (d) { return d.value })}),
		]);

		// Ejes
		svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

		svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);

		var linesPath = [];
		for (var i = 0; i < linesData.length; i++) {
			linesPath.push(
				svg.append("path")
				.datum(linesData[i])
				.attr("class", "line-chart")
				.attr("d", lineFunc)
			);
		}

		return linesPath;
	};

	function pieTop (d, rx, ry, ir) {
		if(d.endAngle - d.startAngle == 0 ) return "M 0 0";
		var sx = rx*Math.cos(d.startAngle),
			sy = ry*Math.sin(d.startAngle),
			ex = rx*Math.cos(d.endAngle),
			ey = ry*Math.sin(d.endAngle);
			
		var ret =[];
		ret.push("M",sx,sy,"A",rx,ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0),"1",ex,ey,"L",ir*ex,ir*ey);
		ret.push("A",ir*rx,ir*ry,"0",(d.endAngle-d.startAngle > Math.PI? 1: 0), "0",ir*sx,ir*sy,"z");
		return ret.join(" ");
	}

	function pieOuter(d, rx, ry, h ){
		var startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
		var endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);
		
		var sx = rx*Math.cos(startAngle),
			sy = ry*Math.sin(startAngle),
			ex = rx*Math.cos(endAngle),
			ey = ry*Math.sin(endAngle);
			
			var ret =[];
			ret.push("M",sx,h+sy,"A",rx,ry,"0 0 1",ex,h+ey,"L",ex,ey,"A",rx,ry,"0 0 0",sx,sy,"z");
			return ret.join(" ");
	}

	function pieInner(d, rx, ry, h, ir ) {
		var startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
		var endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);
		
		var sx = ir*rx*Math.cos(startAngle),
			sy = ir*ry*Math.sin(startAngle),
			ex = ir*rx*Math.cos(endAngle),
			ey = ir*ry*Math.sin(endAngle);

			var ret =[];
			ret.push("M",sx, sy,"A",ir*rx,ir*ry,"0 0 1",ex,ey, "L",ex,h+ey,"A",ir*rx, ir*ry,"0 0 0",sx,h+sy,"z");
			return ret.join(" ");
	}

	function getPercent(d) {
		var percentStr = Math.round(1000*(d.endAngle-d.startAngle)/(Math.PI*2))/10+'%';
		return percentStr;
	}
}