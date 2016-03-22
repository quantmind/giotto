import {map} from 'd3-collection';
import {PaperBase, model} from './defaults';
import {prefix} from './scope';
import {popKey} from '../utils/object';
import {isObject} from 'd3-quant';

/**
 * Base class for Plugins
 */
export class Plugin extends PaperBase {

    constructor (parent, opts, scope) {
        scope = scope.$new().$extend(opts);
        super(scope);
        this.$scope.$self = parent;
        this.$scope.$$paper = parent;
        this.$scope.$active = opts ? true : false;
        this.$scope.$extend(parent.$scope);
    }

    get active () {
        return this.$scope.$active;
    }
}

// Optional paper plugins
Plugin.$plugins = map();


/**
 * Register a Plugin class to the Paper prototype
 *
 * @param Class: Plugin class
 * @param active: if true the plugin is active by default and to switch it off one must set the plugin name to false.
 * @param pluginDefaults: optional defaults
 */
Plugin.register = function (Class, active, pluginDefaults) {
    var name = popKey(pluginDefaults, 'name');
    if(!name) name = Class.name;
    name = name.toLowerCase();
    Plugin.$plugins.set(name, {
        Class: Class,
        active: active,
        defaults: pluginDefaults
    });
};


Plugin.$apply = function (paper) {
    var scope = paper.$scope;

    Plugin.$plugins.each( (p, name) => {

        var bits = name.split('.'),
            namespace = bits[0],
            $namespace = prefix + namespace,
            opts = scope[namespace],
            root = _parentScope(p.Class, scope.$root, namespace, bits[1], p.defaults);

        name = bits[1];
        if (name && isObject(opts)) opts = opts[name];
        if (opts === undefined) opts = p.active;
        if (opts === true) opts = {};

        var plugin = new p.Class(paper, opts, root);

        if (name) {
            if (!scope[$namespace]) scope[$namespace] = map();
            scope[$namespace].set(name, plugin);
        }
        else scope[$namespace] = plugin;

        scope.$plugins.push(plugin);
    });
};


export function _parentScope(Class, scope, namespace, name, defaults) {
    var container = scope.$isolated[namespace],
        parentScope, opts;

    if (name) {
        if (!container) scope.$isolated[namespace] = container = map();
        parentScope = container.get(name);
    }
    else
        parentScope = container;

    //
    // parent scope not available
    if (!parentScope) {
        if (scope.$parent && scope.$parent !== scope) {
            parentScope = _parentScope(Class, scope.$parent, namespace, name, defaults);
            parentScope = model(parentScope, scope);
        }
        else {
            parentScope = scope.$new().$extend(defaults);
            parentScope.$name = name ? namespace + '.' + name : namespace;
            opts = scope[namespace];
            var key = namespace;
            if (name && opts) {
                key = name;
                opts = opts[name];
            }
            if (isObject(opts)) Class.$extendScope(parentScope, popKey(opts, key));
        }

        if (name)
            container.set(name, parentScope);
        else
            scope.$isolated[namespace] = parentScope;
    }
    return parentScope;
}
