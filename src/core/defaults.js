import {giottoId} from '../utils/dom';
import {self, forEach, extend} from 'd3-quant';


export var defaults = {
    type: 'canvas',
    resizeDelay: 200,
    resize: true,
    interact: true,
    css: null
};

export const constants = {
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


export function getOptions (options, defaults, plugins) {
    options = extend({}, defaults, options);
    forEach(plugins, (value, key) => {
        options[key] = extend({}, value, options[key]);
    });
    return options;
}


export class GiottoBase {

    constructor (options) {
        self.set(this, {
            id: giottoId(),
            options: options
        });
    }

    get options () {
        return self.get(this).options;
    }

    get id () {
        return self.get(this).id;
    }

    /**
     * Set or get data for the paper
     *
     * getting data is relatively straightforward and does not produce any
     * side effets. Setting data causes the object to do a complete re-draw
     * by firing the ``on_data`` event
     *
     * @param _
     * @returns {*}
     */
    data (_) {
        if (arguments.length === 0) return self.get(this).data;
        self.get(this).data = _;
        this.fire('on_data');
    }

    fire () {

    }
}
