
    g.createviz('chart', {
        margin: {top: 30, right: 30, bottom: 30, left: 30},
        chartTypes: ['bar', 'line', 'point', 'pie'],

        line: {show: true},
        point: {show: false},
        bar: {show: false},
        pie: {show: false}
    },

    function (chart, opts) {

        var paper = chart.paper(),
            series = [];

        // iterator over each serie
        chart.each = function (callback) {
            series.forEach(callback);
            return chart;
        };

        chart.forEach = chart.each;

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

            paper.xAxis().scale().domain([ac(opts.xaxis.min, xrange[0]), ac(opts.xaxis.max, xrange[1])]);
            paper.yAxis().scale().domain([ac(opts.yaxis.min, yrange[0]), ac(opts.yaxis.max, yrange[1])]);

            data.forEach(function (serie) {
                addSerie(serie, true);
            });
            return chart;
        };

        chart.addSerie = function (serie) {
            return chart.addSeries([serie]);
        };

        chart.draw = function () {
            var data = opts.data;
            if (data === undefined && opts.src)
                return chart.loadData(chart.draw);
            if (g._.isFunction(data))
                data = data(chart);

            if (data) {
                chart.addSeries(data);

                if (show(opts.xaxis))
                    paper.drawXaxis();
                if (show(opts.yaxis))
                    paper.drawYaxis();
                if (show(opts.yaxis2, false))
                    paper.drawYaxis();
            }
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
                paper.group({'class': 'serie'});

                g.log.info('Add new serie to chart');

                series.push(serie);
                if (!serie.label)
                    serie.label = 'serie ' + series.length;

                opts.chartTypes.forEach(function (name) {
                    var o = serie[name];

                    if (o === undefined)
                        serie[name] = o = opts[name];

                    if (o.show)
                        serie[name] = chartTypes[name](chart, serie.data, o);
                });

                paper.parent();
            } else {

                if (isArray(serie)) {
                    serie = {data: serie};
                }
                return paper.xyData(serie);
            }
        }

    });

    var chartTypes = {
        line: function (chart, data, opts) {
            chart.paper().path(data, opts);
        },

        point: function (chart, data, opts) {
            chart.paper().points(data, opts);
        },

        bar: function (chart, data, opts) {
            chart.paper().barchart(data, opts);
        },

        pie: function (chart, data, opts) {
            chart.paper().pie(data, opts);
        }
    };
