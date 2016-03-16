import {isFunction} from 'd3-quant';
import {interpolate} from 'd3-interpolate';
import {map} from 'd3-collection';


var attributes = map();
attributes.set('d', 'd');


class Transition {

    constructor (attr) {
        this.time = 1;
        this.attr = attr;
        this.$value0 = {};
        this.$value1 = {};
        this.interpolator = null;
    }

    update (node, attr, value) {
        //if (logger.debugEnabled()) logger.debug('Updating ' + this.attr + ' @ t = ' + this.time + ' for ' + attr);
        if (this.time !== 1) return false;
        this.$value0[attr] = this.$value1[attr] || value;
        this.$value1[attr] = value;
        this.interpolator = null;
        return true;
    }

    draw (node, t) {
        //if (logger.debugEnabled()) logger.debug('Drawing ' + this.attr + ' @ t = ' + t);
        this.time = t;
        if (this.interpolator === null)
            this.interpolator = interpolate(this.value(this.$value0), this.value(this.$value1));
        return this.interpolator(t);
    }

    value (d) {
        return d;
    }
}


class PathTransition extends Transition {

    update (node, attr, value) {
        if (super.update(node, attr, value)) {
            this.$value0.x = value.x();
            this.$value0.y = value.y();
            this.$value0.data = node.__data__;
            return true;
        }
    }

    draw (node, t) {
        this.time = t;
        var value0 = this.$value0,
            pen = this.$value1.d;

        return pen
            .context(node.context)
            .x(this.accessor(value0.x))
            .y(this.accessor(value0.y))(node.__data__);
    }

    accessor (f) {
        var data = this.$value0.data,
            time = this.time;
        return function (d, i) {
            return time * f(d) + (1 - time) * f(data[i]);
        };
    }
}

PathTransition.test = function (pen) {
    return isFunction(pen.x);
};


var transitions = {
    d: PathTransition
};


export default function (node, attr, value) {
    var transAttr = attributes.get(attr),
        TransitionClass = transitions[transAttr];

    if (!TransitionClass || !TransitionClass.test(value)) {
        node.attrs.set(attr, value);
    } else {
        var transition = node.attrs.get(transAttr);

        if (!transition) {
            transition = new TransitionClass(attr);
            node.attrs.set(transAttr, transition);
        }

        transition.update(node, attr, value);
    }
}
