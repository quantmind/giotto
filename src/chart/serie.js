    //
    //	Create a serie for a chart
    //
    function chartSerie (chart, data) {

        if (!data) return;

        var opts = chart.options(),
            allranges = chart.allranges(),
            serie = extend({}, opts.serie),
            group, color, show, scaled;

        if (!g.data.isData(data)) {
            extend(serie, data);
            data = serie.data;
            delete serie.data;
            if (!data) return;
        }

        serie.index = chart.numSeries();

        // Default label
        if (!serie.label) serie.label = 'serie ' + serie.index;

        opts.chartTypes.forEach(function (type) {
            var o = serie[type];
            if (isArray(o) && !serie.data) {
                serie.data = o;
                o = {}; // an ampty object so that it is shown
            }
            if (o || (opts[type] && opts[type].show)) {
                serie[type] = extend({}, opts[type], o);
                serie[type].show = show = true;
            }
        });

        // None of the chart are shown, specify line
        if (!show)
            serie.line = extend({}, opts.line);

        opts.chartTypes.forEach(function (type) {
            var o = serie[type];

            if (o && chartTypes[type].scaled) {
                // pick a default color if one is not given
                if (!color)
                    color = chart.drawColor(o);
                if (!o.color)
                    o.color = color;
                scaled = true;
            }
        });

        // The serie needs axis
        if (scaled) {
            if (serie.yaxis === undefined)
                serie.yaxis = 1;
            if (!serie.axisgroup) serie.axisgroup = 1;

            var ranges = allranges[serie.axisgroup];

            if (!ranges) {
                // ranges not yet available for this chart axisgroup,
                // mark the serie as the reference for this axisgroup
                serie.reference = true;
                allranges[serie.axisgroup] = ranges = {};
            }

            if (!isObject(serie.xaxis)) serie.xaxis = opts.xaxis;
            if (serie.yaxis === 2) serie.yaxis = opts.yaxis2;
            if (!isObject(serie.yaxis)) serie.yaxis = opts.yaxis;
        }

        // The group of this serie
        serie.group = function () {
            return group;
        };

        serie.clear = function () {
            if (group) group.remove();
            group = null;
            return serie;
        };

        serie.data = function (_) {
            if (!arguments.length) return data;

            // check axis and ranges
            if (scaled) {

                var ranges = allranges[serie.axisgroup],
                    p = ranges[serie.xaxis.position],
                    xy = xyData(_, serie.x, serie.y),
                    stype;

                _ = xy.data;

                if (!p) {
                    ranges[serie.xaxis.position] = p = {
                        range: xy.xrange,
                        ordinal: xy.xordinal,
                        serie: serie
                    };
                    serie.drawXaxis = true;
                } else {
                    p.range[0] = Math.min(p.range[0], xy.xrange[0]);
                    p.range[1] = Math.max(p.range[1], xy.xrange[1]);
                }

                p = ranges[serie.yaxis.position];
                if (!p) {
                    ranges[serie.yaxis.position] = p = {
                        range: xy.yrange,
                        ordinal: xy.yordinal,
                        serie: serie
                    };
                    serie.drawYaxis = true;
                } else {
                    p.range[0] = Math.min(p.range[0], xy.yrange[0]);
                    p.range[1] = Math.max(p.range[1], xy.yrange[1]);
                }
            }
            data = _;

            opts.chartTypes.forEach(function (type) {
                stype = serie[type];
                if (stype && isFunction(stype.data))
                    stype.data(data);
            });

            return serie;
        };

        serie.draw = function () {
            var opts = chart.options(),
                stype;

            if (!group) {

                // Remove previous serie drawing if any
                opts.chartTypes.forEach(function (type) {
                    stype = serie[type];
                    if (stype) {
                        if(isFunction(stype.options))
                            stype = stype.options();
                        serie[type] = stype;
                    }
                });

                group = chart.paper().classGroup(slugify(serie.label), serie);

                // Is this the reference serie for its axisgroup?
                if (serie.reference)
                    group.element().classed('reference', true)
                                   .classed(chart.axisGroupId(serie.axisgroup), true);

                // Draw X axis or set the scale of the reference X-axis
                if (serie.drawXaxis)
                    domain(group.xaxis(), 'x').drawXaxis();
                else if (serie.axisgroup)
                    scale(group.xaxis());

                // Draw Y axis or set the scale of the reference Y-axis
                if (serie.drawYaxis)
                    domain(group.yaxis(), 'y').drawYaxis();
                else if (serie.axisgroup)
                    scale(group.yaxis());

                opts.chartTypes.forEach(function (type) {
                    stype = serie[type];
                    if (stype)
                        serie[type] = chartTypes[type](group, serie.data(), stype).label(serie.label);
                });
            } else {
                opts.chartTypes.forEach(function (type) {
                    stype = serie[type];
                    if (stype)
                        serie[type].label(serie.label);
                });
                serie.drawXaxis ? domain(group.xaxis()) : scale(group.xaxis());
                serie.drawYaxis ? domain(group.yaxis()) : scale(group.yaxis());
            }

            return serie;

            function domain(axis, xy) {
                var p = allranges[serie.axisgroup][axis.orient()],
                    o = axis.options(),
                    scale = axis.scale(),
                    opadding = 0.1;

                if (p.ordinal) scale = group.ordinalScale(axis);

                p.scale = scale;
                if (scale.rangeBand) {
                    scale.domain(data.map(function (d) {return d[xy];}));
                } else if (o.auto) {
                    scale.domain([p.range[0], p.range[1]]).nice();
                    if (!isNull(o.min))
                        scale.domain([o.min, scale.domain()[1]]);
                    else if (!isNull(o.max))
                        scale.domain([scale.domain()[0], o.max]);
                } else {
                    scale.domain([o.min, o.max]);
                }
                return group;
            }

            function scale (axis) {
                if (serie.axisgroup) {
                    var p = allranges[serie.axisgroup][axis.orient()];
                    axis.scale(p.scale);
                }
            }
        };

        return serie.data(data);
    }
