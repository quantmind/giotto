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
            interpolate: 'basis',
            width: 2
        },
        point: {
            symbol: 'circle',
            size: 8,
            fill: true,
            fillOpacity: 0.5,
            width: 1
        },
        bar: {
            width: 'auto',
            stroke: 'none',
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