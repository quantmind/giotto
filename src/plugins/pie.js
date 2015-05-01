
    // Add pie charts to giotto groups

    g.paper.plugin('pie', {

        defaults: {
            lineWidth: 1,
            // pad angle in degrees
            padAngle: 0,
            cornerRadius: 0,
            fillOpacity: 0.7,
            colorOpacity: 1,
            innerRadius: 0,
            startAngle: 0,
            formatX: d3_identity,
            formatPercent: ',.2%',
            active: {
                fill: 'darker',
                color: 'brighter',
                //innerRadius: 100%,
                //outerRadius: 105%,
                fillOpacity: 1
            },
            tooltip: {
                template: function (d) {
                    return "<p><strong>" + d.x + "</strong> " + d.y + "</p>";
                }
            },
            labels: {
                show: true,
                position: 'ouside',
                outerRadius: 1.05,
                color: '#333',
                colorOpacity: 0.5,
                lineWidth: 1
            }
        },

        options: function (opts) {
            this.optionsShow(opts, ['active', 'tooltip', 'labels']);
        },

        init: function (group) {
            var type = group.type(),
                arc = d3[type].arc()
                                .innerRadius(function (d) {return d.innerRadius;})
                                .outerRadius(function (d) {return d.outerRadius;});

            // add a pie chart drawing to the group
            group.pie = function (data, opts) {
                opts || (opts = {});
                chartFormats(group, opts);
                copyMissing(group.options().pie, opts);

                var draw = group.add(function () {

                    var width = group.innerWidth(),
                        height = group.innerHeight(),
                        opts = this.options(),
                        outerRadius = 0.5*Math.min(width, height),
                        innerRadius = opts.innerRadius*outerRadius,
                        cornerRadius = group.scale(group.dim(opts.cornerRadius)),
                        value = this.y(),
                        data = this.data(),
                        pie = d3.layout.pie().value(function (d) {return value(d.data);})
                                             .padAngle(d3_radians*opts.padAngle)
                                             .startAngle(d3_radians*opts.startAngle)(data),
                        d, dd;

                    this.arc = arc.cornerRadius(cornerRadius);

                    // recalculate pie angles
                    for (var i=0; i<pie.length; ++i) {
                        d = pie[i];
                        dd = d.data;
                        dd.set('innerRadius', innerRadius);
                        dd.set('outerRadius', outerRadius);
                        delete d.data;
                        data[i] = extend(dd, d);
                    }

                    return g[type].pie(this, width, height);
                });

                return draw.pointOptions(extendArray(['innerRadius', 'outerRadius'], drawingOptions))
                            .dataConstructor(pie_costructor)
                            .options(opts)
                            .data(data);
            };
        }
    });

    var pie_costructor = function (rawdata) {
        var draw = this,
            x = draw.x(),
            pieslice = g[draw.group().type()].pieslice,
            map = d3.map(this.data() || [], function (d) {return x(d.data);}),
            data = [],
            slice;
        rawdata.forEach(function (d) {
            slice = map.get(x(d));
            if (!slice) slice = pieslice(draw, d);
            else slice.data = d;
            data.push(slice);
        });
        return data;
    };

    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    function pieSlice (draw, data, d) {
        // Default values
        var dd = isArray(data) ? d : data,
            group = draw.group(),
            factor = group.factor(),
            target = group.paper().element().node();

        dd.fill = dd.fill || draw.group().pickColor();
        dd.color = dd.color || d3.rgb(dd.fill).darker().toString();

        d = drawingData(draw, data, d);
        if (group.type() === 'canvas') d = canvasMixin(d);

        d.bbox = function () {
            var bbox = target.getBoundingClientRect(),
                c1 = Math.sin(d.startAngle),
                s1 = Math.cos(d.startAngle),
                c2 = Math.sin(d.endAngle),
                s2 = Math.cos(d.endAngle),
                cc = Math.sin(0.5*(d.startAngle + d.endAngle)),
                sc = Math.cos(0.5*(d.startAngle + d.endAngle)),
                r1 = d.innerRadius,
                r2 = d.outerRadius,
                rc = 0.5*(r1 + r2),
                left = group.marginLeft() + 0.5*group.innerWidth(),
                top = group.marginTop() + 0.5*group.innerHeight(),
                f = 1/factor;
            return {
                nw: {x: xx(r2*c1), y: yy(r2*s1)},
                ne: {x: xx(r2*c2), y: yy(r2*s2)},
                se: {x: xx(r1*c2), y: yy(r1*s2)},
                sw: {x: xx(r1*c1), y: yy(r1*s1)},
                w: {x: xx(rc*c1), y: yy(rc*s1)},
                n: {x: xx(r2*cc), y: yy(r2*sc)},
                e: {x: xx(rc*c2), y: yy(rc*s2)},
                s: {x: xx(r1*cc), y: yy(r1*sc)},
                c: {x: xx(rc*cc), y: yy(rc*sc)},
                tooltip: 's'
            };

            function xx(x) {return Math.round(f*(left + x) + bbox.left);}
            function yy(y) {return Math.round(f*(top - y) + bbox.top);}
        };

        return d;
    }

    g.svg.pie = function (draw, width, height) {

        var group = draw.group(),
            container = group.element(),
            opts = draw.options(),
            trans = opts.transition,
            pp = container.select('#' + draw.uid()),
            resizing = group.resizing();

        if (!pp.size()) {
            resizing = true;
            pp = container.append("g")
                        .attr('id', draw.uid())
                        .classed('pie', true);
            pp.append('g').classed('slices', true);
        }

        var slices = pp.attr("transform", "translate(" + width/2 + "," + height/2 + ")")
                        .select('.slices')
                        .selectAll(".slice").data(draw.data());

        slices.enter()
            .append("path")
            .attr('class', 'slice');

        slices.exit().remove();

        group.events(slices);

        if (opts.labels.show)
            g.svg.pielabels(draw, pp, opts);

        if (!resizing && trans && trans.duration)
            slices = slices.transition().duration(trans.duration).ease(trans.ease);

        return group.draw(slices.attr('d', draw.arc));
    };

    g.svg.pieslice = function (draw, data) {
        var group = draw.group(),
            p = pieSlice(draw, data, {});

        p.render = function (element) {
            group.draw(element).attr('d', draw.arc);
        };

        return p;
    };

    g.svg.pielabels = function (draw, container, options) {
        var group = draw.group(),
            opts = extend({}, draw.group().options().font, options.labels),
            labels = container.selectAll('.labels'),
            trans = options.transition,
            resizing = group.resizing(),
            pcf = d3.format(options.formatPercent);

        if (!labels.size()) {
            resizing = true;
            labels = container.append('g').classed('labels', true);
        }

        if (opts.position === 'bar') {

        } else {
            var x = draw.x(),
                text = labels.selectAll('text').data(draw.data()),
                pos;
            text.enter().append("text");
            text.exit().remove();
            svg_font(text, opts);

            if (!resizing && trans && trans.duration)
                text = text.transition().duration(trans.duration).ease(trans.ease);

            if (opts.position === 'outside') {
                var outerArc = d3.svg.arc(),
                    lines = container.selectAll('.lines').data([true]),
                    radius,
                    xx;

                lines.enter().append('g').classed('lines', true);
                lines = lines.selectAll('polyline').data(draw.data());
                lines.enter().append('polyline');
                lines.exit().remove();

                if (!resizing && trans && trans.duration)
                    lines = lines.transition().duration(trans.duration).ease(trans.ease);

                var right = [],
                    left = [];
                draw.data().forEach(function (d) {
                    d.labelAngle = midAngle(d);
                    d.labelRadius = d.outerRadius*opts.outerRadius;
                    d.labelTurn = outerArc.innerRadius(d.labelRadius).outerRadius(d.labelRadius).centroid(d);
                    d.labelY = d.labelTurn[1];
                    d.labelAngle < π ? right.push(d) : left.push(d);
                });
                relax(right);
                relax(left);
                lines.attr('points', function (d) {
                        pos = [1.05 * d.labelRadius * (d.labelAngle < π ? 1 : -1), d.labelY];
                        return [draw.arc.centroid(d), d.labelTurn, pos];
                    }).attr('fill', 'none')
                    .attr('stroke', opts.color)
                    .attr('stroke-opacity', opts.colorOpacity)
                    .attr('stroke-width', opts.lineWidth);

                text.text(function (d) {
                        return x(d.data) + ' ' + pcf(pc(d));
                    })
                    .attr('transform', function (d) {
                        pos = [1.1 * d.labelRadius * (d.labelAngle < π ? 1 : -1), d.labelY];
                        return 'translate(' + pos + ')';
                    })
                    .style('text-anchor', function (d) {
                        return midAngle(d) < π ? "start":"end";
                    });
            }
        }

        function pc (d) {
            return (d.endAngle - d.startAngle)/τ;
        }

        function relax (nodes) {
            var N = nodes.length,
                tol = 10000,
                maxiter = 100;
            if (N < 3) return;
            var ymin = group.innerHeight()/2 + group.marginTop(),
                ymax = group.innerHeight()/2 + group.marginBottom(),
                iter = 0,
                dy, y0, y1;

            nodes.sort(function (a, b) {return d3.ascending(a.labelY, b.labelY);});

            ymin = Math.min(nodes[0].labelY, -ymin+10);
            ymax = Math.max(nodes[N-1].labelY, ymax-10);

            while (tol > 0.5 && iter<maxiter) {
                y1 = nodes[0].labelY;
                iter++;
                tol = 0;
                nodes[0].dy = 0;
                for (var i=1; i<nodes.length; ++i) {
                    y0 = y1;
                    y1 = nodes[i].labelY;
                    dy = force(y1-y0);
                    nodes[i-1].dy -= dy;
                    nodes[i].dy = dy;
                }
                for (i=1; i<nodes.length-1; ++i) {
                    if (nodes[i].dy < 0)
                        dy = Math.max(nodes[i].dy, 0.49*(nodes[i-1].labelY - nodes[i].labelY));
                    else
                        dy = Math.min(nodes[i].dy, 0.49*(nodes[i+1].labelY - nodes[i].labelY));
                    tol = Math.max(tol, abs(dy));
                    nodes[i].labelY += dy;
                }
                nodes[0].labelY = Math.max(nodes[0].labelY + nodes[0].dy, ymin);
                nodes[N-1].labelY = Math.min(nodes[N-1].labelY + nodes[N-1].dy, ymax);
            }

            function force (dd) {
                return dd < 20 ? 100/(dd*dd) : 0;
            }
        }
    };

    g.canvas.pie = function (draw) {
        draw.each(function () {
            this.reset().render();
        });
    };

    g.canvas.pieslice = function (draw, data) {
        var d = pieSlice(draw, data, {}),
            group = draw.group(),
            factor = draw.factor();

        d.render = function () {
            return _draw(function (ctx) {
                d3.canvas.style(ctx, d);
                return d;
            });
        };

        d.inRange = function (ex, ey) {
            return _draw(function (ctx) {
                return ctx.isPointInPath(ex, ey);
            });
        };

        return d;

        function _draw (callback) {
            var ctx = d.context();
            ctx.save();
            group.transform(ctx);
            ctx.translate(0.5*group.innerWidth(), 0.5*group.innerHeight());
            draw.arc.context(ctx)(d);
            var r = callback(ctx);
            ctx.restore();
            return r;
        }
    };

