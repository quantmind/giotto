
    // Axis functionalities for groups
    g.themes.light.axis = {
        color: '#888',
        colorOpacity: 1
    };
    g.themes.dark.axis = {
        color: '#888',
        colorOpacity: 1
    };

    g.paper.plugin('axis', {

        defaults: {
            show: false,
            tickSize: '6px',
            outerTickSize: '6px',
            tickPadding: '3px',
            lineWidth: 1,
            textRotate: 0,
            textAnchor: null,
            color: ctheme.axis.color,
            colorOpacity: ctheme.axis.colorOpacity,
            //minTickSize: undefined,
            min: null,
            max: null,
            //  axis scale
            //  can be a function or a string such as 'linear', 'log', 'time'
            scale: 'linear',
            font: {
                color: ctheme.axis.color
            }
        },

        init: function (group) {
            var type = group.type(),
                d3v = d3[type],
                xaxis = d3v.axis(),
                yaxis = d3v.axis();

            [xaxis, yaxis].forEach(function (axis, i) {
                var d = i === 0 ? 'x' : 'y',
                    name = d + 'axis';

                axis.options = function () {
                    return group.options()[name];
                };

                group[name] = function () {
                    return axis;
                };

                axis.draw = function () {
                    return group.add(g[type].axis(group, axis, d + '-axis')).options(axis.options());
                };

                group['scale'+d] = function (v) {
                    return axis.scale()(v);
                };

                // coordinate in the input domain
                group[d] = function (u) {
                    var d = axis.scale().domain();
                    return u*(d[d.length-1] - d[0]) + d[0];
                };
            });

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
                        scale;

                    if (o.scale === 'ordinal') {
                        axis.scale(group.ordinalScale(axis, ranges[i]));
                    } else {
                        o.auto = isNull(o.min) || isNull(o.max);
                        if (isFunction(o.scale))
                            axis.scale(o.scale);
                        else if (o.scale === 'time')
                            axis.scale(d3.time.scale());
                        else if (isString(o.scale)) {
                            var dn = d3.scale[o.scale];
                            if (isFunction(dn))
                                axis.scale(dn());
                        }
                        scale = axis.scale();
                        scale.range(ranges[i]);
                    }

                    var innerTickSize = group.scale(group.dim(o.tickSize)),
                        outerTickSize = group.scale(group.dim(o.outerTickSize)),
                        tickPadding = group.scale(group.dim(o.tickPadding));
                    axis.tickSize(innerTickSize, outerTickSize)
                          .tickPadding(tickPadding)
                          .orient(o.position);

                    //if (!o.tickFormat && o.scale === 'time') o.tickFormat = '%Y-%m-%d';

                    if (o.tickFormat) {
                        var f = o.tickFormat;
                        if (isString(f)) {
                            if (o.scale === 'time') f = d3.time.format(f);
                            else f = d3.format(f);
                        }
                        axis.tickFormat(f);
                    }
                });
                return group;
            };

            group.resetAxis();
        },

        extend: function (opts, value) {
            //
            // Create three new plugins
            var axis = opts.axis,
                o = registerPlugin({});

            o.plugin('xaxis', {
                deep: ['font'],
                defaults: extend({position: 'bottom'}, opts.axis, value)
            });
            o.plugin('yaxis', {
                deep: ['font'],
                defaults: extend({position: 'left', nice: true}, opts.axis, value)
            });
            o.plugin('yaxis2', {
                deep: ['font'],
                defaults: extend({position: 'right', nice: true}, opts.axis, value)
            });

            opts.pluginOptions(o.pluginArray);
        }
    });


    g.svg.axis = function (group, axis, xy) {
        return drawing(group, function () {
            var x =0,
                y = 0,
                ax = group.element().select('.' + xy),
                opts = this.options(),
                font = opts.font;
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
            if (!font)
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
                svg_font(text, font);
            }
            return ax;
        });
    };


    g.canvas.axis = function (group, axis, xy) {
        var d = canvasMixin(drawing(group)),
            ctx;

        d.render = function () {
            var x = 0,
                y = 0,
                ctx = d.context(),
                opts = d.options(),
                font = opts.font;

            if (!opts.show) return d;

            ctx.save();
            group.transform(ctx);

            // size of font
            if (font) {
                var size = font.size;
                font.size = group.scale(group.dim(size)) + 'px';
                ctx.font = fontString(font);
                font.size = size;
            }

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
