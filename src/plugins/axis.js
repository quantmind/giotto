import {Plugin} from '../core/plugin';
import {extend} from 'd3-quant';
import {slugify, capfirst} from '../utils/index';
import {evalString} from '../data/index';
import * as d3c from 'd3-canvas-transition';

const
    top = 'top',
    bottom = 'bottom',
    right = 'right',
    left = 'left',
    horizontal = [top, bottom],
    vertical = [left, right],
    axisDefaults = {
        tickSize: 6,
        tickSizeOuter: null,
        tickPadding: 3,
        lineWidth: 1,
        textRotate: 0,
        textAnchor: 'middle',
        colorOpacity: 0.8
    };

/**
 * An Axis is associated with a scale on a given paper
 * Therefore axis.x is associated with scale.x and so forth.
 * The scale controls scaling while the axis control location in the screen
 * (top, bottom, right or left) as well as graphical marks
 */
class Axis extends Plugin {

    draw () {
        var name = this.axisName,
            scope = this.$scope,
            scalePlugin = this.paper.$scope.$scales.get(name),
            range = scalePlugin.$scope.range,
            scale = scalePlugin.scale(),
            location = scope.location,
            layer = this.paper.background,
            update = layer.transition('update'),
            selector = slugify(this.name),
            group = layer.group(this).selectAll('g.' + selector).data([true]);

        if (range.indexOf('width') > -1) {
            if (horizontal.indexOf(location) < 0) location = bottom;
        } else if (range.indexOf('height') > -1) {
            if (vertical.indexOf(location) < 0) location = left;
        }

        if (!location) throw Error('Could not find location for ' +  this.name);
        var translate;

        if (location === bottom)
            translate = layer.translate(0, layer.innerHeight+scope.tickSize);
        else if (location === top)
            translate = layer.translate(0, -scope.tickSize);
        else if (location === left)
            translate = layer.translate(-scope.tickSize, 0);
        else if (location === right) translate = layer.translate(layer.innerWidth, 0);
        else translate = null;

        var ax = d3c['axis'+capfirst(location)](scale);
        scope.$axis = ax.tickPadding(scope.tickPadding).tickSize(-scope.tickSize);
        if (scope.tickSizeOuter) scope.$axis.tickSizeOuter(-scope.tickSizeOuter);

        if (scope.tickFormat) scope.$axis.tickFormat(evalString(scope.tickFormat));

        group = group
            .enter()
                .append('g')
                .classed(selector, true)
                .attr('text-anchor', scope.textAnchor)
                .attr('transform', translate)
                .call(ax)
            .merge(group)
                .attr('transform', translate);

        group.selectAll('line')
                .attr('fill', 'none')
                .attr('stroke', scope.color)
                .attr('stroke-opacity', scope.colorOpacity)
                .attr('stroke-width', layer.dim(scope.lineWidth));

        this.font(group).transition(update).call(ax);
    }

    get axisName () {
        return this.name.split('.')[1];
    }
}


Plugin.register(Axis, false, extend(axisDefaults, {
    name: 'axes.x'
}));


Plugin.register(Axis, false, extend(axisDefaults, {
    name: 'axes.y'
}));
