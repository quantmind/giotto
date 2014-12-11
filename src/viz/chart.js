
    g.createviz('chart', {
        margin: {top: 30, right: 30, bottom: 30, left: 30},
        chartTypes: ['pie', 'bar', 'line', 'point']
    },

    function (chart, opts) {

        var series = [],
            xrange, yrange;

        chart.numSeries = function () {
            return series.length;
        };

        // iterator over each serie
        chart.each = function (callback) {
            series.forEach(callback);
            return chart;
        };

        chart.forEach = chart.each;

        chart.addSeries = function (series) {
            // Loop through data and build the graph
            var data = [];

            series.forEach(function (serie) {

                if (isFunction(serie))
                    serie = serie(chart);

                serie = formatSerie(serie);

                if (serie) {
                    if (!serie.pie) {
                        serie = xyData(serie);
                        if (!xrange) {
                            xrange = [Infinity, -Infinity];
                            yrange = [Infinity, -Infinity];
                        }
                        xrange[0] = Math.min(xrange[0], serie.xrange[0]);
                        xrange[1] = Math.max(xrange[1], serie.xrange[1]);
                        yrange[0] = Math.min(yrange[0], serie.yrange[0]);
                        yrange[1] = Math.max(yrange[1], serie.yrange[1]);
                    }
                    data.push(serie);
                }
            });

            return data;
        };

        chart.addSerie = function (serie) {
            return chart.addSeries([serie]);
        };

        chart.clear = function () {
            chart.paper().clear();
            series = [];
            return chart;
        };

        chart.draw = function () {
            var paper = chart.paper(),
                data = opts.data;

            // load data if in options
            if (data) {
                delete opts.data;
                if (data === undefined && opts.src)
                    return chart.loadData(chart.draw);
                if (g._.isFunction(data))
                    data = data(chart);
            }

            if (data)
                data = chart.addSeries(data);

            if (data || opts.type !== paper.type()) {

                if (opts.type !== paper.type()) {
                    paper = chart.paper(true);
                    data = series;
                }

                if (xrange) {
                    paper.xAxis().scale().domain([ac(opts.xaxis.min, xrange[0]), ac(opts.xaxis.max, xrange[1])]);
                    paper.yAxis().scale().domain([ac(opts.yaxis.min, yrange[0]), ac(opts.yaxis.max, yrange[1])]);
                }

                data.forEach(function (serie) {
                    drawSerie(serie);
                });

                if (data.length === series.length && xrange) {
                    if (show(opts.xaxis))
                        paper.drawXaxis();
                    if (show(opts.yaxis))
                        paper.drawYaxis();
                    if (show(opts.yaxis2, false))
                        paper.drawYaxis();
                }
            }

            // Render the chart
            chart.render();
        };

        chart.setSerieOption = function (type, field, value) {

            if (opts.chartTypes.indexOf(type) === -1) return;

            if (!chart.numSeries()) {
                opts[type][field] = value;
            } else {
                chart.each(function (serie) {
                    if (serie[type])
                        serie[type].setOptions(field, value);
                });
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

        function formatSerie (serie) {
            if (!serie) return;
            if (isArray(serie)) serie = {data: serie};

            var paper = chart.paper(),
                color, show, o;

            series.push(serie);
            if (!serie.label)
                serie.label = 'serie ' + series.length;

            opts.chartTypes.forEach(function (type) {
                o = serie[type];
                if (o) {
                    if (isArray(o))
                        serie.data = o;
                    o = {};
                }
                if (o || opts[type].show) {
                    if (!o) o = {};
                    extend(o, opts[type]);
                    serie[type] = o;
                    show = true;
                }
            });

            // None of the chart are shown, specify line
            if (!show)
                serie.line = extend({}, opts.line);

            opts.chartTypes.forEach(function (type) {
                o = serie[type];

                if (o && type !== 'pie' && !o.color) {
                    // pick a default color if one is not given
                    if (!color)
                        color = paper.pickColor();
                    o.color = color;
                }
            });

            return serie;
        }

        function drawSerie (serie) {
            // The serie is
            var paper = chart.paper();

            paper.group({'class': 'serie ' + slugify(serie.label)});

            opts.chartTypes.forEach(function (type) {
                if (serie[type])
                    serie[type] = chartTypes[type](chart, serie.data, serie[type]);
            });

            paper.parent();
        }

    });

    var chartTypes = {

        pie: function (chart, data, opts) {
            return chart.paper().pie(data, opts);
        },

        bar: function (chart, data, opts) {
            return chart.paper().barchart(data, opts);
        },

        line: function (chart, data, opts) {
            return chart.paper().path(data, opts);
        },

        point: function (chart, data, opts) {
            return chart.paper().points(data, opts);
        }
    };

    var xyData = function (data) {
        if (!data) return;
        if (!data.data) data = {data: data};

        var xy = data.data,
            xmin = Infinity,
            ymin = Infinity,
            xmax =-Infinity,
            ymax =-Infinity,
            x = function (x) {
                xmin = x < xmin ? x : xmin;
                xmax = x > xmax ? x : xmax;
                return x;
            },
            y = function (y) {
                ymin = y < ymin ? y : ymin;
                ymax = y > ymax ? y : ymax;
                return y;
            };
        var xydata = [];
        if (isArray(xy[0]) && xy[0].length === 2) {
            xy.forEach(function (xy) {
                xydata.push({x: x(xy[0]), y: y(xy[1])});
            });
        } else {
            var xl = data.xlabel || 'x',
                yl = data.ylabel || 'y';
            xy.forEach(function (xy) {
                xydata.push({x: x(xy[xl]), y: y(xy[yl])});
            });
        }
        data.data = xydata;
        data.xrange = [xmin, xmax];
        data.yrange = [ymin, ymax];
        return data;
    };
