    // Line chart
    g.paper.plugin('line', {
        interpolate: 'cardinal',
        colorOpacity: 1,
        fillOpacity: 0.4,
        lineWidth: 2,
        fill: 'color',
        active: {}
    },

    function (group) {
        var type = group.type();

        // Draw a path or an area
        group.path = function (data, opts) {
            opts || (opts = {});
            chartFormats(group, opts);
            chartColor(group.paper(), copyMissing(group.options().line, opts));

            return group.add(g[type].path(group))
                        .pointOptions(pointOptions)
                        .size(point_size)
                        .data(data)
                        .options(opts);
        };
    });

    g.svg.path = function (group) {

        function area_container (aid, create) {
            var b = group.paper().svgBackground(create),
                a = b.select('#' + aid);
            if (!a.size() && create)
                a = b.append('g')
                        .attr('id', aid)
                        .attr("transform", "translate(" + group.marginLeft() + "," + group.marginTop() + ")");
            return a;
        }

        return pathdraw(group, function () {
            var draw = this,
                opts = draw.options(),
                el = group.element(),
                uid = draw.uid(),
                aid = 'area-' + uid,
                p = el.select("#" + uid),
                trans = opts.transition,
                line = this.path_line(),
                data = this.path_data(),
                active, a;

            if (!p.node()) {
                p = el.append('path').attr('id', uid).datum(data);
                if (opts.area)
                    a = area_container(aid, true).append('path').datum(data);
            }
            else {
                p.datum(data);
                a = area_container(aid);
                if (opts.area) {
                    if(!a.size())
                        a = area_container(aid, true);
                    var ar = a.select('path');
                    if (!ar.size())
                        ar = a.append('path');
                    a = ar.datum(data);
                } else {
                    a.remove();
                    a = null;
                }
                if (!group.resizing() && trans && trans.duration) {
                    p = p.transition().duration(trans.duration).ease(trans.ease);
                    if (a)
                        a = a.transition().duration(trans.duration).ease(trans.ease);
                }
            }

            p.attr('d', line)
                .attr('stroke', draw.color)
                .attr('stroke-opacity', draw.colorOpacity)
                .attr('stroke-width', draw.lineWidth)
                .attr('fill', 'none');

            // Area
            if (a) {
                line = draw.path_area();
                if (!draw.fill)
                    draw.fill = draw.color;

                a.attr('d', line)
                 .attr('stroke', 'none');

                if (opts.gradient) {
                    g.gradient().colors([
                        {
                            color: draw.fill,
                            opacity: draw.fillOpacity,
                            offset: 0
                        },
                        {
                            color: opts.gradient,
                            opacity: draw.fillOpacity,
                            offset: 100
                        }]).direction('y')(a);
                } else
                    group.setBackground(draw, a);
            }

            //
            // Activate mouse over events on control points
            if (draw.active && draw.active.symbol)
                group.events(group.paper().element(), uid, function () {
                    if (!active)
                        active = el.append('path')
                                    .attr('id', 'point-' + uid)
                                    .datum(g.svg.point(draw, [], 0))
                                    .attr('d', draw.symbol);
                    var mouse = d3.mouse(this),
                        x = mouse[0] - group.marginLeft(),
                        d = draw.bisect(x);
                    if (d) {
                        active.attr("transform", "translate(" + d.sx + "," + d.sy + ")");
                        active.datum().data = d.data;
                        return active.node();
                    }
                });

            return p;
        });
    };

    g.canvas.path = function (group) {
        var d = canvasMixin(pathdraw(group)),
            scalex = d.scalex,
            scaley = d.scaley,
            opts, data, active, ctx;

        d.render = function () {
            opts = d.options();
            data = d.path_data();
            ctx = d.context();

            ctx.save();
            group.transform(ctx);

            if (opts.area) {
                var background = group.paper().canvasBackground(true).node().getContext('2d');
                background.save();
                group.transform(background);
                if (!d.fill) d.fill = d.color;
                d.path_area().context(background)(data);

                if (opts.gradient) {
                    var scale = group.yaxis().scale(),
                        domain = scale.domain();
                    g.gradient()
                            .y1(scale(domain[domain.length-1]))
                            .y2(scale(domain[0]))
                            .direction('y')
                            .colors([
                            {
                                color: d3.canvas.rgba(d.fill, d.fillOpacity),
                                offset: 0
                            },
                            {
                                color: d3.canvas.rgba(opts.gradient, d.fillOpacity),
                                offset: 100
                            }])(d3.select(background.canvas));
                } else {
                    background.fillStyle = d3.canvas.rgba(d.fill, d.fillOpacity);
                    background.fill();
                }
                background.restore();
            }
            ctx.strokeStyle = d.color;
            ctx.lineWidth = group.factor()*d.lineWidth;
            d.path_line().context(ctx)(data);
            ctx.stroke();
            ctx.restore();
            return d;
        };

        d.inRange = function (ex, ey) {
            var opts = d.options();
            if (!d.active) return false;
            if(!d.active.symbol) return false;
            if (!active)
                active = g.canvas.point(d, [], 0);
            var dd = d.bisect(ex - group.marginLeft());
            if (dd) {
                active.data = dd.data;
                return active;
            }
            return false;
        };

        return d;
    };


    function pathdraw(group, render, draw) {
        var type = group.type(),
            bisector = d3.bisector(function (d) {return d.sx;}).left,
            data, ordered;

        draw = drawing(group, render, draw);

        draw.bisector = d3.bisector(function (d) {return d.sx;}).left;

        draw.each = function (callback) {
            callback.call(draw);
            return draw;
        };

        draw.path_line = function () {
            var opts = draw.options();

            return d3[type].line()
                            .interpolate(opts.interpolate)
                            .x(function (d) {return d.sx;})
                            .y(function (d) {return d.sy;});
        };

        draw.path_area = function () {
            var opts = draw.options(),
                scaley = group.yaxis().scale();

            return d3[type].area()
                                .interpolate(opts.interpolate)
                                .x(function (d) {return d.sx;})
                                .y0(scaley(scaley.domain()[0]))
                                .y1(function (d) {return d.sy;});
        };

        draw.path_data = function () {
            var sx = draw.x(),
                sy = draw.y(),
                scalex = group.xaxis().scale(),
                scaley = group.yaxis().scale();

            ordered = null;
            draw.symbol = d3[type].symbol().type(function (d) {return d.symbol || 'circle';})
                                           .size(draw.size());
            data = draw.data().map(function (d, i) {
                var xy = {
                    x: sx(d),
                    y: sy(d),
                    index: i,
                    data: d
                };
                xy.sx = scalex(xy.x);
                xy.sy = scaley(xy.y);
                return xy;
            });
            return data;
        };

        draw.bisect = function (x) {
            if (!ordered && data)
                ordered = data.slice().sort(function (a, b) {return d3.ascending(a.sx, b.sx);});
            if (ordered) {
                var index = bisector(ordered, x);
                if (index < ordered.length)
                    return ordered[index];
            }
        };

        return draw;
    }
