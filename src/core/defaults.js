    g.defaults = {};

    g.defaults.axis = {
        color: '#000',
        tickSize: 0.05,
        minTickSize: null,
        min: null,
        max: null
    };

    g.defaults.paper = {
        type: 'svg',
        resizeDelay: 200,
        resize: true,
        margin: {top: 20, right: 20, bottom: 20, left: 20},
        xaxis: extend({position: 'bottom'}, g.defaults.axis),
        yaxis: extend({position: 'left'}, g.defaults.axis),
        yaxis2: extend({position: 'right'}, g.defaults.axis),
        colors: d3.scale.category10().range(),
        css: null,
        line: {
            interpolate: 'cardinal',
            fill: false,
            lineWidth: 2
        },
        point: {
            symbol: 'circle',
            size: '8px',
            fill: true,
            fillOpacity: 1,
            lineWidth: 2
        },
        bar: {
            width: 'auto',
            color: null,
            fill: true,
            lineWidth: 2,
            // Radius in pixels of rounded corners. Set to 0 for no rounded corners
            radius: 4
        },
        font: {
            size: 11,
            weight: 'bold',
            lineHeight: 13,
            style: "italic",
            family: "sans-serif",
            variant: "small-caps"
        }
    };

    g.defaults.viz = extend({
        //
        // Optional callback after initialisation
        onInit: null,
        //
        // Default events dispatched by the visualization
        events: ['build', 'change', 'start', 'tick', 'end'],
    });

    g.constants = {
        DEFAULT_VIZ_GROUP: 'default_viz_group',
        WIDTH: 400,
        HEIGHT: 300,
        leaflet: 'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css'
    };