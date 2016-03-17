import {Plugin} from '../core/plugin';
import {extend} from 'd3-quant';
import {slugify, slice, identity} from '../utils/index';
import * as d3_path from 'd3-path';

const
    top = 1,
    right = 2,
    bottom = 3,
    left = 4,
    epsilon = 1e-6,
    orient = {
        'top': top,
        'bottom': bottom,
        'right': right,
        'left': left
    },
    horizontal = ['top', 'bottom'],
    vertical = ['left', 'right'],
    axisDefaults = {
        tickSize: '6px',
        outerTickSize: '6px',
        tickPadding: '3px',
        lineWidth: 1,
        textRotate: 0,
        textAnchor: null
    };

/**
 * An Axes is associated with scale on a given paper
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
            if (horizontal.indexOf(location) < 0) location = 'bottom';
        } else if (range.indexOf('height') > -1) {
            if (vertical.indexOf(location) < 0) location = 'left';
        }

        if (!location) throw Error('Could not find location for ' +  this.name);
        var o = orient[location],
            translate;

        if (o === bottom) translate = layer.translate(0, layer.innerHeight);
        else if (o === right) translate = layer.translate(layer.innerWidth, 0);
        else translate = null;

        var ax = axis(orient[location], scale);
        scope.$axis = ax.tickPadding(scope.tickPadding);

        group
            .enter()
                .append('g')
                .classed(selector, true)
                .attr('transform', translate)
                .call(ax)
            .merge(group)
                .attr('transform', translate)
                .selectAll('path')
                    .attr('fill', 'none')
                    .attr('stroke', scope.color)
                    .attr('stroke-width', layer.dim(scope.lineWidth));

        group.transition(update).call(ax);
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


function translateX(scale0, scale1, d) {
    var x = scale0(d);
    return "translate(" + (isFinite(x) ? x : scale1(d)) + ",0)";
}

function translateY(scale0, scale1, d) {
    var y = scale0(d);
    return "translate(0," + (isFinite(y) ? y : scale1(d)) + ")";
}

function center(scale) {
    var width = scale.bandwidth() / 2;
    return function(d) {
        return scale(d) + width;
    };
}


function axis(orient, scale) {
    var tickArguments = [],
        tickValues = null,
        tickFormat = null,
        tickSizeInner = 6,
        tickSizeOuter = 6,
        tickPadding = 3,
        context = null;

    function axis(context) {
        var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
            format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity) : tickFormat,
            spacing = Math.max(tickSizeInner, 0) + tickPadding,
            transform = orient === top || orient === bottom ? translateX : translateY,
            range = scale.range(),
            range0 = range[0],
            range1 = range[range.length - 1],
            position = (scale.bandwidth ? center : identity)(scale.copy()),
            selection = context.selection ? context.selection() : context,
            path = selection.selectAll(".domain").data([null]),
            tick = selection.selectAll(".tick").data(values, scale).order(),
            tickExit = tick.exit(),
            tickEnter = tick.enter().append("g", ".domain").attr("class", "tick"),
            line = tick.select("line"),
            text = tick.select("text"),
            pen = d3_path.path();

        path = path.merge(path.enter().append("path").attr("class", "domain"));
        tick = tick.merge(tickEnter);
        line = line.merge(tickEnter.append("line"));
        text = text.merge(tickEnter.append("text"));

        if (context !== selection) {
            path = path.transition(context);
            tick = tick.transition(context);
            tickExit = tickExit.transition(context).style("opacity", epsilon).attr("transform", function(d) { return transform(position, this.parentNode.__axis || position, d); });
            tickEnter.style("opacity", epsilon).attr("transform", function(d) { return transform(this.parentNode.__axis || position, position, d); });
            line = line.transition(context);
            text = text.transition(context);
        }

        tick.style("opacity", 1).attr("transform", function(d) { return transform(position, position, d); });
        tickExit.remove();
        text.text(format);

        switch (orient) {
            case top: {
                path.attr("d", "M" + range0 + "," + -tickSizeOuter + "V0H" + range1 + "V" + -tickSizeOuter);
                line.attr("x2", 0).attr("y2", -tickSizeInner);
                text.attr("x", 0).attr("y", -spacing).attr("dy", "0em").style("text-anchor", "middle");
                break;
            }
            case right: {
                path.attr("d", "M" + tickSizeOuter + "," + range0 + "H0V" + range1 + "H" + tickSizeOuter);
                line.attr("y2", 0).attr("x2", tickSizeInner);
                text.attr("y", 0).attr("x", spacing).attr("dy", ".32em").style("text-anchor", "start");
                break;
            }
            case bottom: {
                path.attr("d", "M" + range0 + "," + tickSizeOuter + "V0H" + range1 + "V" + tickSizeOuter);
                line.attr("x2", 0).attr("y2", tickSizeInner);
                text.attr("x", 0).attr("y", spacing).attr("dy", ".71em").style("text-anchor", "middle");
                break;
            }
            case left: {
                path.attr("d", "M" + -tickSizeOuter + "," + range0 + "H0V" + range1 + "H" + -tickSizeOuter);
                line.attr("y2", 0).attr("x2", -tickSizeInner);
                text.attr("y", 0).attr("x", -spacing).attr("dy", ".32em").style("text-anchor", "end");
                break;
            }
        }

        selection.each(function() { this.__axis = position; });
        return pen;
    }

    axis.scale = function(_) {
        return arguments.length ? (scale = _, axis) : scale;
    };

    axis.ticks = function() {
        return tickArguments = slice.call(arguments), axis;
    };

    axis.tickArguments = function(_) {
        return arguments.length ? (tickArguments = _ == null ? [] : slice.call(_), axis) : tickArguments.slice();
    };

    axis.tickValues = function(_) {
        return arguments.length ? (tickValues = _ == null ? null : slice.call(_), axis) : tickValues && tickValues.slice();
    };

    axis.tickFormat = function(_) {
        return arguments.length ? (tickFormat = _, axis) : tickFormat;
    };

    axis.tickSize = function(_) {
        return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
    };

    axis.tickSizeInner = function(_) {
        return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
    };

    axis.tickSizeOuter = function(_) {
        return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
    };

    axis.tickPadding = function(_) {
        return arguments.length ? (tickPadding = +_, axis) : tickPadding;
    };

    axis.context = function(_) {
        return arguments.length ? (context = _ == null ? null : _, axis) : context;
    };

    return axis;
}
