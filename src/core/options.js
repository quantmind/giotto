    //
    //	Giotto Options
    //	========================
    //
    //	Constructor of options for Giotto components
    g.options = function (opts) {
        // If this is not an option object create it
        if (!opts || !isFunction(opts.pluginOptions)) {
            opts = extend({}, g.defaults.paper, opts);
            opts = initOptions(opts, {});
        }
        return opts;
    };

    g.options.processors = {
        //
        colors: function (_, value) {
            if (isFunction (value)) value = value(d3);
            return value;
        },
        font: extendOption,
        transition: extendOption,
        margin: function (opts, value) {
            if (!isObject(value)) value = {left: value, right: value, top: value, bottom: value};
            return value;
        }
    };

    function extendOption (opts, value) {
        opts || (opts = {});
        return extend(opts, value);
    }

    // Initialise options
    function initOptions (opts, pluginOptions) {

        // 	Extend public values of an option object with an object
        //	and return this options object.
        // 	A public value does not start with an underscore
        opts.extend = function (o) {
            var popts, opn;

            // Loop through object values
            forEach(o, function (value, name) {
                if (name.substring(0, 1) !== '_') {
                    popts = pluginOptions[name];
                    if (popts)
                        value = _optionsExtend(opts[name], _pluginOptions(value));
                    else if (g.options.processors[name])
                        value = g.options.processors[name](opts[name], value);
                    opts[name] = value;
                }
            });
            return opts;
        };

        opts.pluginOptions = function (plugins) {
            if (!arguments.length) return pluginOptions;
            var name, o;

            plugins.forEach(function (plugin) {
                name = plugin.pluginName;
                if (name && pluginOptions[name] === undefined) {
                    pluginOptions[name] = plugin;
                    o = opts[name] = _pluginOptions(opts[name]);
                    if (isFunction(plugin.defaults))
                        plugin.defaults(opts);
                    else {
                        copyMissing(plugin.defaults, o, true);
                        o.transition = extend({}, opts.transition, o.transition);
                    }
                }
            });
            return opts;
        };

        opts.copy = function (o) {
            if (o && isFunction(o.pluginOptions)) return o;
            else return initOptions(extend({}, opts), extend({}, pluginOptions));
        };

        return opts;

        function _optionsExtend (target, source) {
            if (!isObject(target)) return source;

            forEach(source, function (value, name) {
                if (isObject(value))
                    value = extendOption(target[name], value);
                if (g.options.processors[name])
                    value = g.options.processors[name](target[name], value);
                target[name] = value;
            });
            return target;
        }

        function _pluginOptions (o) {
            if (o === true) o = {show: true};
            else if (!o) o = {show: false};
            else if (o.show === undefined) o.show = true;
            return o;
        }
    }
