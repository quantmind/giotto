import {isObject, extend} from 'd3-quant';
import {GiottoBase} from './defaults';
import {Canvas} from './canvas';
import {Svg} from './svg';
import {data} from '../data/index';
import {popKey} from '../utils/object';

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
        //
        scope.$extend(_);
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
