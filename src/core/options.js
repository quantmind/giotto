
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

    function initOptions (opts, pluginOptions) {

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