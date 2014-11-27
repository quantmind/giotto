    g.defaults = {};

    g.defaults.paper = {
        type: 'svg',
        resizeDelay: 200,
        yaxis: 1,
        resize: true,
        margin: {top: 20, right: 20, bottom: 20, left: 20},
    };

    g.defaults.viz = extend({
        //
        // Optional callback after initialisation
        onInit: null,
        //
        // Default events dispatched by the visualization
        events: ['build', 'change', 'start', 'tick', 'end'],
        //
        // Default parameters when drawing lines
        lines: {
            interpolate: 'basis'
        }
    });

    g.constants = {
        DEFAULT_VIZ_GROUP: 'default_viz_group',
        WIDTH: 400,
        HEIGHT: 300
    };