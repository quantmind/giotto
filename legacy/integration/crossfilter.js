    g.defaults.crossfilter = {
        tolerance: 1.1
    };

    //
    //  Add Crossfilter integration
    //  params opts
    //      - data: multidimensional data
    //      - callback: Optional callback to invoke once the crossfilter is loaded
    g.crossfilter = function (opts) {
        var cf = extend({}, g.defaults.crossfilter, opts);

        var data = opts.data,
            callback = opts.callback;

        cf.dims = {};

        // Add a new dimension to the crossfilter
        cf.dimension = function (name, callback) {
            if (!callback) {
                callback = function (d) {
                    return d[name];
                };
            }
            cf.dims[name] = cf.data.dimension(callback);
        };

        // Reduce the number of points by using a K-mean clustering algorithm
        cf.reduceDensity = function (dimension, points, start, end) {
            var count = 0,
                dim = cf.dims[dimension],
                group;

            if (!dim)
                throw Error('Cross filter dimension "' + dimension + '"" not available. Add it with the addDimension method');

            if (start === undefined) start = null;
            if (end === undefined) end = null;

            if (start === null && end === null)
                group = dim.filter();
            else
                group = dim.filter(function (d) {
                    if (start !== null && d < start) return;
                    if (end !== null && d > end) return;
                    return true;
                });

            var all = group.bottom(Infinity);

            if (all.length > cf.tolerance*points) {
                var km = g.math.kmeans(),
                    reduced = [],
                    cl = [],
                    centroids = [],
                    r = all.length / points,
                    index, i, c;

                // Create the input for the k-means algorithm
                for (i=0; i<all.length; i++)
                    cl.push([all[i][dimension]]);

                for (i=0; i<points; i++) {
                    centroids.push(cl[Math.round(i*r)]);
                }

                km.centroids(centroids).maxIters(10);

                cl = km.cluster(cl).sort(function (a, b) {
                    return a.centroid[0] - b.centroid[0];
                });

                cl.forEach(function (d) {
                    index = d.indices[0];
                    c = d.points[0];
                    for (i=1; i<d.points.length; ++i) {
                        if (d.points[i] > c) {
                            index = d.indices[i];
                            c = d.points[i];
                        }
                    }
                    reduced.push(all[index]);
                });
                all = reduced;
            }

            return all;
        };


        function build () {
            if (!g.crossfilter.lib)
                throw Error('Could not find crossfilter library');

            // convert data to crossfilter data
            cf.data = g.crossfilter.lib(data);

            if (g._.isArray(opts.dimensions))
                opts.dimensions.forEach(function (o) {
                    cf.dimension(o);
                });

            if (callback) callback(cf);
        }

        if (g.crossfilter.lib === undefined)
            if (typeof crossfilter === 'undefined') {
                require(['crossfilter'], function (crossfilter) {
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
