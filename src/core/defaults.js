import {default as scopeFactory} from './scope';
import {map} from 'd3-collection';
import {round, isFunction, isString, constantValue} from 'd3-quant';


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


export var themeDefaults = map();

themeDefaults.set('default', {
    color: '#000',
    fill: '#fff'
});

themeDefaults.set('dark', {
    color: '#fff',
    fill: '#000'
});


export function giottoDefaults(opts) {
    var theme = null;
    if (opts) theme = opts.theme;
    return themeDefaults.get(theme || '') || themeDefaults.get('default');
}


export function model(parentScope, sibling) {
    var scope = parentScope.$new();
    if (sibling) {
        scope.$self = sibling.$self;
        scope.$$paper = sibling.$$paper;
        scope.$extend(sibling);
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


export class PaperBase extends GiottoBase {
    /**
     * Return the paper object which own this object
     * @returns {*}
     */
    get paper () {
        return this.$scope.$$paper;
    }

    get marginLeft () {
        var scope = this.paper.$scope;
        return pc(scope.$margin.left, scope.$size[0]);
    }

    get marginRight () {
        var scope = this.paper.$scope;
        return pc(scope.$margin.right, scope.$size[0]);
    }

    get marginTop () {
        var scope = this.paper.$scope;
        return pc(scope.$margin.top, scope.$size[1]);
    }

    get marginBottom () {
        var scope = this.paper.$scope;
        return pc(scope.$margin.bottom, scope.$size[1]);
    }

    get domWidth () {
        return this.width;
    }

    get domHeight () {
        return this.height;
    }

    get size () {
        var scope = this.paper.$scope;
        return scope.$size.slice();
    }

    get width () {
        return this.paper.$scope.$size[0];
    }

    get height () {
        return this.paper.$scope.$size[1]
    }

    get innerWidth () {
        return this.width - this.marginLeft - this.marginRight;
    }

    get innerHeight () {
        return this.height - this.marginTop - this.marginBottom;
    }

    get aspectRatio () {
        return this.innerHeight/this.innerWidth;
    }

    scale (name) {
        var scale = this.paper.$scope.$scales.get(name);
        if (!scale) throw Error('No such scale ' + name);
        return scale.scale();
    }

    axis (name) {
        return this.paper.$scope.$axes.get(name);
    }

    scaled (value, scale) {
        if (!isFunction(scale)) scale = this.scale(scale);
        if (isFunction(value))
            return function (d) {
                return scale(value(d));
            };
        else
            return scale(value);
    }

    translate (x, y) {
        var xf = isFunction(x),
            yf = isFunction(y);
        if (xf || yf) {
            var self = this;
            if (!xf) x = constantValue(x);
            else if (!yf) y = constantValue(y);
            return function (d) {
                return self._translate(x(d), y(d));
            };
        } else {
            return this._translate(x, y);
        }
    }

    _translate (x, y) {
        return "translate(" + x + "," + y + ")";
    }
}


function pc (margin, size) {
    if (isString(margin) && margin.indexOf('%') === margin.length-1)
        margin = round(0.01*parseFloat(margin)*size, 5);
    return margin;
}


PaperBase.$extendScope = function (scope, value) {
    scope.$extend(value);
};
