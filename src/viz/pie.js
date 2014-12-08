
    g.createviz('pie', {},

    function (chart, opts) {

        chart.draw = function () {
            if (opts.data === undefined && opts.src)
                return chart.loadData(chart.draw);
            if (g._.isFunction(opts.data))
                opts.data = data(chart);

            chart.clear();
            if (opts.data) {
                chart.paper().pie(opts.data, opts);
                chart.render();
            }
        };

        chart.on('tick.main', function () {
            // Chart don't need ticking unless explicitly required (real time updates for example)
            chart.stop();
            chart.draw();
        });
    });
