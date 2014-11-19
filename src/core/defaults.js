    g.defaults = {};

    g.defaults.paper = {
        type: 'svg',
        resizeDelay: 200,
        yaxis: 1,
        resize: false,
        margin: {top: 20, right: 20, bottom: 20, left: 20},
    };

    g.defaults.viz = extend({
        //
        // Option callback after initialisation
        onInit: null,
        //
        autoBuild: true,
        // Events dispatched by the visualization
        events: ['build', 'change'],
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