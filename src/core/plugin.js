import {map} from 'd3-collection';
import {GiottoBase} from './defaults';
import {prefix} from './scope';
import {popKey} from '../utils/object';

/**
 * Base class for Plugins
 */
export class Plugin extends GiottoBase {

    constructor (parent, opts, root) {
        var scope = GiottoBase.scope(root.$new(), parent, opts)
        super(scope.$new());
        this.$scope.$active = opts ? true : false;
    }

    get paper () {
        return this.parent;
    }

    get active () {
        return this.$scope.$active;
    }

    draw () {}
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
    var name = Class.name.toLowerCase();
    Class.$active = active;
    Class.$defaults = pluginDefaults;
    Plugin.$plugins.set(name, Class);
};


Plugin.$apply = function (paper) {
    var scope = paper.$scope;

    Plugin.$plugins.each( (Class, name) => {

        var opts = scope[name] || Class.$active,
            $name = prefix + name,
            root = _parentScope(scope.$root, name, Class.$defaults);

        if (opts === true) opts = {};

        var plugin = new Class(paper, opts, root);

        scope[$name] = plugin;
        scope.$plugins.set(name, plugin);
    });
};


export function _parentScope(scope, name, defaults) {
    var $name = prefix + name;
    var parentScope = scope[$name];
    //
    // parent scope not available
    if (!parentScope) {
        if (scope.$parent && scope.$parent !== scope) {
            parentScope = _parentScope(scope.$parent, name, defaults).$new();
            parentScope = GiottoBase.scope(parentScope, scope.$self);
        }
        else
            parentScope = GiottoBase.scope(scope.$new(), scope.$self, defaults);
        scope[$name] = parentScope.$extend(popKey(scope, name));
    }
    return parentScope;
}
