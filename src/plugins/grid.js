    var gridDefaults = {
        color: '#333',
        background: {
            color: '#c6dbef',
            opacity: 0.4
        },
        opacity: 0.3
    };

    function gridConstructor (paper, opts) {

        var type = paper.type(),
            inner = {},
            xGrid, yGrid;

        paper.showGrid = function (options) {
            init();
            inner[type].addgrid();
            inner[type].showhide(xGrid, paper.xAxis(), 'x', opts.xaxis.grid);
            inner[type].showhide(yGrid, paper.yAxis(), 'y', opts.yaxis.grid);
            return paper;
        };

        paper.hideGrid = function () {
            if (xGrid) {
                inner[type].showhide(xGrid, paper.xAxis(), 'x');
                inner[type].showhide(yGrid, paper.yAxis(), 'y');
            }
            return paper;
        };

        paper.xGrid = function () {
            init();
            return xGrid;
        };

        paper.yGrid = function () {
            init();
            return yGrid;
        };

        // PRIVATE FUNCTIONS

        function init () {
            if (!xGrid) {
                opts.grid = extend({}, opts.grid, g.defaults.paper.grid);
                if (opts.xaxis.grid === undefined) opts.xaxis.grid = true;
                if (opts.yaxis.grid === undefined) opts.yaxis.grid = true;
                xGrid = d3[type].axis();
                yGrid = d3[type].axis();
            }
        }

        inner.svg = {
            addgrid: function () {
                var r = paper.root().current().select('rect.grid');
                if (!r.node()) {
                    r = paper.current().insert("rect", "*")
                            .attr("class", "grid")
                            .attr("width", paper.innerWidth())
                            .attr("height", paper.innerHeight());
                }
                paper.setBackground(r, opts.grid.background);
            },

            showhide: function (grid, axis, xy, show) {
                var g = paper.root().current()
                                .select('.' + xy + '-grid');
                if (show) {
                    if(!g.node()) {
                        grid.scale(axis.scale()).ticks(axis.ticks()).tickFormat("");
                        g = paper.group().attr('class', 'grid ' + xy + '-grid')
                                .attr('stroke', opts.grid.color)
                                .attr('stroke-opacity', opts.grid.opacity);
                        if (opts.grid.background)
                            g.attr('fill', opts.grid.backgroundColor);

                        if (xy === 'x')
                            grid.tickSize(paper.innerHeight(), 0, 0);
                        else
                            grid.tickSize(-paper.innerWidth(), 0, 0).orient('left');

                        paper.addComponent(paperData(paper, {}, g), function () {
                            g.call(grid);
                        });
                    }
                } else
                    g.remove();
            }
        };

        inner.canvas = {
            addgrid: function () {
            },

            showhide: function (grid, axis, xy, show) {
            }
        };
    }
    //
    //  Add grid functionality to svg and canvas paper
    g.paper.svg.plugin('grid', gridDefaults, gridConstructor);
    g.paper.canvas.plugin('grid', gridDefaults, gridConstructor);
    //
    //  Add grid functionality to charts
    g.viz.chart.plugin(function (chart, opts) {
        opts.grid = extend({show: false}, opts.grid);

        // Show grid
        chart.showGrid = function (options) {
            chart.paper().showGrid(options);
            return chart;
        };

        // Hide grid
        chart.hideGrid = function () {
            chart.paper().hideGrid();
            return chart;
        };

        chart.on('tick.grid', function () {
            if (opts.grid.show)
                chart.showGrid();
            else
                chart.hideGrid();
        });
    });
