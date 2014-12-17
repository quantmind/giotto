
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

        _.setBackground = function (o, background) {
            if (isObject(background)) {
                if (background.fillOpacity !== undefined)
                    o.attr('fill-opacity', background.fillOpacity);
                background = background.fill;
            }
            if (isString(background))
                o.attr('fill', background);
        };

        // Create a gradient element to use by scg elements
        _.gradient = function (id, color1, color2) {
            var svg = d3.select("body").append("svg"),
                gradient = svg.append('linearGradient')
                            .attr("x1", "0%")
                            .attr("x2", "100%")
                            .attr("y1", "0%")
                            .attr("y2", "100%")
                            .attr("id", id)
                            .attr("gradientUnits", "userSpaceOnUse");
            gradient
                .append("stop")
                .attr("offset", "0")
                .attr("stop-color", color1);

            gradient
                .append("stop")
                .attr("offset", "0.5")
                .attr("stop-color", color2);
        };

        _.point = function (draw, data, size) {
            var p = point(draw, data, size);
            p.render = function (element) {
                _draw(element).attr('d', draw.symbol);
            };
            return p;
        };

        _.bar = point;

        _.pieslice = function (draw, data) {
            var p = pieSlice(draw, data);
            p.render = function (element) {
                _draw(element).attr('d', draw.arc);
            };
            return p;
        };

        _.points = function (group) {

            return drawing(group, function () {

                var pp = group.element().select("#" + this.uid()),
                    scalex = this.scalex(),
                    scaley = this.scaley();

                this.symbol = d3.svg.symbol().type(function (d) {return d.symbol;})
                                             .size(this.size());

                if (!pp.node()) {
                    pp = group.element().append('g').attr('id', this.uid());
                    this.remove = function () {
                        pp.remove();
                    };
                }

                pp.selectAll('*').remove();
                _events(_draw(pp.selectAll('path')
                        .data(this.data())
                         .enter()
                         .append('path')
                         .attr("transform", function(d) {
                             return "translate(" + scalex(d.data) + "," + scaley(d.data) + ")";
                         })
                         .attr('d', this.symbol)));

                return pp;
            });
        };

        _.path = function (group, data) {

            return drawing(group, function () {

                var draw = this,
                    opts = draw.options(),
                    p = group.element().select("#" + draw.uid()),
                    line = opts.area ? d3.svg.area() : d3.svg.line();

                if (!p.node())
                    p = _events(draw.group().element().append('path').attr('id', draw.uid()));

                line.interpolate(opts.interpolate).x(draw.scalex()).y(draw.scaley());

                return p
                    .datum(data)
                    .attr('d', line)
                    .attr('stroke', draw.color)
                    .attr('stroke-opacity', draw.colorOpacity)
                    .attr('stroke-width', draw.lineWidth)
                    .attr('fill', 'none');
            });
        };

        // Draw a barchart
        _.barchart = function (group) {

            return drawing(group, function () {
                var zero = scaley(0),
                    chart = container.select('g.barchart'),
                    bar;

                if (!chart.node())
                    chart = container.append("g")
                                .attr('class', 'barchart');

                bar = draw(chart
                        .selectAll(".bar")
                        .data(data)
                        .enter().append("rect")
                        .attr('class', 'bar')
                        .attr("x", function(d) {
                            return scalex(d.values.x) - 0.5*d.size();
                        })
                        .attr("y", function(d) {return d.values.y < 0 ? zero : scaley(d.values.y); })
                        .attr("height", function(d) {
                            return d.values.y < 0 ? scaley(d.values.y) - zero : zero - scaley(d.values.y);
                        }));

                if (opts.radius > 0)
                    bar.attr('rx', opts.radius).attr('ry', opts.radius);

                _events(bar);
            });
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
                if (!ax.node())
                    ax = this.group().element().append('g').attr('class', xy);
                if (xy[0] === 'x')
                    y = opts.position === 'top' ? 0 : this.group().innerHeight();
                else
                    x = opts.position === 'left' ? 0 : this.group().innerWidth();
                ax.selectAll('*').remove();
                ax.attr("transform", "translate(" + x + "," + y + ")").call(axis);
                ax.selectAll('line, path')
                     .attr('stroke', this.color)
                     .attr('stroke-width', this.lineWidth)
                     .attr('fill', 'none');
                return _font(ax.selectAll('text'), opts);
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