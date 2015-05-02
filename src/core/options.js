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

        options: function (opts, deep) {
            var name = this.name,
                defaults = this.defaults;
            opts[name] = extend({}, defaults, opts[name]);
            forEach(deep, function (key) {
                opts[name][key] = extend({}, opts[key], defaults[key], opts[name][key]);
            });
        },

        optionsShow: function (opts, deep) {
            var name = this.name,
                defaults = this.defaults,
                o = opts[name];
            if (o === true) o = {show: true};
            else if (!o) o = {show: false};
            else if (o.show === undefined) o.show = true;
            opts[name] = extend({}, this.defaults, o);
            forEach(deep, function (key) {
                opts[name][key] = extend({}, opts[key], defaults[key], opts[name][key]);
            });
        },

        extend: function (opts, value) {
            extend(opts, value);
        }
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
                        plugin.extend(opts[name], value);
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
                        plugin.options(opts);
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

        return opts;
    }
