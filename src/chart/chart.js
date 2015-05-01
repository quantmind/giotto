
    g.createviz('chart', {
        margin: 30,
        chartTypes: ['map', 'pie', 'bar', 'line', 'point', 'custom'],
        xaxis: true,
        yaxis: true,
        serie: {
            x: function (d) {return d[0];},
            y: function (d) {return d[1];}
        }
    },

    function (chart) {

        var series = [],
            allranges = {},
            drawing;

        chart.numSeries = function () {
            return series.length;
        };

        chart.allranges = function () {
            return allranges;
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

        chart.drawing  = function () {
            return drawing;
        };

        chart.render = function () {
            var opts = chart.options(),
                paper = chart.paper();
            drawing = true;

            if (opts.type !== paper.type()) {
                paper = chart.paper(true);
                chart.each(function (serie) {
                    serie.clear();
                });
            }

            chart.each(function (serie) {
                serie.draw();
            });

            drawing = false;

            // Render the chart
            paper.render();
            return chart;
        };

        chart.setSerieOption = function (type, field, value) {
            var opts = chart.options();
            if (opts.chartTypes.indexOf(type) === -1) return;

            if (!chart.numSeries()) {
                opts[type][field] = value;
            } else {
                var stype;
                chart.each(function (serie) {
                    stype = serie[type];
                    if (stype)
                        if (isFunction(stype.set))
                            stype.set(field, value);
                        else
                            stype[field] = value;
                });
            }
        };

        // Return the giotto group which manage the axis for a serie
        chart.axisGroup = function (serie) {
            if (serie && serie.axisgroup)
                return chart.paper().select('.' + chart.axisGroupId(serie.axisgroup));
        };


        chart.on('tick.main', function () {
            // Chart don't need ticking unless explicitly required (real time updates for example)
            chart.stop();
            chart.render();
        });

        chart.axisGroupId = function (axisgroup) {
            return 'axisgroup' + chart.uid() + '-' + axisgroup;
        };

        // INTERNALS

        chart.on('data.build_series', function () {
            var data = chart.data();
            series = [];
            addSeries(data);
        });

        function addSeries (newseries) {
            // Loop through series and add them to the chart series collection
            // No drawing nor rendering involved
            if (!newseries.forEach) newseries = [newseries];

            newseries.forEach(function (serie) {

                if (isFunction(serie))
                    serie = serie(chart);

                series.push(chartSerie(chart, serie));
            });
        }

    });

    g.chart = g.viz.chart;
