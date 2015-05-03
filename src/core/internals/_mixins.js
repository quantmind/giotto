    var _idCounter = 0;

    // Base giotto mixin for paper, group and viz
    function giottoMixin (d, opts, plugins) {
        var uid = ++_idCounter;

        opts = g.options(opts, plugins);

        // unique identifier for this object
        d.uid = function () {
            return uid;
        };

        d.event = function (name) {
            return noop;
        };

        // returns the options object
        d.options = function (_) {
            if (!arguments.length) return opts;
            opts.extend(_);
            return d;
        };

        d.toString = function () {
            return 'giotto (' + uid + ')';
        };

        return d;
    }

    // Mixin for visualization classes and visualization collection
    function vizMixin (d, opts, plugins) {
        var loading_data = false,
            data;

        giottoMixin(d, opts, plugins).load = function (callback) {
            opts = d.options();

            var _ = opts.data;
            delete opts.data;

            if (_) {
                if (isFunction(_))
                    _ = _(d);
                d.data(_, callback);
            } else if (opts.src && !loading_data) {
                loading_data = true;
                var src = opts.src,
                    loader = opts.loader;
                if (!loader) {
                    loader = d3.json;
                    if (src.substring(src.length-4) === '.csv') loader = d3.csv;
                }
                g.log.info('Giotto loading data from ' + opts.src);

                return loader(opts.src, function(error, xd) {
                    loading_data = false;
                    if (arguments.length === 1) xd = error;
                    else if(error)
                        return g.log.error(error);

                    d.data(xd, callback);
                });
            } else if (callback) {
                callback();
            }

            return d;
        };

        //
        // Set new data for the visualization
        d.data = function (_, callback) {
            if (!arguments.length) return data;
            opts = d.options();

            if (opts.processData)
                _ = opts.processData.call(d, _);

            data = _;

            if (callback)
                callback();

            d.event('data').call(d, {type: 'data'});

            return d;
        };

        return d;
    }
