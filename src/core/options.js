
    g.options = function (opts) {
        opts || (opts = {});
        if (!isFunction(opts.pluginOptions))
            return initOptions({}, {}).extend(g.defaults.paper).extend(opts);
        else
            return opts;
    };

    g.options.processors = {
        //
        colors: function (_, value) {
            if (isFunction (value)) value = value(d3);
            return value;
        },
        //
        font: extendOption('font'),
        //
        transition: extendOption('transition'),
        //
        margin: function (opts, value) {
            if (!isObject(value)) value = {left: value, right: value, top: value, bottom: value};
            return value;
        }
    };

    function extendOption (name) {

        return function (opts, value) {
            if (!isObject(value)) value = {};
            return extend({}, opts[name], value);
        };
    }

    function initOptions (opts, pluginOptions) {

        opts.extend = function (o) {
            var popts;

            forEach(o, function (value, name) {
                if (name.substring(0, 1) !== '_') {
                    popts = pluginOptions[name];
                    if (popts)
                        value = _optionsExtend(opts[name], _pluginOptions(value));
                    else if (g.options.processors[name])
                        value = g.options.processors[name](opts, value);
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
                    value = extend(target[name], value);
                if (g.options.processors[name])
                    value = g.options.processors[name](opts, value);
                target[name] = value;
            });
        }

        function _pluginOptions (opts) {
            if (opts === true) opts = {show: true};
            else if (!opts) opts = {show: false};
            else if (opts.show === undefined) opts.show = true;
            return opts;
        }
    }