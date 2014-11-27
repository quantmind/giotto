    //
    g.viz = {};
    //
    // Factory of Giotto visualization factories
    //  name: name of the visualization constructor, the constructor is
    //        accessed via the giotto.viz object
    //  defaults: object of default parameters
    //  constructor: function called back with a visualization object
    //               and an object containing options for the visualization
    //  returns a functyion which create visualization of the ``name`` family
    g.createviz = function (name, defaults, constructor) {

        // The visualization factory
        var plugins = [],
            vizType = function (element, opts) {

            if (isObject(element)) {
                opts = element;
                element = null;
            }
            opts = extend({}, g.defaults.viz, g.defaults.paper, defaults, opts);

            var viz = {},
                uid = ++_idCounter,
                event = d3.dispatch.apply(d3, opts.events),
                alpha = 0,
                loading_data = false,
                paper;

            opts.event = event;

            viz.uid = function () {
                return uid;
            };

            // Return the visualization type (a function)
            viz.vizType = function () {
                return vizType;
            };

            viz.vizName = function () {
                return vizType.vizName();
            };

            viz.paper = function (createNew) {
                if (createNew || paper === undefined) {
                    if (paper)
                        paper.destroy();

                    paper = g.paper(element, opts);
                    paper.on('refresh', function () {
                        viz.refresh();
                    });
                }
                return paper;
            };

            viz.element = function () {
                return viz.paper().element();
            };

            viz.alpha = function(x) {
                if (!arguments.length) return alpha;

                x = +x;
                if (alpha) { // if we're already running
                    if (x > 0) alpha = x; // we might keep it hot
                    else alpha = 0; // or, next tick will dispatch "end"
                } else if (x > 0) { // otherwise, fire it up!
                    event.start({type: "start", alpha: alpha = x});
                    d3.timer(viz.tick);
                }

                return viz;
            };

            viz.resume = function() {
                return viz.alpha(0.1);
            };

            viz.stop = function() {
                return viz.alpha(0);
            };

            viz.tick = function() {
                // simulated annealing, basically
                if ((alpha *= 0.99) < 0.005) {
                    event.end({type: "end", alpha: alpha = 0});
                    return true;
                }

                event.tick({type: "tick", alpha: alpha});
            };

            // Starts the visualization
            viz.start = function () {
                return viz.resume();
            };

            viz.refresh = function () {
                if (paper && paper.type() === 'canvas')
                    this.start();
                return viz;
            };

            viz.loadData = function (callback) {
                if (opts.src && !loading_data) {
                    loading_data = true;
                    g.log.info('Giotto loading data from ' + opts.src);
                    return d3.json(opts.src, function(error, json) {
                        loading_data = false;
                        if (!error) {
                            viz.setData(json, callback);
                        }
                    });
                }
            };

            //
            // Set new data for the visualization
            viz.setData = function (data, callback) {
                if (opts.processData)
                    data = opts.processData(data);
                if (Object(data) === data && data.data)
                    extend(opts, data);
                else
                    opts.data = data;
                if (callback)
                    callback();
            };

            // returns the options object
            viz.options = function () {
                return opts;
            };

            d3.rebind(viz, event, 'on');

            if (constructor)
                constructor(viz, opts);

            for (var i=0; i < plugins.length; ++i)
                plugins[i](viz, opts);

            // if the onInit callback available, execute it
            if (opts.onInit) {
                var init = getObject(opts.onInit);
                if (isFunction(init))
                    init(viz);
                else
                    g.log.error('Could not locate onInit function ' + opts.onInit);
            }

            return viz;
        };

        g.viz[name] = vizType;

        vizType.vizName = function () {
            return name;
        };

        vizType.plugin = function (callback) {
            plugins.push(callback);
        };

        return vizType;
    };
