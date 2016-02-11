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

        //  Fire an event and return the mixin
        d.fire = function (name) {
            var event = d.event(name);
            event.call(d, {type: name});
            return d;
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
    //
    //  Giotto Plugin Factory
    //  ==========================
    //
    //  Create a function for registering plugins for a given object ``main``
    function registerPlugin (main) {
        main.plugins = {};
        main.pluginArray = [];

        // Register a plugin
        //  - name: plugin name
        //  - plugin: plugin object
        main.plugin = function (name, plugin) {
            plugin = extend({}, defaultPlugin, plugin);
            plugin.name = name;
            // Overriding a plugin
            if (main.plugins[name]) {
                throw new Error('not implemented. Cannot override plugin');
            }
            main.plugins[name] = plugin;
            if (plugin.index !== undefined)
                main.pluginArray.splice(plugin.index, 0, plugin);
            else
                main.pluginArray.push(plugin);
        };

        return main;
    }

    //
    //	Giotto Options
    //	========================
    //
    //	Constructor of options for Giotto components
    g.options = function (opts, plugins) {
        // If this is not an option object create it
        if (!opts || !isFunction(opts.pluginOptions)) {

            var o = extend({}, g.defaults.paper);
                options = {};
            forEach(opts, function (value, name) {
                if (isPrivateAttribute(name)) o[name] = value;
                else options[name] = value;
            });
            opts = initOptions(o, {}).pluginOptions(plugins || g.paper.pluginArray).extend(options);
        } else if (plugins) {
            // Otherwise extend it with plugins given
            opts.pluginOptions(plugins);
        }
        return opts;
    };

    function isPrivateAttribute (name) {
        return name.substring(0, 1) === '_';
    }

    //
    //  Plugin base object
    //
    var defaultPlugin = {
        init: function () {},
        defaults: {},

        // Extend the plugin options
        extend: function (opts, value) {
            var name = this.name,
                defaults = opts[name],
                values = extend({}, defaults, value === true ? {show: true} : value);

            // deep copies
            forEach(this.deep, function (key) {
                values[key] = extend({}, opts[key], defaults[key], values[key]);
            });
            opts[name] = values;
        },

        clear: function (opts) {}
    };

    // Initialise options
    function initOptions (opts, pluginOptions) {

        // 	Extend public values of an option object with an object
        //	and return this options object.
        // 	A public value does not start with an underscore
        opts.extend = function (o) {
            var plugin, opn;

            // Loop through object values
            forEach(o, function (value, name) {
                // only extend non private values
                if (!isPrivateAttribute(name)) {
                    plugin = pluginOptions[name];
                    if (plugin)
                        plugin.extend(opts, value);
                    else
                        opts[name] = value;
                }
            });
            return opts;
        };

        //  If no argument is given, returns all plugins in this options object
        //  If a plugins object is given add plugins options only if plugins
        //  is not already available
        opts.pluginOptions = function (plugins) {
            if (!arguments.length) return pluginOptions;
            var name, o;

            if (plugins.length ) {
                var queue = [];

                forEach(plugins, function (plugin) {
                    if (pluginOptions[plugin.name] === undefined) {
                        pluginOptions[plugin.name] = plugin;
                        var value = opts[plugin.name];
                        opts[plugin.name] = plugin.defaults;
                        plugin.extend(opts, value);
                    }
                });
            }
            return opts;
        };

        // Copy this options object and return a new options object
        // with the same values apart from the one specified in ``o``.
        opts.copy = function (o) {
            if (o && isFunction(o.pluginOptions))
                return o;
            else
                return initOptions(extend({}, opts), extend({}, pluginOptions)).extend(o);
        };

        opts.clear = function () {
            forEach(pluginOptions, function (plugin) {
                plugin.clear(opts[plugin.name]);
            });
        };

        opts.selectTheme = function (theme) {
            var ctheme = g.themes[theme],
                obj;
            forEach(ctheme, function (o, key) {
                obj = opts[key];
                if (obj)
                    forEach(o, function (value, name) {
                        obj[name] = value;
                    });
            });
        };

        return opts;
    }
