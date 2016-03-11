import {giottoId} from '../utils/dom';
import {dispatch} from 'd3-dispatch';
import {extend, isObject} from 'd3-quant';
import {default as noop} from '../utils/noop';
import {default as logger} from '../utils/log';

let scope = function () {
    return new Scope();
};

export default function (_) {
    if (arguments.length === 0) return scope;
    scope = _;
}

export const prefix = "$";

/**
 * A Scope class
 *
 * Design hints from angular js
 */
export class Scope {

    constructor () {
        this.$id = giottoId();
        this.$parent = null;
        this.$root = this;
        this.$logger = logger();
        this.$events = dispatch('draw', 'redraw', 'clear', 'dataBefore', 'data', 'destroy', 'paper');
    }

    $new (isolate, parent) {
        var child;

        parent = parent || this;

        if (isolate) {
            child = new Scope();
            child.$root = this.$root;
        } else {
            // Only create a child scope class if somebody asks for one,
            // but cache it to allow the VM to optimize lookups.
            if (!this.$$ChildScope)
                this.$$ChildScope = createChildScopeClass(this);

            child = new this.$$ChildScope();
        }
        child.$parent = parent;
        if (isolate || parent != this)
            child.$on('destroy', destroyChildScope);

        return child;
    }

    /**
     * Extend this scope with another object
     * @param obj
     */
    $extend (obj) {
        if (!obj || this === obj) return this;
        var self = this;

        if (obj.each)
            obj.each(function (value, key) {
                _extend(self, value, key);
            });
        else if (isObject(obj))
            for (var key in obj)
                if (obj.hasOwnProperty(key))
                    _extend(self, obj[key], key);

        return this;
    }

    $destroy () {
        // We can't destroy a scope that has been already destroyed.
        if (this.$$destroyed) return;
        // var parent = this.$parent;

        this.$broadcast('destroy');
        this.$$destroyed = true;
        this.$destroy = noop;
        this.$on = function() { return noop; };
    }

    $broadcast (name) {
        var args = Array.prototype.slice.call(arguments);
        args[0] = new Event(name, this);
        this.$events.apply(name, null, args);
        return this;
    }

    $on (name, listener) {
        this.$events.on(name, listener);
        return this;
    }
}


class Event {

    constructor (name, scope) {
        this.name = name;
        this.$currentScope = scope;
        this.defaultPrevented = false;
    }

    preventDefault (value) {
        if (arguments.length === 0) value = true;
        this.defaultPrevented = value;
    }

    get current () {
        return this.$currentScope.$self;
    }

    get giotto () {
        return this.$currentScope.$root.$self;
    }
}


function createChildScopeClass(parent) {

    function ChildScope() {
        this.$$watchers = this.$$nextSibling =
            this.$$childHead = this.$$childTail = null;
        this.$id = giottoId();
        this.$$ChildScope = null;
    }

    ChildScope.prototype = parent;

    return ChildScope;
}


function destroyChildScope($event) {
    $event.currentScope.$$destroyed = true;
}


function _extend (self, value, key) {
    var current = self[key];

    if (key[0] === prefix || current === value) return;

    if (isObject(value))
        if (isObject(current))
            extend(true, current, value);
        else
            self[key] = extend(true, {}, value);
    else
        self[key] = value;
}
