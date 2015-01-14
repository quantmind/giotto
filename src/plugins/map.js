
    // Map charts and animations
    g.paper.plugin('map', {
        width: 'auto',
        color: null,
        fill: true,
        fillOpacity: 1,
        colorOpacity: 1,
        lineWidth: 1,
        projection: null,
        features: null,
        // Radius in pixels of rounded corners. Set to 0 for no rounded corners
        radius: 4,
        active: {
            fill: 'darker',
            color: 'brighter'
        },
        transition: extend({}, g.defaults.transition)
    },

    function (group, p) {

        group.map = function (data, opts) {
            var type = group.type(),
                features,
                path;

            opts || (opts = {});
            copyMissing(p.map, opts);

            var map = group.add(mapdraw(group, g[type].mapdraw))
                           .options(opts)
                           .data(data);
        };
    });

    function mapdraw (group, renderer) {
        var path = d3.geo.path(),
            draw = drawing(group, renderer),
            features;

        draw.path = function () {

            var opts = draw.options(),
                projection;

            if (opts && opts.projection) {
                projection = opts.projection;
                if (isString(projection)) {
                    projection = g.geo[projection];
                    if (projection) {
                        projection(draw, path);
                        return path;
                    }
                    projection = d3.get[projection];
                }
            }
            if (projection)
                path.transform(projection);
            else
                path.transform(d3.geo.albersUsa);

            return path;
        };

        draw.features = function (_) {
            if (!arguments.length) return features;
            features = _;
            return draw;
        };

        return draw;
    }

    g.svg.mapdraw = function () {
        var draw = this,
            chart = draw.group().element().selectAll("#" + draw.uid()).data([true]),
            features = draw.features();

        chart.enter().append("path").attr('id', draw.uid());

        if (!features)
            return draw.options().features(function (features) {
                draw.features(features).render();
            });
    };

