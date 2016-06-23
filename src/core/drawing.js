import {extend, isArray, isFunction,
        isNumber, indexValue, constantValue} from 'd3-quant';
import {PaperBase} from './defaults';
import {Paper} from './paper';
import {evalString} from '../data/index';
import {_parentScope} from './plugin';


const defaultDrawing = {
    color: null,
    fill: null
};

/**
 * Drawing Class
 *
 * base class for all drawings in a Paper
 */
export class Drawing extends PaperBase {

    constructor(scope) {
        super(scope);
        if (!scope.from) scope.from = 'default';
        if (!isArray(scope.from)) scope.from = [scope.from];
    }

    get marks () {
        return this.$scope.marks;
    }

    getSeries () {
        var series = [],
            data = this.data,
            serie;
        this.$scope.from.forEach( function (name) {
            serie = data.get(name);
            if (serie) series.push(serie);
        });
        if (series.length === this.$scope.from.length)
            return series;
    }

    canDraw (layer, series) {
        if (!series || this.broadcast('draw', series).defaultPrevented) return;
        this.logger.info('Drawing ' + this.marks + ' from series ' + concatNames(series));
        var current = this.$scope.$currentSeries;
        this.$scope.$currentSeries = series;
        return current || true;
    }

    draw (layer) {
        if (arguments.length === 0)
            layer = this.paper.drawings;
        this._draw(layer, this.getSeries());
    }

    /**
     * return an accessor function
     *
     * @param key
     * @returns {*}
     */
    accessor (key, fields) {
        key = evalString(key, true);
        if (!isFunction(key)) {
            if (isNumber(key) || (fields && fields.indexOf(key) === -1)) key = constantValue(key);
            else key = indexValue(key);
        }
        return key;
    }

    color (name, serie) {
        var color = this.$scope[name];
        if (color === true) {
            color = this.paper.$scope.$colors.pick();
            this.$scope[name] = color;
        }
        return serie ? this.accessor(color, serie.fields) : color;
    }

    _draw () {}
}


export function paperDraw (Class, defaultOptions) {
    var name = Class.name.toLowerCase();
    defaultOptions = extend({marks: name}, defaultDrawing, defaultOptions);

    Paper.prototype[name] = function (options) {
        // default options from giotto
        var root = _parentScope(Class, this.$scope, name, null, defaultOptions),
            draw = new Class(root.$new().$extend(options));

        // add the draw to paper draws
        this.$scope.$draws.push(draw);
        // return the draw without drawing it
        return draw;
    };

    Paper.prototype[name].defaults = defaultOptions;
}


Drawing.prototype.show = paperBound('show');


export function paperBound (name) {

    return function (_) {
        var d = self.get(this);
        if (arguments.length === 0) return d[name];
        var current = d[name];
        if (_ != current) {
            d[name] = _;
            this.paper.scheduleRedraw();
        }
        return this;
    };
}


function concatNames (array) {
    return array.reduce(_concatNames, '');
}

function _concatNames(a, b) {
    b = '"' + b.name + '"';
    return a ? a + ', ' + b : b;
}
