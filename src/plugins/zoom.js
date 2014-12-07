    var zoomDefaults = {
        x: true,
        y: true,
        extent: [1, 10]
    };
    //
    //  Add zoom functionality to an svg paper
    g.paper.svg.plugin('zoom', zoomDefaults,

    function (paper, opts) {
        var zoom;

        paper.zoom = function (options) {
            init();
            if (options)
                extend(opts.zoom, options);
            if (opts.zoom.x)
                zoom.x(paper.xAxis().scale());
            if (opts.zoom.y)
                zoom.y(paper.yAxis().scale());
            if (opts.zoom.extent)
                zoom.scaleExtent(opts.zoom.extent);
            zoom.on('zoom', paper.render);
            var g = paper.root().current();
            g.call(zoom);
            paper.showGrid();
        };

        // PRIVATE FUNCTIONS

        function init () {
            if (!zoom) {
                zoom = d3.behavior.zoom();
                opts.zoom = extend({}, opts.zoom, g.defaults.paper.zoom);
            }
        }
    });

    g.paper.canvas.plugin('zoom', zoomDefaults,

    function (paper, opts) {
        var zoom;

        paper.zoom = function (options) {
            init();
            if (options)
                extend(opts.zoom, options);
            if (opts.zoom.x)
                zoom.x(paper.xAxis().scale());
            if (opts.zoom.y)
                zoom.y(paper.yAxis().scale());
            if (opts.zoom.extent)
                zoom.scaleExtent(opts.zoom.extent);
            //zoom.on('zoom', paper.render);
            //var g = paper.root().current();
            //g.call(zoom);
            paper.showGrid();
        };

        // PRIVATE FUNCTIONS

        function init () {
            if (!zoom) {
                zoom = d3.behavior.zoom();
                opts.zoom = extend({}, opts.zoom, g.defaults.paper.zoom);
            }
        }
    });

    //
    //  Add grid functionality to charts
    g.viz.chart.plugin(function (chart, opts) {

        chart.on('tick.zoom', function () {
            if (opts.zoom)
                chart.paper().zoom(opts.zoom);
        });
    });

