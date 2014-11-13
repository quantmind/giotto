    g.vizDefaults = {
        //
        // Default paper type
        paperType: 'svg',
        // Add resizing on window resize
        resize: false,
        // milliseconds to delay the resizing of a visualization
        resizeDelay: 200,
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
    };

    g.paperDefaults = {
        type: 'svg',
        resizeDelay: 200,
        yaxis: 1,
        width: 500,
        height: 400
    };

    g.constants = {
        DEFAULT_VIZ_GROUP: 'default_viz_group'
    };