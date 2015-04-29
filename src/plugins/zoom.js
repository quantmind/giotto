    //
    //  Add zoom functionality to charts

    // Add zoom to the events triggered by a group
    g.constants.groupEvents.push('zoom');

    g.chart.plugin('zoom', {
        x: false,
        y: false,
        scaleExtent: [1, 10]
    },

    function (chart) {
        // internal flag indicating if chart is zooming
        var zooming = false;

        // Return true whan the chart is performing a zoom operation
        chart.zooming = function () {
            return zooming;
        };

        // Enable zoom on the chart
        // only when either zoom.x or zoom.y are enabled
        chart.enableZoom = function () {

            var opts = chart.options().zoom,
                zoom = d3.behavior.zoom()
                    .on('zoom', function () {
                        zooming = true;
                        chart.each(function (serie) {
                            zoomGroup(zoom, serie.group(), opts);
                        });
                        zooming = false;
                    });

            if (opts.scaleExtent)
                zoom.scaleExtent(opts.scaleExtent);

            // Apply the zoom behavior to the chart container
            // This means each single group should handle the event separately
            zoom(chart.element());
        };

        chart.on('tick.zoom', function () {
            var zoom = chart.options().zoom;
            if (zoom.x || zoom.y)
                chart.enableZoom();
        });

        // INTERNALS


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
