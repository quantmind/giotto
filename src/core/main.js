import {self, isObject, isArray, extend} from 'd3-quant';
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
        super(extend(true, {}, options, defaults));
        var g = self.get(this);
        g.papers = [];
        g.events = dispatch('draw', 'redraw', 'resize', 'refresh', 'dataBefore', 'data');
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
        options = extend(true, {}, this.options(), options);
        if (options.type === 'canvas')
            paper = new Canvas(this, element, options);
        else
            paper = new Svg(this, element, options);
        self.get(this).papers.push(paper);
        return paper;
    }

    /**
     * Update papers from JSON
     */
    options (_) {
        var current = self.get(this).options;
        if (arguments.length === 0) return current;
        var options = extend({}, _);
        var papers = options.papers;
        delete options.papers;
        options = extend(true, current, options);
        options.papers = isArray(papers) ? papers : [];
        self.get(this).options = options;
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
