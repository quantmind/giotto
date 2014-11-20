    //
    g.viz = {};
    //
    // Factory of Giotto visualizations
    g.createviz = function (name, defaults, constructor) {

        var vizType = function (element, opts) {

            if (isObject(element)) {
                opts = element;
                element = null;
            }
            opts = extend({}, g.defaults.viz, g.defaults.paper, defaults, opts);

            var viz = {},
                uid = ++_idCounter,
                event = d3.dispatch.apply(d3, opts.events),
                alpha = 0,
                paper;

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

            // This could be re-implemented by the constructor
            viz.start = function () {
                return viz.resume();
            };

            viz.refresh = function () {
                if (paper && paper.type() === 'canvas')
                    this.start();
                return viz;
            };

            d3.rebind(viz, event, 'on');

            if (constructor)
                constructor(viz, opts);

            return viz;
        };

        g.viz[name] = vizType;

        vizType.vizName = function () {
            return name;
        };

        return vizType;
    };
