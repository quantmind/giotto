    var axisDefaults = {
        tickSize: '6px',
        outerTickSize: '6px',
        tickPadding: '3px',
        lineWidth: 1,
        textRotate: 0,
        textAnchor: null,
        //minTickSize: undefined,
        min: null,
        max: null,
    };

    // Axis functionalities for groups
    g.paper.plugin('axis',

    function (opts) {
        // Inherit axis properties
        var register = registerPlugin([]);
        register('xaxis', axisOptions(extend({position: 'bottom'}, axisDefaults), opts.xaxis), function (){});
        register('yaxis', axisOptions(extend({position: 'left'}, axisDefaults),  opts.yaxis), function (){});
        register('yaxis2', axisOptions(extend({position: 'right'}, axisDefaults),  opts.yaxis2), function (){});
        opts.pluginOptions(register.plugins);

        function axisOptions (o, value) {
            extend(o, value);
            o.font = extend({}, o.font, opts.font);
            return o;
        }
    },

    function (group, opts) {
        var type = group.type(),
            d3v = d3[type],
            xaxis = d3v.axis(),
            yaxis = d3v.axis();

        xaxis.options = function () {return opts.xaxis;};
        yaxis.options = function () {return opts.yaxis;};

        group.xaxis = function () {
            return xaxis;
        };

        group.yaxis = function () {
            return yaxis;
        };

        // Draw X axis
        group.drawXaxis = function () {
            return group.add(g[type].axis(group, xaxis, 'x-axis')).options(opts.xaxis);
        };

        group.drawYaxis = function () {
            return group.add(g[type].axis(group, yaxis, 'y-axis')).options(opts.yaxis);
        };

        group.scalex = function (x) {
            return xaxis.scale()(x);
        };

        group.scaley = function (y) {
            return yaxis.scale()(y);
        };

                // x coordinate in the input domain
        group.x = function (u) {
            var d = xaxis.scale().domain();
            return u*(d[d.length-1] - d[0]) + d[0];
        };

        // y coordinate in the input domain
        group.y = function (u) {
            var d = yaxis.scale().domain();
            return u*(d[d.length-1] - d[0]) + d[0];
        };

        group.ordinalScale = function (axis, range) {
            var scale = axis.scale(),
                o = axis.options();
            o.auto = false,
            o.scale = 'ordinal';
            if (!scale.rangeBand) {
                range = range || scale.range();
                scale = axis.scale(d3.scale.ordinal()).scale();
            } else
                range = range || scale.rangeExtent();
            return scale.rangeRoundBands(range, 0.2);
        };

        group.resetAxis = function () {
            var ranges = [[0, group.innerWidth()], [group.innerHeight(), 0]];
            group.scale().range(ranges[0]);

            [xaxis, yaxis].forEach(function (axis, i) {
                var o = axis.options(),
                    scale = axis.scale();

                if (o.scale === 'ordinal') {
                    scale = group.ordinalScale(axis, ranges[i]);
                } else {
                    o.auto = isNull(o.min) || isNull(o.max);
                    scale.range(ranges[i]);
                }

                var innerTickSize = group.scale(group.dim(o.tickSize)),
                    outerTickSize = group.scale(group.dim(o.outerTickSize)),
                    tickPadding = group.scale(group.dim(o.tickPadding));
                axis.tickSize(innerTickSize, outerTickSize)
                      .tickPadding(tickPadding)
                      .orient(o.position);

                if (o.tickFormat) {
                    var f = o.tickFormat;
                    if (isString(f)) f = d3.format(f);
                    axis.tickFormat(f);
                }
            });
            return group;
        };

        group.resetAxis();
    });

    g.svg.axis = function (group, axis, xy) {
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
            else {
                var text = ax.selectAll('text');
                if (opts.textRotate)
                    text.attr('transform', 'rotate(' + opts.textRotate + ')');
                if (opts.textAnchor)
                    text.style('text-anchor', opts.textAnchor);
                if (opts.dx)
                    text.attr('dx', opts.dx);
                if (opts.dy)
                    text.attr('dy', opts.dy);
                svg_font(text, opts);
            }
            return ax;
        });
    };


    g.canvas.axis = function (group, axis, xy) {
        var d = canvasMixin(drawing(group)),
            opts, ctx;

        d.render = function () {
            ctx = d.context();
            opts = d.options();
            if (opts.show === false) return d;

            var x = 0,
                y = 0,
                size = opts.size;

            ctx.save();
            group.transform(ctx);

            // size of font
            opts.size = group.scale(group.dim(size)) + 'px';
            ctx.font = fontString(opts);
            opts.size = size;

            ctx.strokeStyle = d3.canvas.rgba(d.color, d.colorOpacity);
            ctx.fillStyle = d.color;
            ctx.lineWidth = group.factor()*d.lineWidth;

            if (xy[0] === 'x')
                y = opts.position === 'top' ? 0 : group.innerHeight();
            else
                x = opts.position === 'left' ? 0 : group.innerWidth();
            ctx.translate(x, y);
            axis.textRotate(d3_radians*(opts.textRotate || 0)).textAlign(opts.textAnchor);
            axis(d3.select(ctx.canvas));
            ctx.stroke();
            ctx.restore();
            return d;
        };

        return d;
    };
