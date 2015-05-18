    //
    //	Create a serie for a chart
    //  ================================
    //
    //  Return a giotto.data.serie object with chart specific functions
    //
    //  A Chart serie create a new giotto group where to draw the serie which
    //  can be a univariate (x,y) or multivariate (x, y_1, y_2, ..., y_n)
    function chartSerie (chart, data) {

        if (!data) return;

        var serie = data,
            obj;

        // If data does not have the forEach function, extend the serie with it
        // and data is obtained from the serie data attribute
        if (!isFunction(data.forEach)) {
            obj = data;
            data = obj.data;
            delete obj.data;
        } else
            obj = {};

        // if not a serie object create the serie
        if (!data || isArray(data))
            serie = g.data.serie().data(data);
        else {
            serie = data;
            data = null;
        }

        if (obj.label) {
            serie.label(d3_functor(obj.label));
            delete obj.label;
        }

        serie.index = chart.numSeries();

        //  Add label if not available
        if (!serie.label()) serie.label(d3_functor('serie ' + serie.index));

        _extendSerie(chart, serie, obj);

        return serie.data(serie.data());
    }


    function _extendSerie (chart, serie, groupOptions) {

        var opts = chart.options(),
            allranges = chart.allranges(),
            serieData = serie.data,
            drawXaxis = false,
            drawYaxis = false,
            group, color, show, scaled;

        opts.chartTypes.forEach(function (type) {
            var o = groupOptions[type];
            if (o || (opts[type] && opts[type].show)) {
                serie[type] = extend({}, opts[type], o);
                show = true;
                // Could be a function
                if (!serie[type].show)
                    serie[type].show = true;
            }
        });

        // None of the chart are shown, specify line
        if (!show)
            serie.line = extend({}, opts.line, {show: true});

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

        //  Override data function
        serie.data = function (inpdata) {
            if (!arguments.length) return serieData();
            serieData(inpdata);

            // check axis and ranges
            if (scaled) {
                drawXaxis = setRange(serie.xaxis.position, serie.xrange());
                drawYaxis = setRange(serie.yaxis.position, serie.yrange());
            }

            opts.chartTypes.forEach(function (type) {
                stype = serie[type];
                if (stype && isFunction(stype.data))
                    stype.data(serie);
            });

            return serie;
        };

        //  Draw the chart Serie
        serie.draw = function () {
            var opts = chart.options(),
                stype;

            //  Create the group
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

                group = chart.paper().group(groupOptions);

                // Is this the reference serie for its axisgroup?
                if (serie.reference)
                    group.element().classed('reference', true)
                                   .classed(chart.axisGroupId(serie.axisgroup), true);

                // Draw X axis or set the scale of the reference X-axis
                if (drawXaxis)
                    domain(group.xaxis(), 'x').xaxis().draw();
                else if (serie.axisgroup)
                    scale(group.xaxis());

                // Draw Y axis or set the scale of the reference Y-axis
                if (drawYaxis)
                    domain(group.yaxis(), 'y').yaxis().draw();
                else if (serie.axisgroup)
                    scale(group.yaxis());

                opts.chartTypes.forEach(function (type) {
                    stype = serie[type];
                    if (stype)
                        serie[type] = chartTypes[type](group, serie, stype)
                                                .x(serie.x())
                                                .y(serie.y())
                                                .label(serie.label());
                });
            } else {
                opts.chartTypes.forEach(function (type) {
                    stype = serie[type];
                    if (stype)
                        serie[type].label(serie.label);
                });
                drawXaxis ? domain(group.xaxis()) : scale(group.xaxis());
                drawYaxis ? domain(group.yaxis()) : scale(group.yaxis());
            }

            return serie;

            function domain(axis, xy) {
                var p = allranges[serie.axisgroup][axis.orient()],
                    o = axis.options(),
                    scale = axis.scale(),
                    opadding = 0.1;

                if (!p.range) scale = group.ordinalScale(axis);

                p.scale = scale;
                if (scale.rangeBand) {
                    scale.domain(data.map(function (d) {return d[xy];}));
                } else if (o.auto) {
                    scale.domain([p.range[0], p.range[1]]);
                    if (o.nice)
                        scale.nice();
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
                    if (p.scale)
                        axis.scale(p.scale);
                }
            }
        };

        function setRange (position, range) {
            var ranges = allranges[serie.axisgroup],
                p = ranges[position];

            // range is not available
            if (!p) {
                ranges[position] = {range: range};
                return true;
            } else if (p.range && range)
                p.range = [Math.min(p.range[0], range[0]),
                           Math.max(p.range[1], range[1])];
            return false;
        }
    }
