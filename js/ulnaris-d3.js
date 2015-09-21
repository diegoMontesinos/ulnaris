function UlnarisD3 () {

	this.buildStackedBar = function (options) {

		// Dimensiones
		var width  = options.width - options.margin.left - options.margin.right;
		var height = options.height - options.margin.top - options.margin.bottom;

		// Escalas
		var x = d3.scale.ordinal()
		.rangeRoundBands([ 0, width ], .1);

		var y = d3.scale.linear()
		.rangeRound([ height, 0 ]);

		// Paleta de colores
		var color = d3.scale.category10();

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
		.attr("width", options.width + options.margin.left + options.margin.right)
		.attr("height", options.height + options.margin.top + options.margin.bottom)
		.append("g")
		.attr("transform", "translate(" + options.margin.left + "," + options.margin.top + ")");

		// Leemos los datos
		d3.json(options.jsonPath, function (error, root) {
			if (error) throw error;

			var data = root.data;
			var categories = root.categories;
			var names = data.map(function (d) { return d.name });

			// Dominio
			color.domain(d3.keys(categories));

			data.forEach(function (d) {
				var y0 = 0;
				d.stackedValues = color.domain().map(function (name) {
					return {
						name: name,
						y0: y0,
						y1: y0 += +d.value[name]
					};
				});
				d.total = d.stackedValues[d.stackedValues.length - 1].y1;
			});

			// Dominio
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
			.attr("class", "g")
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

			// Legends
			var legend = svg.selectAll(".legend")
			.data(color.domain().slice().reverse())
			.enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

			// Rectangulo (codigo de color)
			legend.append("rect")
			.attr("x", width - 18)
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", color);

			/*
			legend.append("text")
			.attr("x", width - 24)
			.attr("y", 9)
			.attr("dy", ".35em")
			.style("text-anchor", "end")
			.text(function(d) { return d; });
			*/
		});

		return svg;
	};
}