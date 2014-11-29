
    g.createviz('chart', {
        margin: {top: 30, right: 30, bottom: 30, left: 30},
        serie: {
            lines: {show: true},
            points: {show: false},
            bars: {show: false}
        }
    }, function (chart, opts) {

        var paper = chart.paper(),
            defaults = chart.vizType().defaults;

        chart.addSeries = function (series) {
            // Loop through data and build the graph
            var xrange = [Infinity, -Infinity],
                yrange = [Infinity, -Infinity],
                data = [];

            series.forEach(function (serie) {

                if (isFunction (serie)) {
                    serie = serie(chart);
                }

                serie = addSerie(serie);

                if (serie) {
                    data.push(serie);
                    xrange[0] = Math.min(xrange[0], serie.xrange[0]);
                    xrange[1] = Math.max(xrange[1], serie.xrange[1]);
                    yrange[0] = Math.min(yrange[0], serie.yrange[0]);
                    yrange[1] = Math.max(yrange[1], serie.yrange[1]);
                }
            });

            paper.xAxis().scale().domain([ac(opts.xaxis.min, xrange[0]), ac(opts.xaxis.min, xrange[1])]);
            paper.yAxis().scale().domain([ac(opts.yaxis.min, yrange[0]), ac(opts.yaxis.min, yrange[1])]);

            data.forEach(function (serie) {
                addSerie(serie, true);
            });
            return chart;
        };

        chart.draw = function () {
            var data = opts.data;
            if (!data && opts.src)
                return chart.loadData(chart.draw);
            if (g._.isFunction(data))
                data = data(chart);
            chart.addSeries(data);

            // Axis
            if (show(opts.xaxis))
                paper.drawXaxis();
            if (show(opts.yaxis))
                paper.drawYaxis();
            if (show(opts.yaxis2, false))
                paper.drawYaxis();
        };


        chart.on('tick.main', function () {
            // Chart don't need ticking unless explicitly required (real time updates for example)
            chart.stop();
            chart.draw();
        });


        // INTERNALS
        function show (o, d) {
            if (o) {
                if (o.show === undefined)
                    return d === undefined ? true : d;
                else
                    return o.show;
            }
            return false;
        }

        function ac(val, calc) {
            val = val === undefined || val === null ? calc : val;
            return val;
        }

        function addSerie (serie, add) {
            // The serie is
            if (!serie) return;

            if (add) {
                paper.group();

                g.log.info('Add new serie to chart');

                copyMissing(defaults.serie, serie);

                if (serie.lines.show)
                    serie.lines = paper.path(serie.data, serie.lines);

                if (serie.points.show)
                    serie.points = paper.nodes(serie.data, serie.points);

                if (serie.bars.show)
                    serie.bars = paper.bars(serie.data, serie.bars);

                paper.parent();
            } else {

                if (isArray(serie)) {
                    serie = {data: serie};
                }
                return paper.xyData(serie);
            }
        }
    });