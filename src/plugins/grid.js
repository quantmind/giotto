    //
    //  Add grid functionality to a group
    //  =====================================
    //
    //  In theory each group can have its own grid
    g.paper.plugin('grid', {

        defaults: {
            show: false,
            color: '#333',
            colorOpacity: 0.3,
            fill: 'none',
            fillOpacity: 0.2,
            lineWidth: 0.5,
            xaxis: true,
            yaxis: true
        },

        init: function (group) {
            var paper = group.paper(),
                grid, gopts;

            // Return the grid associated with the group
            // Can return nothing (no grid available)
            group.grid = function () {
                return grid;
            };

            // Show the grid
            group.showGrid = function () {
                if (!grid) {
                    // First time here, setup grid options for y and x coordinates
                    if (!gopts) {
                        var opts = group.options();
                        gopts = opts.copy({
                            xaxis: extend({
                                position: 'top',
                                size: 0,
                                show: opts.grid.xaxis
                            }, opts.grid),
                            yaxis: extend({
                                position: 'left',
                                size: 0,
                                show: opts.grid.yaxis
                            }, opts.grid)
                        });
                    }
                    // Create the grid group
                    gopts.before = '*';
                    grid = paper.group(gopts);
                    grid.element().classed('grid', true);
                    grid.xaxis().tickFormat(notick).scale(group.xaxis().scale());
                    grid.yaxis().tickFormat(notick).scale(group.yaxis().scale());
                    grid.add(Rectangle).options(gopts.grid);
                    if (gopts.xaxis.show) grid.drawXaxis();
                    if (gopts.yaxis.show) grid.drawYaxis();
                    grid.on('zoom', zoomgrid);
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
            function Rectangle () {
                var width = grid.innerWidth(),
                    height = grid.innerHeight(),
                    type = grid.type(),
                    opts = this.group().options(),
                    scalex, scaley;

                if (type === 'svg') {
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
                    ctx.save();
                    group.transform(ctx);
                    ctx.beginPath();
                    ctx.rect(0, 0, width, height);
                    if (this.fill != 'none') {
                        this.setBackground(ctx);
                        ctx.fill();
                    }
                    ctx.restore();
                }

                grid.xaxis().tickSize(-height, 0);
                grid.yaxis().tickSize(-width, 0);
            }

            function zoomgrid () {
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
            }
        }
    });

    //
    //  Add grid functionality to charts
    g.viz.chart.plugin('gridchart', {

        init: function (chart) {

            // Show grid
            chart.showGrid = function () {
                chart.paper().each('.reference', function () {
                    this.showGrid();
                });
                return chart;
            };

            // Hide grid
            chart.hideGrid = function () {
                chart.paper().each('.reference', function () {
                    this.hideGrid();
                });
                return chart;
            };

            chart.on('tick.grid', function () {
                var grid = chart.options().grid;

                if (grid.show)
                    chart.showGrid();
                else
                    chart.hideGrid();
            });
        }
    });

    function notick () {return '';}

