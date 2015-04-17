    var _idCounter = 0;

    // Base giotto mixin for paper, group and viz
    function giottoMixin (d, opts, plugins) {
        var uid = ++_idCounter;

        opts = g.options(opts).pluginOptions(plugins || g.paper.plugins);

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

        // pick a color
        d.pickColor = function (index) {
            if (arguments.length === 0)
                index = opts.colorIndex++;
            var dk = 0, bk = 0;
            while (index >= opts.colors.length) {
                index -= opts.colors.length;
                dk += opts.darkerColor;
                bk += opts.brighterColor;
            }
            var c = opts.colors[index];
            if (dk)
                c = d3.rgb(c).darker(dk).toString();
            else if (bk)
                c = d3.rgb(c).brighter(bk).toString();
            return c;
        };

        return d;
    }

        // Mixin for visualization classes and visualization collection
    function vizMixin (d, plugins) {
        var loading_data = false,
            data;

        giottoMixin(d, {}, plugins).load = function (callback) {
            var opts = d.options(),
                _ = opts.data;
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
            var opts = d.options();

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

    // Create a function for registering plugins
    function registerPlugin (plugins) {

        var register = function (name, defaults, plugin) {
            if (arguments.length === 3) {
                plugin.defaults = defaults;
                plugin.pluginName = name;
            }
            else
                plugin = name;
            if (!isFunction(plugin.options)) plugin.options = PluginOptions;
            plugins.push(plugin);
        };
        register.plugins = plugins;
        return register;
    }

    function PluginOptions (o) {
        if (o === true) o = {show: true};
        else if (!o) o = {show: false};
        else if (o.show === undefined) o.show = true;
        return o;
    }