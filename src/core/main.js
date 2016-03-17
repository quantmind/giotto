import {isObject, isFunction, extend} from 'd3-quant';
import {map} from 'd3-collection';
import {GiottoBase, giottoDefaults} from './defaults';
import {Canvas} from './canvas';
import {Svg} from './svg';
import {data} from '../data/index';
import {popKey} from '../utils/object';
import {default as contextMenuProvider} from '../utils/menu';

export var all = map();


/**
 * Giotto class
 *
 * Manage multiple papers objects and coordinate rendering between them
 */
export class Giotto extends GiottoBase {

    constructor (options) {
        super();
        var scope = this.$scope;
        scope.$isolated.papers = [];
        scope.$isolated.paperOptions = {};
        scope.$$data = data(scope.$new());
        if (!scope.$defaultPaperType)
            scope.$defaultPaperType = 'canvas';
        this.scope(giottoDefaults(options)).scope(options);
        contextMenu.init(scope);
        all.set(this.id, this);
    }
    /**
     *
     * @returns {Array.<Object>} a copy of the array of papers
     */
    get papers () {
        return this.$scope.$isolated.papers.slice();
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

        if (name && scope.$isolated.paperOptions[name])
            opts = extend(true, {}, scope.$isolated.paperOptions[name]);

        options = extend(true, {}, opts, options);
        var type = popKey(options, 'type') || scope.$defaultPaperType;

        if (type === 'canvas')
            paper = new Canvas(this, element, options);
        else
            paper = new Svg(this, element, options);

        scope.$isolated.papers.push(paper);
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
        scope.papers = extend(true, scope.$isolated.paperOptions, paperOptions);
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
        this.$scope.$isolated.papers.forEach(callback);
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

    destroy () {
        all.remove(this.id);
        super.destroy();
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
        var papers = this.$scope.$isolated.papers,
            index = papers.indexOf(paper);
        if (index >= 0) {
            papers.splice(index, 1);
            paper.destroy();
            return paper.element.node();
        }
    }

    /**
     * Remove all papers from this container
     *
     * @returns {Array} of DOM element which contained the removed papers
     */
    removeAll () {
        var elements = [],
            element,
            paper;
        this.logger.info('Remove all papers from ' + this.name + ' container');
        while (paper = this.$scope.$isolated.papers[0]) {
            element = this.remove(paper);
            if (element) elements.push(element);
        }
        return elements;
    }
}

export default function (options) {
    return new Giotto(options);
}


function contextMenu (menu) {
    var scope = this,
        items = this.contextMenu;
    if (!items) return;

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
            return isFunction(d.label) ? d.label.call(scope) : d.label;
        })
        .on('click', function (d) {
            if (d.callback) d.callback.call(scope);
        });
    return true;
}


contextMenu.init = function (scope) {
    var items = scope.contextMenu;
    if (!items) return;

    if (scope.contextMenuRender === undefined)
        scope.contextMenuRender = contextMenu;

    scope.$contextMenu = contextMenuProvider()(function (element) {
        if (scope.contextMenuRender)
            return scope.contextMenuRender(element);
    });

    if (items === true) items = [];
    var gt = scope.$self;

    scope.contextMenu = items;

    items.splice(0, 0, {
        label: function () {
            return 'Convert to ' + convert();
        },
        callback: function () {
            scope.$defaultPaperType = convert();
            gt.removeAll().forEach(function (element) {
                gt.new(element);
            });
            gt.draw();
        }
    });

    function convert () {
        return scope.$defaultPaperType === 'svg' ? 'canvas' : 'svg';
    }
};
