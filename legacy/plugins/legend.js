    var inlinePositions = ['bottom', 'top'];

    //
    //  Add legend functionality to Charts
    g.viz.chart.plugin('legend', {
        deep: ['font'],

        defaults: {
            show: false,
            draggable: true,
            margin: 50,
            position: 'top-right',
            padding: 5,
            textPadding: 5,
            fill: '#fff',
            fillOpacity: 1,
            color: '#000',
            colorOpacity: 1,
            lineWidth: 1,
            radius: 0,
            symbolLength: 30,
            symbolPadding: 10,
            font: {
                size: '14px'
            }
        },

        init: function (chart) {
            var opts;

            chart.Legend = function (build) {
                var labels = [],
                    group = chart.paper().select('.chart-legend');

                if (!group && build) {
                    group = chart.paper().classGroup('chart-legend', {margin: opts.legend.margin});
                    group.add(group.type() === 'svg' ? SvgLegend : CanvasLegend);
                }

                return group;
            };

            chart.on('tick.legend', function () {
                if (!opts) {
                    opts = chart.options();
                    opts.menu.items.push({
                        label: function () {
                            if (chart.paper().select('.chart-legend'))
                                return 'Hide legend';
                            else
                                return 'Show legend';
                        },
                        callback: function () {
                            var group = chart.paper().select('.chart-legend');
                            if (group) group.remove();
                            else chart.Legend(true).render();
                        }
                    });
                }

                if (chart.drawing()) return;
                if (opts.legend.show)
                    chart.Legend(true).render();
                else {
                    var legend = chart.Legend();
                    if (legend) legend.remove();
                }
            });

            function getLabels () {
                var labels = [];

                chart.each(function (serie) {
                    if (isArray(serie.legend))
                        serie.legend.forEach(function (label) {
                            addlabel(serie, label);
                        });
                    else
                        addlabel(serie, serie.legend);
                });

                return labels;

                function addlabel (serie, legend) {
                    legend || (legend = {});
                    if (!legend.label) legend.label = serie.label;
                    legend.line = serie.line;
                    legend.point = serie.point;
                    legend.bar = serie.bar;
                    legend.pie = serie.pie;
                    legend.index = labels.length;
                    labels.push(legend);
                }
            }

            function getPosition (group, width, height) {
                var position = opts.legend.position,
                    x, y;

                if (position.substring(0, 6) === 'bottom') {
                    position = position.substring(7);
                    y = group.height() - 1.7*height;
                } else if (position.substring(0, 3) === 'top') {
                    position = position.substring(4);
                    y = 0;
                } else
                    y = 0;

                if (position == 'left')
                    x = 0;
                else if (position === 'right')
                    x = 0.5*(group.innerWidth() - width);
                else
                    x = 0.5*(group.innerWidth() - width);

                return [x, y];
            }

            function SvgLegend () {
                var labels = getLabels(),
                    group = this.group(),
                    element = group.element()
                                    .selectAll('g.legend').data([true]),
                    box = group.element().selectAll('.legend-box').data([true]),
                    d = opts.legend,
                    padding = d.padding,
                    position = d.position,
                    inline = inlinePositions.indexOf(position) > -1,
                    fsize = group.scale(group.dim(d.font.size)),
                    lp = Math.round(fsize/3),
                    dy = fsize + d.textPadding,
                    dx = d.symbolLength + d.symbolPadding,
                    lineData = [[[0, 0], [d.symbolLength, 0]]],
                    line = d3.svg.line(),
                    symbol = d3.svg.symbol(),
                    drag = d3.behavior.drag()
                                .on("drag", dragMove)
                                .on('dragstart', dragStart),
                    x = 0,
                    y = 0,
                    t;

                function dragStart(d) {
                    d3.select('.legend-box').attr('cursor', 'move');
                    d3.select('.legend').attr('cursor', 'move');
                }

                function dragMove(d) {
                    var x = d3.event.x - 3*opts.legend.symbolLength,
                        y = d3.event.y;

                    d3.select('.legend-box').attr("transform", "translate(" + x + "," + y + ")");
                    d3.select('.legend').attr("transform", "translate(" + x + "," + y + ")");
                }

                box.enter().append('rect').classed('legend-box', true);
                element.enter().append('g').classed('legend', true);

                if (d.draggable) {
                    box.call(drag);
                    element.call(drag);
                }

                var items = element.selectAll('.legend-item').data(labels),
                    node = element.node();

                items.enter().append('g').classed('legend-item', true);
                items.exit().remove();

                items.each(function() {
                    var target = d3.select(this),
                        d = target.datum();
                    if (!inline) y = d.index*dy;

                    if (d.line && !d.bar) {
                        t = target.selectAll('path.line').data([true]);
                        t.enter().append('path').classed('line', true);
                        t.data(lineData)
                            .attr('transform', "translate(" + x + "," + (y-lp) + ")")
                            .attr('d', line)
                            .attr('stroke-width', d.lineWidth || d.line.lineWidth)
                            .attr('stroke', d.color || d.line.color)
                            .attr('stroke-opacity', d.colorOpacity || d.line.colorOpacity);
                    } else {
                        target.selectAll('path.line').data([]).exit().remove();
                    }

                    if (d.point || d.bar) {
                        var p = d.point || d.bar;
                        t = target.selectAll('path.symbol').data([true]);
                        t.enter().append('path').classed('symbol', true);
                        t.attr('transform', "translate(" + (x + opts.legend.symbolLength/2) + "," + (y-lp) + ")")
                            .attr('stroke-width', d.lineWidth || p.lineWidth)
                            .attr('stroke', d.color || p.color)
                            .attr('fill', d.fill || p.fill)
                            .attr('stroke-opacity', d.colorOpacity || p.colorOpacity)
                            .attr('d', symbol);
                    } else {
                        target.selectAll('path.symbol').data([]).exit().remove();
                    }

                    t = target.selectAll('text').data([true]);
                    t.enter().append('text');
                    svg_font(t.attr('x', x + dx).attr('y', y).text(d.label), opts.legend.font);

                    if (inline) x += this.getBBox().width + dx;
                });

                var bbox = node.getBBox(),
                    height = Math.ceil(bbox.height + 2*padding),
                    width = Math.ceil(bbox.width + 2*padding);

                var xy = getPosition(group, width, height);


                element.attr("transform", "translate(" + xy[0] + "," + xy[1] + ")");

                box.attr("transform", "translate(" + xy[0] + "," + xy[1] + ")")
                    .attr('x', bbox.x-padding)
                    .attr('y', bbox.y-padding)
                    .attr('height', height)
                    .attr('width', width)
                    .attr('fill', opts.legend.fill)
                    .attr('stroke', opts.legend.color)
                    .attr('lineWidth', opts.legend.lineWidth);
            }

            function CanvasLegend () {
                var labels = getLabels(),
                    group = this.group(),
                    ctx = group.context(),
                    d = opts.legend,
                    font_size = d.font.size,
                    fsize = group.scale(group.dim(font_size)),
                    lp = Math.round(fsize/3),
                    factor = group.factor(),
                    padding = factor*d.padding,
                    textPadding = factor*d.textPadding,
                    spacing = factor*d.symbolPadding,
                    symbolLength = factor*d.symbolLength,
                    symbolSize = Math.ceil(0.333*symbolLength),
                    dx = symbolLength + spacing,
                    dy = fsize + textPadding,
                    inline = inlinePositions.indexOf(d.position) > -1,
                    line = d3.canvas.line(),
                    symbol = d3.canvas.symbol().size(symbolSize*symbolSize),
                    mtxt,
                    width = 0,
                    height = 0;

                ctx.save();
                group.transform(ctx);

                d.font.size = fsize + 'px';
                ctx.font = fontString(d.font);
                d.font.size = font_size;

                ctx.textBaseline = 'middle';

                if (inline) {
                    height = dy;
                    labels.forEach(function (label) {
                        if (width) width += spacing;
                        mtxt = ctx.measureText(label.label);
                        width += dx + mtxt.width;
                    });
                } else {
                    labels.forEach(function (label) {
                        mtxt = ctx.measureText(label.label);
                        width = Math.max(width, dx + mtxt.width);
                        height += dy;
                    });
                }

                var p = 2*(padding + factor*d.lineWidth);
                height = Math.ceil(height + p);
                width = Math.ceil(width + p);

                var xy = getPosition(group, width, height);
                width -= 2*factor*d.lineWidth;
                height -= 2*factor*d.lineWidth;

                // Draw the rectangle containing the legend
                ctx.translate(xy[0], xy[1]);
                ctx.beginPath();
                d3.canvas.drawPolygon(ctx, [[-padding, -padding], [width, -padding], [width, height], [-padding, height]], d.radius);
                ctx.fillStyle = d3.canvas.rgba(d.fill, d.fillOpacity);
                ctx.strokeStyle = d3.canvas.rgba(d.color, d.colorOpacity);
                ctx.lineWidth = factor*d.lineWidth;
                ctx.fill();
                ctx.stroke();

                var x = 0, y = dy/2;

                labels.forEach(function (l) {
                    if (l.line && !l.bar) {
                        line.context(ctx)([[x, y], [x + symbolLength, y]]);
                        ctx.strokeStyle = l.color || l.line.color;
                        ctx.lineWidth = factor*l.line.lineWidth;
                        ctx.stroke();
                    }

                    if (l.point || l.bar) {
                        var p = l.point || l.bar;
                        ctx.save();
                        ctx.translate(x + 0.5*factor*d.symbolLength, y);
                        symbol.context(ctx)();
                        d3.canvas.style(ctx, extend({}, p, l));
                        ctx.restore();
                    }

                    x += dx;
                    ctx.fillStyle = d.color;
                    ctx.fillText(l.label, x, y);

                    if (inline) x += ctx.measureText(l.label).width + spacing;
                    else {
                        x = 0;
                        y += dy;
                    }
                });

                ctx.restore();
            }
        }
    });
