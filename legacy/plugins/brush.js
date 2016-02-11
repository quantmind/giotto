    //
    //  Add brush functionality to svg paper
    g.paper.plugin('brush', {

        defaults: {
            axis: 'x', // set one of 'x', 'y' or 'xy'
            fill: '#000',
            fillOpacity: 0.125
        },

        init: function (group) {
            var brush, brushDrawing;

            group.brush = function () {
                return brush;
            };

            // Add a brush to the group if not already available
            group.addBrush = function (options) {
                if (brushDrawing) return brushDrawing;

                brushDrawing = group.add(function () {

                    var draw = this,
                        opts = draw.options(),
                        type = group.type(),
                        resizing = group.resizing();

                    if (!brush) {
                        resizing = true;
                        brush = d3[type].brush()
                                .on("brushstart", brushstart)
                                .on("brush", brushmove)
                                .on("brushend", brushend);

                        if (opts.axis === 'x' || opts.axis === 'xy')
                            brush.x(group.xaxis().scale());

                        if (opts.axis === 'y' || opts.axis === 'xy')
                            brush.y(group.yaxis().scale());

                        if (opts.extent) brush.extent(opts.extent);

                        if (type === 'svg') {
                            brush.selectDraw = selectDraw;

                        } else {

                            brush.selectDraw = function (draw) {
                                selectDraw(draw, group.paper().canvasOverlay().node().getContext('2d'));
                            };
                        }
                    }

                    if (resizing) {
                        brush.extent(brush.extent());

                        if (type === 'svg') {
                            var gb = group.element().select('.brush');

                            if (!gb.node())
                                gb = group.element().append('g').classed('brush', true);

                            var rect = gb.call(brush).selectAll("rect");

                            this.setBackground(rect);

                            if (opts.axis === 'x')
                                rect.attr("y", -6).attr("height", group.innerHeight() + 7);

                            brushstart();
                            brushmove();
                            brushend();
                        } else {
                            brush.fillStyle(d3.canvas.rgba(this.fill, this.fillOpacity))
                                 .rect([group.marginLeft(), group.marginTop(),
                                        group.innerWidth(), group.innerHeight()]);
                            group.paper().canvasOverlay().call(brush);
                        }
                    }

                    function brushstart () {
                        group.element().classed('selecting', true);
                        if (opts.start) opts.start();
                    }

                    function brushmove () {
                        if (opts.move) opts.move();
                    }

                    function brushend () {
                        group.element().classed('selecting', false);
                        if (opts.end) opts.end();
                    }

                });

                return brushDrawing.options(extend({}, group.options().brush, options));
            };

            function selectDraw (draw, ctx) {
                var x = draw.x(),
                    selected = [],
                    xval,
                    s = brush.extent();

                if (ctx) {
                    var group = draw.group();
                    ctx.save();
                    ctx.translate(group.marginLeft(), group.marginTop());
                }

                draw.each(function () {
                    if (this.data) {
                        xval = x(this.data);
                        if (s[0] <= xval && xval <= s[1]) {
                            this.highLight();
                            if (ctx) this.render(ctx);
                            selected.push(this);
                        }
                        else
                            this.reset();
                    }
                });

                if (ctx) ctx.restore();
                else draw.render();

                return selected;
            }
        }
    });

    //  Add brush functionality to charts
    g.viz.chart.plugin('brushchart', {

        init: function (chart) {
            var brush, brushopts;

            // Show grid
            chart.addBrush = function () {

                brush = chart.options().brush;

                var start = brush.start,
                    move = brush.move,
                    end = brush.end;

                brush.start = function () {
                    if (start) start(chart);
                };

                brush.move = function () {
                    //
                    // loop through series
                    chart.each(function (serie) {
                        var group = chart.axisGroup(serie),
                            brush = group ? group.brush() : null;

                        if (!brush) return;

                        if (serie.point)
                            brush.selectDraw(serie.point);
                        if (serie.bar)
                            brush.selectDraw(serie.bar);
                    });
                    if (move) move(chart);
                };

                brush.end = function () {
                    if (end) end(chart);
                };

                chart.paper().each('.reference', function () {
                    this.addBrush(brushopts).render();
                });
                return chart;
            };

            chart.on('tick.brush', function () {
                if (chart.options().brush.show)
                    chart.addBrush();
            });

        }
    });

