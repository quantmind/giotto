
    g.createviz('chart', {
        margin: {top: 30, right: 30, bottom: 30, left: 30},
        chartTypes: ['pie', 'bar', 'line', 'point'],
        serie: {
            x: function (d) {return d[0];},
            y: function (d) {return d[1];}
        }
    },

    function (chart, opts) {

        var series = [],
            allranges = {};

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
            addSeries(series);
            return chart;
        };

        chart.addSerie = function (serie) {
            addSeries([serie]);
            return chart;
        };

        chart.clear = function () {
            chart.paper().clear();
            series = [];
            return chart;
        };

        chart.draw = function (data) {
            var paper = chart.paper();
            data = data || opts.data;

            // load data if in options
            if (data === undefined && opts.src) {
                opts.data = null;
                return chart.loadData(chart.draw);
            }

            if (isFunction(data))
                data = data(chart);

            opts.data = null;

            if (data || opts.type !== paper.type()) {

                if (data)
                    data = addSeries(data);

                if (opts.type !== paper.type()) {
                    paper = chart.paper(true);
                    data = series;
                }

                data.forEach(function (serie) {
                    drawSerie(serie);
                });
            }

            // Render the chart
            return chart.render();
        };

        chart.setSerieOption = function (type, field, value) {

            if (opts.chartTypes.indexOf(type) === -1) return;

            if (!chart.numSeries()) {
                opts[type][field] = value;
            } else {
                chart.each(function (serie) {
                    if (serie[type])
                        serie[type].set(field, value);
                });
            }
        };

        // Return the giotto group which manage the axis for a serie
        chart.axisGroup = function (serie) {
            if (serie && serie.axisgroup)
                return chart.paper().select('.' + axisGroupId(serie.axisgroup));
        };


        chart.on('tick.main', function () {
            // Chart don't need ticking unless explicitly required (real time updates for example)
            chart.stop();
            chart.draw();
        });

        // INTERNALS

        function chartSerie (data) {
            var paper = chart.paper(),
                serie = extend({}, opts.serie),
                color, show;

            if (data && !isArray(data)) {
                extend(serie, data);
                data = serie.data;
                delete serie.data;
            }

            if (!data) return;

            serie.index = series.length;

            series.push(serie);

            if (!serie.label)
                serie.label = 'serie ' + series.length;

            opts.chartTypes.forEach(function (type) {
                var o = serie[type];
                if (isArray(o) && !serie.data) {
                    serie.data = o;
                    o = {}; // an ampty object so that it is shown
                }
                if (o || opts[type].show) {
                    serie[type] = extend({}, opts[type], o);
                    show = true;
                }
            });

            // None of the chart are shown, specify line
            if (!show)
                serie.line = extend({}, opts.line);

            opts.chartTypes.forEach(function (type) {
                var o = serie[type];

                if (o && type !== 'pie') {
                    // pick a default color if one is not given
                    if (!color)
                        color = chartColor(paper, o);
                    if (!o.color)
                        o.color = color;
                }
            });

            if (!serie.pie) {
                if (serie.yaxis === undefined)
                    serie.yaxis = 1;
                if (!serie.axisgroup) serie.axisgroup = 1;

                var ranges = allranges[serie.axisgroup];

                if (!ranges) {
                    // ranges not yet available for this chart axisgroup,
                    // mark the serie as the reference for this axisgroup
                    serie.reference = true;
                    allranges[serie.axisgroup] = ranges = {};
                }

                if (!isObject(serie.xaxis)) serie.xaxis = opts.xaxis;
                if (serie.yaxis === 2) serie.yaxis = opts.yaxis2;
                if (!isObject(serie.yaxis)) serie.yaxis = opts.yaxis;
            }


            serie.data = function (_) {
                if (!arguments.length) return data;

                // Not a pie chart, check axis and ranges
                if (!serie.pie) {

                    var ranges = allranges[serie.axisgroup],
                        p = ranges[serie.xaxis.position],
                        xy = xyData(_, serie.x, serie.y),
                        stype;

                    _ = xy.data;

                    if (!p) {
                        ranges[serie.xaxis.position] = p = {
                            range: xy.xrange,
                            serie: serie
                        };
                        serie.drawXaxis = true;
                    } else {
                        p.range[0] = Math.min(p.range[0], xy.xrange[0]);
                        p.range[1] = Math.max(p.range[1], xy.xrange[1]);
                    }

                    p = ranges[serie.yaxis.position];
                    if (!p) {
                        ranges[serie.yaxis.position] = p = {
                            range: xy.yrange,
                            serie: serie
                        };
                        serie.drawYaxis = true;
                    } else {
                        p.range[0] = Math.min(p.range[0], xy.yrange[0]);
                        p.range[1] = Math.max(p.range[1], xy.yrange[1]);
                    }
                }
                data = _;

                opts.chartTypes.forEach(function (type) {
                    stype = serie[type];
                    if (stype && isFunction(stype.data))
                        stype.data(data);
                });

                return serie;
            };

            return serie.data(data);
        }

        function addSeries (series) {
            // Loop through series and add them to the chart series collection
            // No drawing nor rendering involved
            var data = [], ranges, p;

            series.forEach(function (serie) {

                if (isFunction(serie))
                    serie = serie(chart);

                serie = chartSerie(serie);

                if (serie)
                    data.push(serie);
            });

            return data;
        }

        function drawSerie (serie) {
            // Draw a serie

            // Remove previous serie drawing if any
            opts.chartTypes.forEach(function (type) {
                stype = serie[type];
                if (stype) {
                    if(isFunction(stype.options))
                        stype = stype.options();
                    serie[type] = stype;
                }
            });

            // Create the group for the serie
            var paper = chart.paper(),
                group = paper.classGroup(slugify(serie.label), extend({}, serie)),
                stype;

            // Is this the reference serie for its axisgroup?
            group.element().classed('chart' + chart.uid(), true);

            if (serie.reference)
                group.element().classed('reference' + chart.uid(), true)
                               .classed(axisGroupId(serie.axisgroup), true);

            // Draw X axis or set the scale of the reference X-axis
            if (serie.drawXaxis)
                domain(group.xaxis()).drawXaxis();
            else if (serie.axisgroup)
                scale(group.xaxis());

            // Draw Y axis or set the scale of the reference Y-axis
            if (serie.drawYaxis)
                domain(group.yaxis()).drawYaxis();
            else if (serie.axisgroup)
                scale(group.yaxis());

            opts.chartTypes.forEach(function (type) {
                stype = serie[type];
                if (stype)
                    serie[type] = chartTypes[type](group, serie.data(), stype);
            });

            function domain(axis) {
                var p = allranges[serie.axisgroup][axis.orient()],
                    o = axis.options(),
                    scale = axis.scale();

                p.scale = scale;
                if (o.auto) {
                    scale.domain([p.range[0], p.range[1]]).nice();
                    if (!isNull(o.min))
                        scale.domain([o.min, scale.domain()[1]]);
                    else if (!isNull(o.max))
                        scale.domain([scale.domain()[0], o.max]);
                } else {
                    scale.domain([o.min, o.max]);
                }
                return group;
            }

            function scale (axis) {
                var p = allranges[serie.axisgroup][axis.orient()];
                axis.scale(p.scale);
            }

        }

        function axisGroupId (axisgroup) {
            return 'axisgroup' + chart.uid() + '-' + axisgroup;
        }

    });

    var chartTypes = {

        pie: function (group, data, opts) {
            return group.pie(data, opts);
        },

        bar: function (group, data, opts) {
            return group.barchart(data, opts)
                        .x(function (d) {return d.x;})
                        .y(function (d) {return d.y;});
        },

        line: function (group, data, opts) {
            return group.path(data, opts)
                        .x(function (d) {return d.x;})
                        .y(function (d) {return d.y;});
        },

        point: function (group, data, opts) {
            return group.points(data, opts)
                        .x(function (d) {return d.x;})
                        .y(function (d) {return d.y;});
        }
    };

    g.Chart = g.viz.Chart;


    var xyData = function (data, x, y) {
        if (!data) return;
        if (!data.data) data = {data: data};

        var xy = data.data,
            xmin = Infinity,
            ymin = Infinity,
            xmax =-Infinity,
            ymax =-Infinity,
            xm = function (x) {
                xmin = x < xmin ? x : xmin;
                xmax = x > xmax ? x : xmax;
                return x;
            },
            ym = function (y) {
                ymin = y < ymin ? y : ymin;
                ymax = y > ymax ? y : ymax;
                return y;
            };
        var xydata = [];
        xy.forEach(function (d) {
            xydata.push({x: xm(x(d)), y: ym(y(d))});
        });
        data.data = xydata;
        data.xrange = [xmin, xmax];
        data.yrange = [ymin, ymax];
        return data;
    };
