
    g.data.geo = function (features) {
        var value = function (d) {return d.value;},
            label = function (d) {return d.label;},
            minval=Infinity,
            maxval=-Infinity,
            scale = d3.scale.linear(),
            data;

        function geo (mapdata) {
            var d, val;
            minval=Infinity;
            maxval=-Infinity;

            features.forEach(function (feature) {
                feature = {object: feature};
                d = data && data.get ? data.get(feature.object.id) : null;
                if (d) {
                    val = +value(d);
                    if (val === val) {
                        minval = Math.min(val, minval);
                        maxval = Math.max(val, maxval);
                        feature.data = [label(d), val];
                    }
                }
                mapdata.push(feature);
            });
            if (scale(0) !== scale(0)) {
                minval = Math.max(minval, 1);
                maxval = Math.max(maxval, minval);
            }
            scale.domain([minval, maxval]);
            return mapdata;
        }

        geo.value = function (_) {
            if (!arguments.length) return value;
            value = d3_functor(_);
            return geo;
        };

        geo.label = function (_) {
            if (!arguments.length) return label;
            label = d3_functor(_);
            return geo;
        };

        geo.data = function (_) {
            if (!arguments.length) return data;
            data = _;
            return geo;
        };

        geo.minvalue = function () {
            return minval;
        };

        geo.maxvalue = function () {
            return maxval;
        };

        geo.scale = function (_) {
            if (!arguments.length) return scale;
            scale = _;
            return geo;
        };

        return geo;
    };

    // Map charts and animations
    g.paper.plugin('map', {
        scale: 1,
        color: '#333',
        missingFill: '#d9d9d9',
        fill: 'none',
        fillOpacity: 1,
        colorOpacity: 1,
        lineWidth: 0.5,
        projection: null,
        features: null,
        dataScale: 'log',
        active: {
            fill: 'darker'
        },
        formatX: d3_identity,
        tooltip: {
            template: function (d) {
                return "<p><strong>" + d.x + "</strong> " + d.y + "</p>";
            }
        }
    },

    function (group, p) {

        group.map = function (data, opts) {
            var type = group.type(),
                features,
                path;

            opts || (opts = {});
            copyMissing(p.map, opts);
            group.element().classed('geo', true);

            var map = group.add(mapdraw(group, g[type].mapdraw))
                           .options(opts)
                           .data(data);
            return map;
        };
    });

    function mapdraw (group, renderer) {
        var path = d3.geo.path(),
            feature = g[group.type()].feature,
            draw = drawing(group, renderer),
            dataFeatures,
            features;

        draw.path = function () {

            var opts = draw.options(),
                width = Math.round(0.5 * group.innerWidth()),
                height = Math.round(0.5 * group.innerHeight()),
                scale = Math.round(opts.scale*Math.min(width, height)),
                projection;

            if (opts.projection) {
                projection = opts.projection;
                if (isString(projection)) {
                    if (g.geo[projection]) {
                        g.geo[projection](draw, path);
                        return path;
                    }
                    projection = d3.geo[projection];
                }
            }
            if (!projection)
                projection = d3.geo.mercator;

            projection = projection()
                            .scale(scale)
                            .translate([width, height]);

            return path.projection(projection);
        };

        draw.features = function (_) {
            if (!arguments.length) return features;
            features = _;
            dataFeatures = null;
            return draw;
        };

        draw.graticule = function () {
            var g = {object: d3.geo.graticule()()};
            return extend(g, group.options().grid, draw.options().grid);
        };

        draw.dataFeatures = function () {
            if (features && (draw.changed() || !dataFeatures))
                dataFeatures = buildDataFeatures();
            return dataFeatures;
        };

        return draw;

        function buildDataFeatures () {
            var mapdata = [],
                opts = draw.options();
            features.forEach(function (d) {
                if (isFunction(d) && isFunction(d.data)) {
                    var fdata = d.data(draw.data())([]),
                        scale = d.scale(),
                        color = d3.scale.quantize()
                                    .domain(scale.range())
                                    .range(group.options().colors);
                    fdata.forEach(function (d) {
                        if (d.data)
                            d.fill = color(scale(d.data[1]));
                        else {
                            d.active = false;
                            d.fill = opts.missingFill;
                        }
                        mapdata.push(feature(draw, d.data, d));
                    });
                }
                else {
                    d.active = false;
                    mapdata.push(feature(draw, null, d));
                }
            });
            return mapdata;
        }
    }

    // Draw the map on SVG
    g.svg.mapdraw = function () {
        var draw = this,
            opts = draw.options(),
            group = draw.group(),
            chart = group.element().selectAll("#" + draw.uid()),
            trans = opts.transition,
            features = draw.features(),
            resizing = group.resizing();

        if (!chart.size()) {
            chart = group.element().append("g").attr('id', draw.uid());
            resizing = true;
        }

        if (!features)
            return opts.features(function (features) {
                draw.features(features).render();
            });

        var mapdata = draw.dataFeatures();
        if (opts.grid) {
            mapdata = mapdata.slice();
            mapdata.push(draw.graticule());
        }

        var paths = chart.selectAll('path').data(mapdata),
            path = draw.path();

        paths.enter().append('path');
        paths.exit().remove();
        group.events(paths);

        if (!resizing && trans && trans.duration)
            paths = paths.transition().duration(trans.duration).ease(trans.ease);

        group.draw(paths)
            .style('vector-effect', 'non-scaling-stroke')
            .attr('id', function (d) { return d.object.id;})
            .attr('d', function (d) {
                return path(d.object);
            });


        group.on('zoom.map', function () {
            chart.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        });
    };

    g.svg.feature = function (draw, data, feature) {
        var group = draw.group();
        feature = drawingData(draw, data, feature);

        feature.render = function (element) {
            group.draw(element);
        };

        return feature;
    };

    // Draw the map on Canvas
    g.canvas.mapdraw = function () {
        var draw = this,
            opts = draw.options(),
            group = draw.group(),
            features = draw.features();

        if (!features)
            return opts.features(function (features) {
                draw.features(features).render();
            });

        if (opts.grid) {
            features = features.slice();
            features.push(draw.graticule());
        }

        var path = draw.path(),
            ctx = group.context();

        path.context(ctx);
        features.forEach(function (d) {
            path(d.object);
        });
    };

    g.canvas.feature = function (draw, feature) {
        var group = draw.group();

        feature.render = function (element) {
            group.draw(element).attr('d', draw.symbol ? draw.symbol : draw.path());
        };

        return feature;
    };
