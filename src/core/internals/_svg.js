
    function svg_implementation (paper, p) {
        var _ = {};

        _.resize = function (group, oldsize) {
            if (p.resize) {
                paper.svg()
                    .attr('width', p.size[0])
                    .attr('height', p.size[1]);
                group.resetAxis().render();
            }
        };

        _.clear = function (group) {
            group.element().selectAll('*').remove();
        };

        _.point = function (draw, data, size) {
            var p = point(draw, data, size);
            p.render = function (element) {
                _draw(element).attr('d', draw.symbol);
            };
            return p;
        };

        _.bar = function (draw, data, size) {
            var p = point(draw, data, size);
            p.render = function (element) {
                _draw(element);
            };
            return p;
        };

        _.pieslice = function (draw, data) {
            var p = pieSlice(draw, data);
            p.render = function (element) {
                _draw(element).attr('d', draw.arc);
            };
            return p;
        };

        _.points = function () {

            var group = this.group(),
                pp = group.element().select("#" + this.uid()),
                scalex = this.scalex(),
                scaley = this.scaley(),
                data = this.data();

            this.symbol = d3.svg.symbol().type(function (d) {return d.symbol;})
                                         .size(this.size());

            if (!pp.node()) {
                pp = group.element().append('g').attr('id', this.uid());
                this.remove = function () {
                    pp.remove();
                };
            }

            var points = pp.selectAll('*');
            if (data.length != points.length) {
                points.remove();
                points = pp.selectAll('*')
                        .data(this.data())
                        .enter()
                        .append('path');
            }
            _events(_draw(points
                     .attr("transform", function(d) {
                         return "translate(" + scalex(d.data) + "," + scaley(d.data) + ")";
                     })
                     .attr('d', this.symbol)));

            return pp;
        };

        _.path = function (group, data) {

            return drawing(group, function () {

                var draw = this,
                    opts = draw.options(),
                    el = group.element(),
                    p = el.select("#" + draw.uid()),
                    trans = opts.transition,
                    scaley = group.yaxis().scale(),
                    line = d3.svg.line()
                                .interpolate(opts.interpolate)
                                .x(draw.scalex())
                                .y(draw.scaley()),
                    a;

                if (!p.node()) {
                    p = _events(el.append('path').attr('id', draw.uid())).datum(data);
                    if (opts.area)
                        a = el.append('path').attr('id', draw.uid()+'area').datum(data);
                }
                else {
                    p.datum(data);
                    a = el.select("#" + draw.uid()+'area');
                    if (opts.area) {
                        if(!a.size())
                            a = el.append('path').attr('id', draw.uid()+'area');
                        a.datum(data);
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
                    line = d3.svg.area()
                                .interpolate(opts.interpolate)
                                .x(draw.scalex())
                                .y0(scaley(scaley.domain()[0]))
                                .y1(draw.scaley());
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
                return p;
            });
        };

        // Draw a barchart
        _.barchart = function () {
            var group = this.group(),
                chart = group.element().select("#" + this.uid()),
                opts = this.options(),
                scalex = this.scalex(),
                scaley = this.scaley(),
                size = this.size(),
                zero = group.scaley(0),
                data = this.data(),
                trans = opts.transition,
                bar, y;

            if (!chart.node())
                chart = group.element().append("g")
                            .attr('id', this.uid());

            bar = chart.selectAll(".bar");

            if (bar.size() !== data.length) {
                bar.remove();
                bar = _events(_draw(chart
                        .selectAll(".bar")
                        .data(data)
                        .enter().append("rect")
                        .attr('class', 'bar')));
            } else
                bar.data(data);

            if (!group.resizing() && trans && trans.duration)
                bar = bar.transition().duration(trans.duration).ease(trans.ease);

            bar.attr("x", function(d) {
                    return scalex(d.data) - 0.5*size(d);
                })
                .attr("y", function(d) {
                    return Math.min(zero, scaley(d.data));
                })
                .attr("height", function(d) {
                    return abs(scaley(d.data) - zero);
                })
                .attr("width", size);

            if (opts.radius > 0)
                bar.attr('rx', opts.radius).attr('ry', opts.radius);

            return chart;
        };

        // Pie chart drawing on an svg group
        _.pie = function (draw, width, height) {

            var container = draw.group().element(),
                pp = container.select('#' + draw.uid());

            if (!pp.node())
                pp = container.append("g")
                            .attr('id', draw.uid())
                            .classed('pie', true);

            pp.attr("transform", "translate(" + width/2 + "," + height/2 + ")")
                .selectAll(".slice").remove();

            return _events(_draw(pp
                            .selectAll(".slice")
                            .data(draw.data())
                            .enter()
                            .append("path")
                            .attr('class', 'slice')
                            .attr('d', draw.arc)));
        };

        _.axis = function (group, axis, xy) {
            return drawing(group, function () {
                var x =0,
                    y = 0,
                    ax = group.element().select('.' + xy),
                    opts = this.options();
                if (opts.show === false) {
                    ax.remove();
                    return;
                }
                if (!ax.node())
                    ax = this.group().element().append('g').attr('class', xy);
                if (xy[0] === 'x')
                    y = opts.position === 'top' ? 0 : this.group().innerHeight();
                else
                    x = opts.position === 'left' ? 0 : this.group().innerWidth();
                //ax.selectAll('*').remove();
                ax.attr("transform", "translate(" + x + "," + y + ")").call(axis);
                ax.selectAll('line, path')
                     .attr('stroke', this.color)
                     .attr('stroke-opacity', this.colorOpacity)
                     .attr('stroke-width', this.lineWidth)
                     .attr('fill', 'none');
                if (opts.size === 0)
                    ax.selectAll('text').remove();
                else
                    _font(ax.selectAll('text'), opts);
                return ax;
            });
        };

        return _;

        // PRIVATE FUNCTIONS

        function _font (selection, opts) {
            return selection.style({
                'fill': opts.color,
                'font-size': opts.size ,
                'font-weight': opts.weight,
                'font-style': opts.style,
                'font-family': opts.family,
                'font-variant': opts.variant
            });
        }

        function _draw (selection) {
            return selection
                    .attr('stroke', function (d) {return d.color;})
                    .attr('stroke-opacity', function (d) {return d.colorOpacity;})
                    .attr('stroke-width', function (d) {return d.lineWidth;})
                    .attr('fill', function (d) {return d.fill;})
                    .attr('fill-opacity', function (d) {return d.fillOpacity;});
        }

        function _events (selection) {
            p.activeEvents.forEach(function (event) {
                selection.on(event + '.' + p.giotto, function () {
                    paper[d3.event.type].call(this);
                });
            });
            return selection;
        }
    }