
    g.paper.plugin('grid', {
        defaults: {
            color: '#333',
            colorOpacity: 0.2,
            fill: '#c6dbef',
            fillOpacity: 0.2
        },

        svg: function (group, opts) {

            function show (axis, xy) {
                var grid = paper.classGroup('grid', {before: '*'});

                if (show) {

                    grid.add(function () {
                        var opts = this.options(),
                            gg = grid.element().select('.' + xy),
                            rect = grid.element().select('.grid-rectangle');

                        if (!rect.node()) {
                            grid.element()
                                    .append("rect")
                                    .attr("class", "grid-rectangle")
                                    .attr("width", grid.innerWidth())
                                    .attr("height", grid.innerHeight());
                        }
                        paper.setBackground(rect, this);

                        if (!gg.node())
                            gg = grid.element().append('g').attr('class', xy);
                        if (xy[0] === 'x')
                            gridaxis.tickSize(this.group().innerHeight(), 0);
                        else
                            gridaxis.tickSize(-this.group().innerWidth(), 0).orient('left');
                        gg.selectAll('*').remove();
                        gg.call(gridaxis);
                        gg.selectAll('line')
                            .attr('stroke', this.color)
                            .attr('stroke-opacity', this.colorOpacity)
                            .attr('stroke-width', this.lineWidth);
                        gg.selectAll('path').remove();
                        return gg;
                    }).options(opts.grid).name(xy);
                }
            }
        },

        canvas: function (group, opts) {

        }
    });

    function grid (group, opts, show) {
        if (opts.xaxis.grid === undefined) opts.xaxis.grid = true;
        if (opts.yaxis.grid === undefined) opts.yaxis.grid = true;

        group.xaxis().tickFormat('');
        group.yaxis().tickFormat('');

        group.add(show(group.xaxis(), 'x-grid')).options(opts.xaxis);
        group.add(show(group.yaxis(), 'y-grid')).options(opts.yaxis);
    }

    //
    //  Add grid functionality to charts
    g.viz.chart.plugin(function (chart, opts) {
        var grid;
        opts.grid = extend({show: false}, opts.grid);

        // Show grid
        chart.showGrid = function () {
            chart.paper().each(function (group) {
                group.showGrid();
            });
            return chart;
        };

        // Hide grid
        chart.hideGrid = function () {
            chart.paper().each(function (group) {
                group.hideGrid();
            });
            return chart;
        };

        chart.on('tick.grid', function () {
            //if (opts.grid.show)
            //    chart.showGrid();
            //else
            //    chart.hideGrid();
        });
    });
