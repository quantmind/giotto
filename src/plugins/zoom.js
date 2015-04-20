    //
    //  Add zoom functionality to charts
    g.constants.groupEvents.push('zoom');

    g.chart.plugin('zoom', {
        x: false,
        y: false,
        scaleExtent: [1, 10]
    },

    function (chart) {
        var zooming = false;

        // Return true whan the chart is performing a zoom operation
        chart.zooming = function () {
            return zooming;
        };

        // Enable zoom on the chart
        chart.enableZoom = function () {
            var opts = chart.options().zoom,
                zoom = d3.behavior.zoom()
                    .scaleExtent(opts.scaleExtent)
                    .on('zoom', function () {
                        zooming = true;
                        chart.each(function (serie) {
                            zoomGroup(zoom, serie.group(), opts);
                        });
                        zooming = false;
                    });

            if (opts.scaleExtent)
                zoom.scaleExtent(opts.scaleExtent);

            zoom(chart.element());
        };

        chart.on('tick.zoom', function () {
            var zoom = chart.options().zoom;
            if (zoom.x || zoom.y)
                chart.enableZoom();
        });

        // Perform zoom for one group
        function zoomGroup (zoom, group, opts) {
            if (opts.x) {
                zoom.x(group.xaxis().scale());
            }
            if (opts.y) {
                zoom.y(group.yaxis().scale());
            }
            group.render();
        }

        function __() {
            var factor = grid.factor();

            if (factor === 1) {
                if (opts.grid.zoomx)
                    zoom.x(grid.xaxis().scale());

                if (opts.grid.zoomy)
                    zoom.y(grid.yaxis().scale());
            } else {

                if (opts.grid.zoomx) {
                    scalex = grid.xaxis().scale().copy();
                    var x1 = scalex.invert(-factor*opts.margin.left),
                        x2 = scalex.invert(factor*(opts.size[0] - opts.margin.left));
                    scalex.domain([x1, x2]).range([0, opts.size[0]]);
                    zoom.x(scalex);
                }

                if (opts.grid.zoomy) {
                    scaley = grid.yaxis().scale().copy();
                    var y1 = scaley.invert(-factor*opts.margin.left),
                        y2 = scaley.invert(factor*(opts.size[1] - opts.margin.bottom));
                    scaley.domain([y1, y2]).range([opts.size[1], 0]);
                    zoom.y(scaley);
                }
            }
        }
    });
