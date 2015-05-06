
    g.viz.plugin('data', {

        defaults: {
            //
            //  Data source, can be
            //  * Remote url
            //  * A data object/array
            //  * A function returning a url or data
            src: null,
            //
            // Default data loader
            loader: function (src) {
                var loader = d3.json;
                if (src.substring(src.length-4) === '.csv') loader = d3.csv;
                return loader;
            }
        },

        //
        //  Allow to specify a url instead of a data object
        extend: function (opts, value) {
            var name = this.name;
            opts[name] = extend({}, opts[name], isString(value) ? {src: value} : value);
        },

        init: function (viz) {

            var loading_data = false,
                data;

            //
            // Set/Get data for the visualization
            viz.data = function (inpdata, callback) {
                if (!arguments.length) return data;
                opts = viz.options().data;

                if (opts.process)
                    inpdata = opts.process.call(viz, inpdata);

                data = inpdata;

                if (callback) callback();

                viz.fire('data');

                return viz;
            };

            //
            //  Load data for visualization
            viz.load = function (callback) {
                if (loading_data) return;

                opts = viz.options().data;

                var src = opts.src;

                if (isFunction(src)) src = src();

                if (isString(src)) {

                    loading_data = true;
                    g.log.info('Giotto loading data from ' + src);
                    viz.fire('loadstart');

                    return opts.loader()(src, function(error, xd) {

                        loading_data = false;
                        viz.fire('loadend');
                        if (arguments.length === 1) xd = error;
                        else if(error)
                            return g.log.error(error);

                        viz.data(xd, callback);
                    });

                } else if (src) {
                    delete opts.src;
                    viz.data(src, callback);

                } else if (callback) {
                    callback();
                }

                return viz;
            };
        }
    });
