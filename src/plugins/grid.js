    //
    //  Add grid functionality to svg paper
    g.paper.svg.plugin('grid', {
        color: '#333',
        opacity: 0.3
    },

    function (paper, opts) {
        var xGrid, yGrid;

        paper.showGrid = function (options) {
            init();
            showhide(xGrid, paper.xAxis(), 'x', opts.xaxis.grid);
            showhide(yGrid, paper.yAxis(), 'y', opts.yaxis.grid);
            return paper;
        };

        paper.hideGrid = function () {
            if (xGrid) {
                showhide(xGrid, paper.xAxis(), 'x');
                showhide(yGrid, paper.yAxis(), 'y');
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
                xGrid = d3.svg.axis();
                yGrid = d3.svg.axis();
            }
        }

        function showhide(grid, axis, xy, show) {
            var svg = paper.root().current(),
                g = svg.select('.' + xy + '-grid');
            if (show) {
                grid.scale(axis.scale()).ticks(axis.ticks()).tickFormat("");
                if(!g.node())
                    g = paper.group().attr('class', 'grid ' + xy + '-grid')
                            .attr('stroke', opts.grid.color)
                            .attr('stroke-opacity', opts.grid.opacity);
                if (xy === 'x')
                    grid.tickSize(paper.innerHeight(), 0, 0);
                else
                    grid.tickSize(-paper.innerWidth(), 0, 0).orient('left');
                g.call(grid);
            } else
                g.remove();
        }
    });

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
