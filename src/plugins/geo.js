    //
    //  Geometric data handler
    //  ===========================
    //
    //  features, array of geometric features
    g.data.geo = function (features) {

        var value = function (d) {return d.value;},
            label = function (d) {return d.label;},
            minval=Infinity,
            maxval=-Infinity,
            scale = d3.scale.linear(),
            colors;

        function geo (serie, geodata, opts) {
            minval = Infinity;
            maxval = -Infinity;

            features.forEach(function (feature) {
                feature = {object: feature};
                d = serie.get(feature.object.id);
                if (d) {
                    val = +y(d);
                    if (val === val) {
                        minval = Math.min(val, minval);
                        maxval = Math.max(val, maxval);
                        feature.data = [label(d), val];
                        feature.fill = color(scale(val));
                    } else {
                        feature.active = false;
                        feature.fill = opts.missingFill;
                    }
                }
                data.push(feature);
            });
            if (scale(0) !== scale(0)) {
                minval = Math.max(minval, 1);
                maxval = Math.max(maxval, minval);
            }
            scale.domain([minval, maxval]);
            return data;
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

        geo.data = function () {
            return data;
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

        geo.colors = function (cols) {
            if (!arguments.length) return colors;
            colors = cols;
            return geo;
        };

        return geo;
    };

    //
    //  Geometry (Maps)
    //  =====================
    //
    //  Geo charts
    //
    g.paper.plugin('geo', {
        deep: ['active', 'tooltip', 'transition'],

        defaults: {
            scale: 1,
            color: '#333',
            missingFill: '#d9d9d9',
            fill: 'none',
            fillOpacity: 1,
            colorOpacity: 1,
            lineWidth: 0.5,
            projection: null,
            features: null,
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

        init: function (group) {

            //
            //  Create a new drawing for geometric datasets
            group.geo = function (data, opts) {
                var type = group.type(),
                    features,
                    path;

                opts || (opts = {});
                copyMissing(group.options().geo, opts);
                group.element().classed('geo', true);

                return group.add(geodraw(group, g[type].geodraw))
                               .options(opts)
                               .data(data);
            };
        }
    });

    //
    //  geo drawing constructor
    //  Used by both SVG and Canvas geo renderer functions
    function geodraw (group, renderer) {
        var path = d3.geo.path(),
            feature = g[group.type()].feature,
            draw = drawing(group, renderer),
            dataFeatures,
            features;

        // Return the path constructor
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

        // Set get/geo topographic features
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
            var geodata = [],
                opts = draw.options(),
                scale = group.yaxis().scale(),
                color = d3.scale.quantize().domain(scale.range()).range(opts.colors.scale);

            // Loop through features and pick data-geo functions
            features.forEach(function (geo) {
                if (isFunction(geo))
                    geo(draw);
                else {
                    geo.active = false;
                    geodata.push(feature(draw, null, geo));
                }
            });
            return geodata;
        }
    }

    // Draw the geo on SVG
    g.svg.geodraw = function () {
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

        var geodata = draw.dataFeatures();
        if (opts.grid) {
            geodata = geodata.slice();
            geodata.push(draw.graticule());
        }

        var paths = chart.selectAll('path').data(geodata),
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


        group.on('zoom.geo', function () {
            chart.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        });
    };

    //  An svg feature in the geo
    //  Similar to a point in a point chart or a bar in a bar chart
    g.svg.feature = function (draw, data, feature) {
        var group = draw.group();
        feature = drawingData(draw, data, feature);

        feature.render = function (element) {
            group.draw(element);
        };

        return feature;
    };

    // Draw the geo on Canvas
    g.canvas.geodraw = function () {
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
