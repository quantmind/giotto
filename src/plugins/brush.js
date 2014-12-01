    //
    //  Add brush functionality to svg paper
    g.paper.svg.plugin('brush', {
        axis: 'x',
        opacity: 0.125,
        fill: '#000'
    },

    function (paper, opts) {
        var cid, brush;

        paper.brush = function () {
            return brush;
        };

        // Add a brush to the paper if not already available
        paper.addBrush = function (options) {
            if (_.isObject(options))
                extend(opts.brush, options);

            if (!cid) {
                brush = d3.svg.brush()
                                .on("brushstart", brushstart)
                                .on("brush", brushmove)
                                .on("brushend", brushend);

                cid = paper.addComponent(function () {
                    if (!brush) return;

                    var current = paper.root().current(),
                        gBrush = current.select('g.brush');

                    if (opts.brush.axis === 'x') brush.x(paper.xAxis().scale());

                    if (!gBrush.node()) {
                        if (opts.brush.extent)
                            brush.extent(opts.brush.extent);
                        gBrush = current.append('g');

                        var rect = gBrush.call(brush).selectAll("rect")
                                            .attr('fill', opts.brush.fill)
                                            .attr('fill-opacity', opts.brush.opacity);

                        if (opts.brush.axis === 'x') {
                            gBrush.attr("class", "brush x-brush");
                            rect.attr("y", -6).attr("height", paper.innerHeight() + 7);
                        }
                    }

                });
            }

            brushstart();
            brushmove();
            brushend();


            return brush;
        };

        paper.removeBrush = function () {
            cid = paper.removeComponent(cid);
            paper.root().current().select('g.brush').remove();
            brush = null;
        };


        function brushstart () {
            paper.root().current().classed('selecting', true);
            if (opts.brush.start) opts.brush.start();
        }

        function brushmove () {
            if (opts.brush.move) opts.brush.move();
        }

        function brushend () {
            paper.root().current().classed('selecting', false);
            if (opts.brush.end) opts.brush.end();
        }
    });


    //
    //  Add brush functionality to charts
    g.viz.chart.plugin(function (chart, opts) {
        var dimension,
            brush, brushopts;

        if (opts.brush) {
            brush = opts.brush;
            if (!_.isObject(brush)) brush = {};
            brushopts = extend({}, brush);

            brushopts.start = function () {
                if (brush.start) brush.start(chart);
            };

            brushopts.move = function () {
                //
                // loop through series and add selected class
                chart.each(function (serie) {
                    var brush = chart.paper().brush(),
                        s = brush.extent();

                    if (serie.point.chart)
                        serie.point.chart.selectAll('.point')
                            .classed("selected", function(d) {
                                return s[0] <= d.x && d.x <= s[1];
                            });
                    if (serie.bar.chart)
                        serie.bar.chart.selectAll('.bar')
                            .classed("selected", function(d) {
                                return s[0] <= d.x && d.x <= s[1];
                            });
                });
                if (brush.move) brush.move(chart);
            };

            brushopts.end = function () {
                if (brush.end) brush.end(chart);
            };
        }

        chart.dimension = function (x) {
            init();
            if (!arguments.length) return dimension;
            dimension = x;
            return chart;
        };

        chart.on('tick.brush', function () {
            if (brushopts)
                chart.paper().addBrush(brushopts);
        });

    });