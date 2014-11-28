
    g.createviz('chart', {
        serie: {
            lines: {show: true},
            points: {show: true}
        }
    }, function (viz, opts) {

        viz._todo =  function () {
            var opts = viz.attrs,
                data = opts.data || [];

            // Loop through data and build the graph
            data.forEach(function (serie) {
                if (isFunction (serie)) {
                    serie = serie(viz);
                }
                viz.addSerie(serie);
            });
        };

        viz.addSerie = function (serie) {
            // The serie is
            if (!serie) return;

            if (isArray(serie)) {
                serie = {data: serie};
            }
            if (!serie.data) return;
            viz.log.info('Add new serie to chart');

            copyMissing(viz.serieDefaults, serie);

            if (serie.lines.show)
                viz.paper().drawLine(serie.data, serie.lines);

        };

    });