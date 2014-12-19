    //
    //  Add brush functionality to svg paper
    g.paper.plugin('brush', {
        defaults: {
            axis: null, // set one of 'x', 'y' or 'xy'
            fill: '#000',
            fillOpacity: 0.125
        },
        svg: brushplugin,
        canvas: brushplugin
    });

    //  Add brush functionality to charts
    g.viz.chart.plugin(function (chart, opts) {
        var brush, brushopts;

        // Show grid
        chart.addBrush = function () {

            brush = opts.brush;

            var start = brush.start,
                move = brush.move,
                end = brush.end;

            brush.start = function () {
                if (start) start(chart);
            };

            brush.move = function () {
                //
                // loop through series and add selected class
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

            chart.paper().each('.reference' + chart.uid(), function () {
                this.addBrush(brushopts).render();
            });
            return chart;
        };

        chart.on('tick.brush', function () {
            if (opts.brush && opts.brush.axis)
                chart.addBrush();
        });

    });


    function brushplugin (group, opts) {
        var brush, brushDrawing;

        group.brush = function () {
            return brush;
        };

        // Add a brush to the paper if not already available
        group.addBrush = function (options) {
            if (brushDrawing) return brushDrawing;
            extend(opts.brush, options);

            brushDrawing = group.add(function () {
                var draw = this;

                if (!brush) {
                    var type = group.type(),
                        x, y;

                    brush = d3[type].brush()
                            .on("brushstart", brushstart)
                            .on("brush", brushmove)
                            .on("brushend", brushend);

                    if (opts.brush.axis === 'x' || opts.brush.axis === 'xy') {
                        x = true;
                        brush.x(group.xaxis().scale());
                    }

                    if (opts.brush.axis === 'y' || opts.brush.axis === 'xy') {
                        y = true;
                        brush.y(group.yaxis().scale());
                    }

                    if (opts.brush.extent) brush.extent(opts.brush.extent);

                    if (type === 'svg') {
                        brush.selectDraw = selectDraw;
                        var gb = group.element().select('.brush');

                        if (!gb.node())
                            gb = group.element().append('g').classed('brush', true);

                        var rect = gb.call(brush).selectAll("rect");

                        this.setBackground(rect);

                        if (opts.brush.axis === 'x')
                            rect.attr("y", -6).attr("height", group.innerHeight() + 7);
                    } else {

                        var overlay = group.paper().canvasOverlay();

                        brush.selectDraw = function (draw) {
                            selectDraw(draw, overlay.node().getContext('2d'));
                        };

                        overlay.call(brush.draw(function (ctx) {
                            ctx.fillStyle = d3.canvas.rgba(draw.fill, draw.fillOpacity);
                            ctx.fill();
                        }).rect([group.marginLeft(), group.marginTop(),
                                 group.innerHeight(), group.innerWidth()]));
                    }

                    brushstart();
                    brushmove();
                    brushend();
                }
            });

            return brushDrawing.options(opts.brush);
        };

        function brushstart () {
            group.element().classed('selecting', true);
            if (opts.brush.start) opts.brush.start();
        }

        function brushmove () {
            if (opts.brush.move) opts.brush.move();
        }

        function brushend () {
            group.element().classed('selecting', false);
            if (opts.brush.end) opts.brush.end();
        }

        function selectDraw (drawing, ctx) {
            var x = drawing.x(),
                selected = [],
                xval,
                s = brush.extent();

            drawing.each(function () {
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

            if (!ctx) drawing.render();

            return selected;
        }
    }

