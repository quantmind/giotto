import {isObject, isFunction, extend} from 'd3-quant';
import {GiottoBase} from './defaults';
import {Canvas} from './canvas';
import {Svg} from './svg';
import {data} from '../data/index';
import {popKey} from '../utils/object';
import {default as contextMenuProvider} from '../utils/menu';

/**
 * Giotto class
 *
 * Manage multiple papers objects and coordinate rendering between them
 */
export class Giotto extends GiottoBase {

    constructor (options) {
        super(null, null);
        var scope = this.$scope;
        scope.$$papers = [];
        scope.$plugins = {};
        scope.$$paperOptions = {};
        scope.$$data = data(scope.$new());
        scope.$contextMenuCallback = contextMenu;
        scope.$contextMenu = contextMenuProvider()(function (element) {
            return scope.$contextMenuCallback(element);
        });
        if (!scope.$defaultPaperType)
            scope.$defaultPaperType = 'canvas';
        this.scope(options);
    }

    /**
     *
     * @returns {Array.<Object>} a copy of the array of papers
     */
    get papers () {
        return this.$scope.$$papers.slice();
    }

    /**
     * Create a new paper for a DOM element
     *
     * @return a new Paper object
     */
    new (element, options) {
        var paper;
        if (arguments.length == 1) {
            if (isObject(element)) {
                options = element;
                element = null;
            }
        }
        var scope = this.$scope,
            opts = null,
            name = options ? options.name : undefined;

        if (name && scope.$$paperOptions[name])
            opts = extend(true, {}, scope.$$paperOptions[name]);

        options = extend(true, {}, opts, options);
        var type = popKey(options, 'type') || scope.$defaultPaperType;

        if (type === 'canvas')
            paper = new Canvas(this, element, options);
        else
            paper = new Svg(this, element, options);

        scope.$$papers.push(paper);
        paper.broadcast('paper');
        return paper;
    }

    /**
     * Get or update scope from JSON
     */
    scope (_) {
        var scope = this.$scope;
        if (arguments.length === 0) return scope;
        //
        var options = extend({}, _);
        var paperOptions = popKey(options, 'papers');
        var data = popKey(options, 'data');
        var type = popKey(options, 'type');
        //
        scope.$extend(_);
        if (type) scope.$defaultPaperType = type;
        scope.$$paperOptions = extend(true, scope.$$paperOptions, paperOptions);
        //
        if (data) this.data.load(data);
        return this;
    }

    /**
     * Apply ``callback`` over all papers
     *
     * @param callback: function accepting the paper as first parameter
     */
    forEach (callback) {
        this.$scope.$$papers.forEach(callback);
    }

    /**
     * Draw into this giotto instance
     */
    draw () {
        this.forEach((paper) => {
            paper.draw();
        });
    }

    clear () {
        this.forEach((paper) => {
            paper.clear();
        });
    }

    refresh () {
        this.forEach((paper) => {
            paper.refresh();
        });
    }
    /**
     * Remove a paper for this container
     *
     * If the paper was in the container, it is removed and the ``refresh``
     * event is triggered
     *
     * @param paper
     * @returns {boolean}
     */
    remove (paper) {
        var papers = this.$scope.$$papers,
            index = papers.indexOf(paper);
        if (index >= 0) {
            papers.splice(index, 0);
            paper.container.remove();
            this.refresh();
            return true;
        }
    }
}

export default function (options) {
    return new Giotto(options);
}


function contextMenu (menu) {
    var scope = this,
        gt = scope.$self,
        items = scope.contextMenu;
    if (!items) return;
    if (items === true) items = [];

    if (!scope.$menuInitialised) {
        //TODO: this is a temporary hack
        scope.$menuInitialised = true;
        items.splice(0, 0, {
            label: function () {
                return 'Convert to ' + convert();
            },
            callback: function () {
                scope.$defaultPaperType = convert();
                gt.redraw();
            }
        });
    }

    menu.selectAll('*').remove();
    menu.append('ul')
        .attr('role', 'menu')
        .classed('dropdown-menu', true)
        .selectAll('li')
        .data(items)
        .enter()
        .append('li')
            .attr('role', 'presentation')
        .append('a')
            .attr('role', 'menuitem').attr('href', '#')
        .text(function (d) {
            return isFunction(d.label) ? d.label() : d.label;
        });
        //.on('click', function (d) {
        //    if (d.callback) d.callback(viz);
        //});
    return true;

    function convert () {
        return scope.$defaultPaperType === 'svg' ? 'canvas' : 'svg';
    }
}
