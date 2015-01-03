

    function svg_implementation (paper, p) {
        var _ = {};

        _.resize = function (group) {
            if (p.resize) {
                paper.svg()
                    .attr('width', p.size[0])
                    .attr('height', p.size[1]);
                group.resetAxis().render();
            }
        };

        _.point = function (draw, data, size) {
            var p = point(draw, data, size);
            p.render = function (element) {
                _draw(element).attr('d', draw.symbol);
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

        _.path = function (group) {

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
                    _events(group.paper().element(), uid, function () {
                        if (!active)
                            active = el.append('path')
                                        .attr('id', 'point-' + uid)
                                        .datum(_.point(draw, [], 0))
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

        return _;

        // PRIVATE FUNCTIONS

        function _draw (selection) {
            return selection
                    .attr('stroke', function (d) {return d.color;})
                    .attr('stroke-opacity', function (d) {return d.colorOpacity;})
                    .attr('stroke-width', function (d) {return d.lineWidth;})
                    .attr('fill', function (d) {return d.fill;})
                    .attr('fill-opacity', function (d) {return d.fillOpacity;});
        }

        function _events (selection, uid, callback) {
            var name = uid || p.giotto,
                target;

            p.activeEvents.forEach(function (event) {
                selection.on(event + '.' + name, function () {
                    if (uid && !paper.element().select('#' + uid).size())
                        selection.on(event + '.' + uid, null);
                    else {
                        target = callback ? callback.call(this) : this;
                        paper[d3.event.type].call(target);
                    }
                });
            });
            return selection;
        }
    }