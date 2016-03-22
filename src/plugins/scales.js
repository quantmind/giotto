import {Plugin} from '../core/plugin';
import {map} from 'd3-collection';
import {isNumber, isString} from 'd3-quant';
import {capfirst} from '../utils/index';
import {evalString} from '../data/index';
import * as d3 from 'd3-scale';


/**
 * A Scale is associated with a given paper
 */
class Scale extends Plugin {

    constructor (paper, value, defaults) {
        super(paper, value || {}, defaults);
    }

    scale () {
        var scope = this.$scope,
            scale = scope.$currentScale,
            type = scope.$currentScaleType;

        if (!scale || scope.type !== type) {
            type = scope.type || 'linear';
            var scaleFunction = d3['scale' + capfirst(type)];
            if (!scaleFunction)
                throw Error('No such scale "' + type + '"');
            scale = scaleFunction();
            scope.$currentScale = scale;
            scope.$currentScaleType = scope.type = type;
        }

        // range information
        var range = rangeFunctions.get(scope.range);
        if (range) scale.range(range(this.paper));
        else scale.range(evalString(scope.range));

        // domain information
        var domain = this.domain();
        if (domain) {
            scale.domain(domain);
            if (scope.nice) scale.nice();
        }

        return scale;
    }

    domain () {
        var scope = this.$scope,
            domain = scope.domain;
        if (isString(domain)) domain = {from: domain};
        else if (!domain) domain = {};
        scope.domain = domain;

        if (isNumber(scope.domain.min) && isNumber(scope.domain.max))
            return [scope.domain.min, scope.domain.max];

        let bits, name, field, serie;
        const scaleName = this.name.split('.')[1];

        domain = null;
        if (scope.domain.from) bits = scope.domain.from.split('.');
        else bits = [''];
        if (bits.length > 1) {
            name = bits.slice(0, bits.length-1).join('.');
            field = bits[bits.length-1];
        } else
            name = bits[0];

        // No serie name, pick the serie from the first draw of the paper
        if (!name) {
            var draws = this.paper.draws;

            for (let i=0; i<draws.length; ++i) {
                var draw = draws[i],
                    series = draw.getSeries() || [],
                    fieldName = field || draw.$scope[scaleName] || scaleName;
                for (let j=0; j<series.length; ++j) {
                    if (series[j].hasField(fieldName)) {
                        serie = series[j];
                        field = fieldName;
                        break;
                    }
                }
                if (serie) break;
            }
        }

        if (!serie) serie = this.data.getOne(name);
        //
        if (serie) {
            if (!field) field = this.$scope[scaleName] || scaleName;
            if (scope.$currentScaleType === 'time') serie.timeField(field);
            domain = serie.range(field);
            if (isNumber(scope.domain.min)) domain[0] = scope.domain.min;
            else if (isNumber(scope.domain.max)) domain[0] = scope.domain.max;
            scope.$from = serie.name + '.' + field;
        }

        return domain;
    }
}

export var rangeFunctions = map();



Plugin.register(Scale, true, {
    name: 'scales.x',
    nice: true,
    range: 'width'
});

Plugin.register(Scale, false, {
    name: 'scales.x2',
    nice: true,
    range: 'width'
});

Plugin.register(Scale, true, {
    name: 'scales.y',
    nice: true,
    range: 'height'
});

Plugin.register(Scale, false, {
    name: 'scales.y2',
    nice: true,
    range: 'height'
});

Plugin.register(Scale, true, {
    name: 'scales.r',
    nice: true,
    range: 'radius',
    domain: {
        min: 0,
        max: 1
    }
});

Plugin.register(Scale, true, {
    name: 'scales.color',
    type: 'quantize',
    range: 'category10'
});


rangeFunctions.set('width', function (paper) {
    return [0, paper.innerWidth];
});

rangeFunctions.set('-width', function (paper) {
    return [paper.innerWidth, 0];
});

rangeFunctions.set('height', function (paper) {
    return [paper.innerHeight, 0];
});

rangeFunctions.set('-height', function (paper) {
    return [0, paper.innerHeight];
});

rangeFunctions.set('radius', function (paper) {
    var radius = 0.5*Math.min(paper.innerHeight, paper.innerWidth);
    return [0, radius];
});

rangeFunctions.set('category10', function () {
    return d3.scaleCategory10();
});

rangeFunctions.set('category20', function () {
    return d3.scaleCategory20();
});

rangeFunctions.set('category20b', function () {
    return d3.scaleCategory20b();
});

rangeFunctions.set('category20c', function () {
    return d3.scaleCategory20c();
});

