import {self, isObject, extend} from 'd3-quant';
import {dispatch} from 'd3-dispatch';
import {defaults, GiottoBase} from './defaults';
import {Canvas} from './canvas';
import {Svg} from './svg';
import {rebind} from '../utils/object';

/**
 * Giotto class
 *
 * Manage multiple papers objects and coordinate rendering between them
 */
export class Giotto extends GiottoBase {

    constructor (options) {
        var paperOptions = stripPapers(options);
        super(extend(true, {}, options, defaults));
        var g = self.get(this);
        g.papers = [];
        g.paperOptions = paperOptions || {};
        g.events = dispatch('draw', 'redraw', 'clear', 'dataBefore', 'data');
        rebind(this, g.events, 'on');
    }

    /**
     *
     * @returns {Array.<Object>} a copy of the array of papers
     */
    get papers () {
        return self.get(this).papers.slice();
    }

    /**
     * Set or get data from this instance
     *
     * @param series: when provided it is the serie data
     * @returns this when setting, serie data when getting
     */
    data (series) {
        var gt = self.get(this);
        if (arguments.length === 1) {
            var events = gt.events;
            events.call('dataBefore', this, series);
            gt.data = series;
            gt.papers.forEach((p) => {
                p.data(series);
            });
            events.call('data', this);
            return this;
        } else {
            return gt.data;
        }
    }

    /**
     * Create a new paper for a DOM element
     *
     * @return a new Paper object
     */
    paper (element, options) {
        var paper;
        if (arguments.length == 1) {
            if (isObject(element)) {
                options = element;
                element = null;
            }
        }
        var name = options ? options.name : undefined,
            gt = self.get(this),
            opts = gt.options;
        if (name && gt.paperOptions[name])
            opts = extend(true, {}, opts, gt.paperOptions[name]);

        options = extend(true, {}, opts, options);
        if (options.type === 'canvas')
            paper = new Canvas(this, element, options, gt.events);
        else
            paper = new Svg(this, element, options, gt.events);
        gt.papers.push(paper);
        return paper;
    }

    /**
     * Update papers from JSON
     */
    options (_) {
        var gt = self.get(this);
        var current = gt.options;
        if (arguments.length === 0) return current;
        //
        var options = extend({}, _);
        var paperOptions = stripPapers(options);
        //
        gt.options = extend(true, current, options);
        gt.paperOptions = extend(true, gt.paperOptions, paperOptions);
        //
        return this;
    }

    /**
     * Apply ``callback`` over all papers
     *
     * @param callback: function accepting the paper as first parameter
     */
    forEach (callback) {
        self.get(this).papers.forEach(callback);
    }

    /**
     * Draw data into this giotto instance
     *
     * @param data
     */
    draw (data) {
        this.clear();
        this.forEach((paper) => {
            paper.draw(data);
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
        var gt = self.get(this),
            papers = gt.papers,
            index = papers.indexOf(paper);
        if (index >= 0) {
            papers.splice(index, 0);
            paper.container.remove();
            gt.refresh();
            return true;
        }
    }
}

export default function (options) {
    return new Giotto(options);
}


function stripPapers (options) {
    if (options && options.papers) {
        var papers = options.papers;
        delete options.papers;
        return papers;
    }
}
