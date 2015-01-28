    //
    //  Defaults for Papers, Groups, Drawings and Visualizations

    g.defaults = {};

    g.defaults.transition = {
        duration: 0,
        ease: 'easeInOutCubic'
    };

    g.defaults.font = {
        color: '#444',
        size: '11px',
        weight: 'normal',
        lineHeight: 13,
        style: "normal",
        family: "sans-serif",
        variant: "small-caps"
    };

    g.defaults.paper = {
        type: 'svg',
        resizeDelay: 200,
        resize: true,
        interact: true,
        margin: {top: 20, right: 20, bottom: 20, left: 20},
        colors: d3.scale.category10().range(),
        darkerColor: 0,
        brighterColor: 0,
        colorIndex: 0,
        css: null,
        transition : g.defaults.transition,
        font: g.defaults.font
    };

    g.defaults.viz = extend({
        //
        // Optional callback after initialisation
        onInit: null,

        // Rightclick menu
        contextmenu: [{
            label: 'Open Image',
            callback: function (chart) {
                window.open(chart.image());
            }
        }]

    });

    g.constants = {
        DEFAULT_VIZ_GROUP: 'default_viz_group',
        WIDTH: 400,
        HEIGHT: 300,
        vizevents: ['data', 'change', 'start', 'tick', 'end'],
        pointEvents: ["mouseenter", "mousemove", "touchstart", "touchmove", "mouseleave", "mouseout"],
        groupEvents: [],
        leaflet: 'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css'
    };
