
    g.crossfilter = function (options) {
        var cf = {},
            dimensions = {},
            cfdata;

        // Add a new dimension to the crossfilter
        cf.addDimension = function (name, callback) {
            if (!callback) {
                callback = function (d) {
                    return d[name];
                };
            }
            dimensions[name] = cfdata.dimension(callback);
        };

        cf.data = function () {
            return cfdata;
        };


        function build () {
            if (!g.crossfilter.lib)
                throw Error('Could not find crossfilter library');

            cfdata = g.crossfilter.lib(options.data);

            if (g._.isArray(options.dimensions))
                options.dimensions.forEach(function (o) {
                    cf.addDimension(o);
                });

            if (options.callback)
                options.callback(cf);
        }

        if (g.crossfilter.lib === undefined)
            if (typeof crossfilter === 'undefined') {
                g.require(['crossfilter'], function (crossfilter) {
                    g.crossfilter.lib = crossfilter || null;
                    build();
                });
                return cf;
            }
            else {
                g.crossfilter.lib = crossfilter;
            }

        build();
        return cf;
    };