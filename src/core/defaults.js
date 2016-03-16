import {default as scopeFactory} from './scope';

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


export function model(parentScope, sibling) {
    var scope = parentScope.$new();
    if (sibling) {
        scope.$self = sibling.$self;
        scope.$$paper = sibling.$$paper;
    }
    return scope;
}


export class GiottoBase {

    constructor (scope) {
        if (!scope) scope = scopeFactory()();
        this.$scope = scope;
        this.$scope.$self = this;
    }

    get id () {
        return this.$scope.$id;
    }

    get name () {
        return this.$scope.$name || this.id;
    }

    /**
     * Return the data object
     * @returns {*}
     */
    get data () {
        return this.$scope.$root.$$data;
    }

    /**
     * Return the paper object which own this object
     * @returns {*}
     */
    get paper () {
        return this.$scope.$$paper;
    }

    get parent () {
        var parent = this.$scope.$parent;
        return parent ? parent.$self : null;
    }

    get root () {
        return this.$scope.$root.$self;
    }

    get logger () {
        return this.$scope.$logger;
    }
    /**
     * Set or return the options for this giotto object
     */
    scope (_) {
        if (arguments.length === 0) return this.$scope;
        this.$scope.$extend(_);
        return this;
    }

    broadcast () {
        this.$scope.$broadcast.apply(this.$scope, arguments);
        return this;
    }

    on () {
        return this.$scope.$on.apply(this.$scope, arguments);
    }

    draw () {}

    destroy () {
        this.$scope.$destroy();
    }
}
