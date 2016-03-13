import {map} from 'd3-collection';
import {GiottoBase} from './defaults';
import * as d3 from 'd3-scale';


export var rangeFunctions = map();


var scaleDefaults = {
    x: {nice: true, range: 'width'},
    y: {nice: true, range: 'height'},
    r: {nice: true, range: 'radius'},
    color: {type: 'quantize', range: 'scaleCategory10'}
};

var scales = {
    linear: d3.scaleLinear,
    pow: d3.scalePow,
    sqrt: d3.scaleSqrt,
    log: d3.scaleLog,
    time: d3.scaleTime
};

/**
 * Create a new scale for a paper
 * @param paper object
 * @param name of the scale (x, y, r, color, x2, etc...)
 * @param opts options for this scale
 * @returns {Scale}
 */
export default function (paper, name, opts) {
    var scope = paper.$scope.$new();
    scope.extend(scaleDefaults[name]).extend(opts);
    var type = scope.type || 'linear',
        scaleFunction = scales[type];
    if (!scaleFunction)
        throw Error('No such scale "' + type + '"');
    return new Scale(scope);
}


/**
 * A wrapper for d3 scales
 */
class Scale extends GiottoBase {

    scale () {
        var scope = this.$scope,
            scale = scope.$currentScale,
            type = scope.$currentScaleType,
            data = this.data;

        if (!scale || scope.type !== type) {
            type = scope.type || 'linear';
            var scaleFunction = scales[type];
            if (!scaleFunction)
                throw Error('No such scale "' + type + '"');
            scale = scaleFunction();
            scope.$currentScale = scale;
            scope.$currentScaleType = scope.type = type;
        }

        // range information
        var range = rangeFunctions.get(scope.range);
        if (range) scale.range(range(this.parent));

        // domain information
        var domain = scope.domain;
        if (domain)
            domain = domain.split('.');

        var serie = data.get(domain[0]);
        if (!serie) serie = data.get();
        if (serie) {
            scale.domain(serie);
            if (scope.nice) scale.nice();
        }
        return scale;
    }
}


rangeFunctions.set('width', function (paper) {
    return [0, paper.width];
});

rangeFunctions.set('-width', function (paper) {
    return [paper.width, 0];
});

rangeFunctions.set('height', function (paper) {
    return [paper.height, 0];
});

rangeFunctions.set('-height', function (paper) {
    return [0, paper.height];
});
