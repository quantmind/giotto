import {giottoId} from '../utils/dom';
import {self} from 'd3-quant';


export var defaults = {
    type: 'canvas',
    resizeDelay: 200,
    resize: true,
    interact: true
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


export class GiottoBase {

    constructor (options) {
        self.set(this, {
            id: giottoId(),
            options: options
        });
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
