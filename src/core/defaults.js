    //
    //  Defaults for Papers, Groups, Drawings and Visualizations

    g.defaults = {};

    g.defaults.axis = {
        tickSize: '6px',
        outerTickSize: '6px',
        tickPadding: '3px',
        lineWidth: 1,
        //minTickSize: undefined,
        min: null,
        max: null
    };

    g.defaults.paper = {
        type: 'svg',
        resizeDelay: 200,
        resize: true,
        margin: {top: 20, right: 20, bottom: 20, left: 20},
        xaxis: extend({position: 'bottom'}, g.defaults.axis),
        yaxis: {position: 'left', min: null, max: null},
        yaxis2: {position: 'right', min: null, max: null},
        colors: d3.scale.category10().range(),
        colorIndex: 0,
        css: null,
        activeEvents: ["mousemove", "touchstart", "touchmove", "mouseout"],
        line: {
            interpolate: 'cardinal',
            fill: 'none',
            fillOpacity: 1,
            colorOpacity: 1,
            lineWidth: 2,
            formatY: ',g3'
        },
        point: {
            symbol: 'circle',
            size: '8px',
            fill: true,
            fillOpacity: 1,
            colorOpacity: 1,
            lineWidth: 2,
            formatY: ',g3',
            active: {
                fill: 'darker',
                color: 'brighter',
                // Multiplier for size, set to 100% for no change
                size: '150%'
            }
        },
        bar: {
            width: 'auto',
            color: null,
            fill: true,
            fillOpacity: 1,
            colorOpacity: 1,
            lineWidth: 2,
            formatY: ',g3',
            // Radius in pixels of rounded corners. Set to 0 for no rounded corners
            radius: 4,
            active: {
                fill: 'darker',
                color: 'brighter'
            }
        },
        pie: {
            lineWidth: 1,
            // pad angle in degrees
            padAngle: 0,
            cornerRadius: 0,
            fillOpacity: 0.7,
            colorOpacity: 1,
            innerRadius: 0,
            startAngle: 0,
            formatY: ',g3',
            active: {
                fill: 'darker',
                color: 'brighter',
                //innerRadius: 100%,
                //outerRadius: 105%,
                fillOpacity: 1
            }
        },
        font: {
            color: '#444',
            size: '11px',
            weight: 'normal',
            lineHeight: 13,
            style: "normal",
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
        leaflet: 'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css'
    };