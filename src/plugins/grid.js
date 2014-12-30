    //
    //  Add grid functionality
    g.paper.plugin('grid', {
        defaults: {
            color: '#333',
            colorOpacity: 0.3,
            fill: '#c6dbef',
            fillOpacity: 0.2,
            lineWidth: 0.5,
            zoomx: false,
            zoomy: false,
            scaleExtent: [1, 10]
        },
        svg: gridplugin,
        canvas: gridplugin
    });

    //
    //  Add grid functionality to charts
    g.viz.chart.plugin(function (chart, opts) {
        var grid;
        opts.grid = extend({show: false}, opts.grid);

        // Show grid
        chart.showGrid = function () {
            chart.paper().each('.reference' + chart.uid(), function () {
                this.showGrid();
            });
            return chart;
        };

        // Hide grid
        chart.hideGrid = function () {
            chart.paper().each('.reference' + chart.uid(), function () {
                this.hideGrid();
            });
            return chart;
        };

        chart.on('tick.grid', function () {
            if (opts.grid.show)
                chart.showGrid();
            else
                chart.hideGrid();
        });
    });


    function gridplugin (group, opts) {
        var paper = group.paper(),
            grid, gopts, zooming;

        if (!paper.zoom)
            paper.zoom = paperzoom(paper);

        group.showGrid = function () {
            if (!grid) {
                // First time here, setup grid options for y and x coordinates
                if (!gopts) {
                    gopts = extend({}, opts);
                    gopts.xaxis = extend({
                        position: 'top',
                        size: 0,
                        show: opts.xaxis.grid === undefined || opts.xaxis.grid
                    }, opts.grid);
                    gopts.yaxis = extend({
                        position: 'left',
                        size: 0,
                        show: opts.yaxis.grid === undefined || opts.yaxis.grid
                    }, opts.grid);
                }
                gopts.before = '*';
                grid = group.paper().group(gopts);
                grid.element().classed('grid', true);
                grid.xaxis().tickFormat(notick).scale(group.xaxis().scale());
                grid.yaxis().tickFormat(notick).scale(group.yaxis().scale());
                grid.add(rectangle).options(opts.grid);
                if (gopts.xaxis.show) grid.drawXaxis();
                if (gopts.yaxis.show) grid.drawYaxis();
                grid.render();
            } else
                grid.clear().render();
            return group;
        };

        group.hideGrid = function () {
            if (grid)
                grid.remove();
            return group;
        };


        // The redering function for the grid
        var rectangle = function () {
            var width = grid.innerWidth(),
                height = grid.innerHeight(),
                type = grid.type(),
                scalex, scaley, zoom;

            if (type === 'svg') {
                if (zooming) return;

                var rect = grid.element().select('.grid-rectangle');

                if (!rect.node())
                    rect = grid.element()
                                .append("rect")
                                .attr("class", "grid-rectangle");

                rect.attr("width", width).attr("height", height);
                this.setBackground(rect);
            } else {
                // canvas
                var ctx = grid.context();
                ctx.beginPath();
                ctx.rect(0, 0, width, height);
                this.setBackground(ctx);
                ctx.fill();
            }

            // Add zoom functionality - when not zooming!
            if (!zooming) {

                grid.xaxis().tickSize(-height, 0);
                grid.yaxis().tickSize(-width, 0);

                if (!zoom && (opts.grid.zoomx || opts.grid.zoomy)) {

                    zoom = d3.behavior.zoom().on('zoom', function () {
                        zooming = true;
                        if (scalex) {
                            var x1 = scalex.invert(opts.margin.left),
                                x2 = scalex.invert(opts.size[0] - opts.margin.right);
                            grid.xaxis().scale().domain([x1, x2]);
                        }
                        if (scaley) {
                            var y1 = scalex.invert(opts.margin.top),
                                y2 = scalex.invert(opts.size[1] - opts.margin.bottom);
                            grid.yaxis().scale().domain([y1, y2]);
                        }
                        paper.render();
                        zooming = false;
                    });

                    if (type === 'svg')
                        zoom(grid.element());
                    else
                        zoom(grid.paper().canvas());

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

                    if (opts.grid.scaleExtent)
                        zoom.scaleExtent(opts.grid.scaleExtent);
                }
            }
        };
    }

    function notick () {return '';}

    function paperzoom (paper) {
        var zoom;

        return function (_) {
            if (!arguments.length) return zoom;
            zoom = _;
            return paper;
        };
    }
