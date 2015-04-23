    //
    // Namespace for all visualizations
    g.viz = {};
    //
    // Plugins for all visualization classes
    registerPlugin(g.viz);
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
        var

        // The vizualization constructor
        vizType = function (element, p) {

            if (isObject(element)) {
                p = element;
                element = null;
            }

            var vizPlugins = extendArray([], g.viz.pluginArray, vizType.pluginArray),
                allPlugins = extendArray([], g.paper.pluginArray, vizPlugins),
                viz = vizMixin({}, allPlugins).options(vizType.defaults).options(p),
                events = d3.dispatch.apply(d3, g.constants.vizevents),
                alpha = 0,
                paper;

            viz.event = function (name) {
                return events[name];
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
                        paper.clear();
                    paper = viz.createPaper();
                }
                return paper;
            };

            viz.createPaper = function () {
                return g.paper(element, viz.options());
            };

            viz.element = function () {
                return viz.paper().element();
            };

            viz.clear = function () {
                viz.paper().clear();
                return viz;
            };

            viz.alpha = function(x) {
                if (!arguments.length) return alpha;

                x = +x;
                if (alpha) { // if we're already running
                    if (x > 0) alpha = x; // we might keep it hot
                    else alpha = 0; // or, next tick will dispatch "end"
                } else if (x > 0) { // otherwise, fire it up!
                    events.start({type: "start", alpha: alpha = x});
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
                    events.end({type: "end", alpha: alpha = 0});
                    return true;
                }
                events.tick({type: "tick", alpha: alpha});
            };

            // Starts the visualization
            viz.start = function () {
                return onInitViz(viz).load(viz.resume);
            };

            // render the visualization by invoking the render method of the paper
            viz.render = function () {
                paper.render();
                return viz;
            };

            viz.image = function () {
                return paper.image();
            };

            d3.rebind(viz, events, 'on');

            // If constructor available, call it first
            if (constructor)
                constructor(viz);

            // Inject plugins
            vizPlugins.forEach(function (plugin) {
                plugin(viz);
            });

            return viz;
        };

        g.viz[name] = vizType;

        vizType.defaults = extend({}, g.defaults.viz, defaults);

        vizType.vizName = function () {
            return name;
        };

        registerPlugin(vizType);

        return vizType;
    };

    g.createviz('viz');

    function onInitViz(viz, init) {
        if (!viz.__init__) {
            viz.__init__ = true;
            if (init) init();

            var opts = viz.options();
            // if the onInit callback available, execute it
            if (opts.onInit) {
                init = getObject(opts.onInit);

                if (isFunction(init))
                    init(viz, opts);
                else
                    g.log.error('Could not locate onInit function ' + opts.onInit);
            }
        }
        return viz;
    }
