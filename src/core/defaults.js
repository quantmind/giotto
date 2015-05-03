    //
    //  Defaults for Papers, Groups, Drawings and Visualizations

    g.defaults = {};

    g.defaults.paper = {
        type: 'svg',
        resizeDelay: 200,
        resize: true,
        interact: true,
        css: null
    };

    g.constants = {
        DEFAULT_VIZ_GROUP: 'default_viz_group',
        WIDTH: 400,
        HEIGHT: 300,
        vizevents: ['data', 'change', 'start', 'tick', 'end'],
        pointEvents: ["mouseenter", "mousemove", "touchstart", "touchmove", "mouseleave", "mouseout"],
        //
        // Events a giotto group can fire, added by pluigins
        groupEvents: [],
        //
        // leaflet url
        leaflet: 'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css'
    };
