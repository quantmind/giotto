
    function gridplugin (group, opts) {
        var grid, gopts;

        group.showGrid = function () {
            if (!grid) {
                // First time here, setup grid options for y and x coordinates
                if (!gopts) {
                    gopts = extend({
                        position: 'top',
                        size: 0,
                        show: opts.xaxis.grid === undefined || opts.xaxis.grid
                    }, opts.grid);
                    opts.xaxis = gopts;
                    opts.yaxis = extend({
                        position: 'left',
                        size: 0,
                        show: opts.yaxis.grid === undefined || opts.yaxis.grid
                    }, opts.grid);
                }

                opts.before = '*';
                grid = group.paper().group(opts);
                grid.element().classed('grid', true);
                grid.xaxis().tickFormat(notick).scale(group.xaxis().scale());
                grid.yaxis().tickFormat(notick).scale(group.yaxis().scale());
                grid.add(rectangle).options(opts.grid);
                if (opts.xaxis.show) grid.drawXaxis();
                if (opts.yaxis.show) grid.drawYaxis();
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

        // The redering function of the grid rectangle
        var rectangle = function () {
            var width = grid.innerWidth(),
                height = grid.innerHeight();

            if (grid.type() === 'svg') {
                // svg
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

            grid.xaxis().tickSize(-height, 0);
            grid.yaxis().tickSize(-width, 0);
        };

        function notick () {return '';}
    }

    g.paper.plugin('grid', {
        defaults: {
            color: '#333',
            colorOpacity: 0.3,
            fill: '#c6dbef',
            fillOpacity: 0.2,
            lineWidth: 0.5
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
