import {map} from 'd3-collection';
import {timeout} from 'd3-timer';
import {default as canvasTransform} from './transitions';
import * as d3 from 'd3-color';


var namespace = 'canvas';

/**
 * A proxy for a data entry on canvas
 *
 * It allow the use the d3-select and d3-transition libraries
 * on canvas joins
 */
export class CanvasElement {

    constructor (context, factor) {
        this.context = context;
        this.factor = factor || 1;
    }

    children () {
        if (!this.childNodes) this.childNodes = [];
        return this.childNodes;
    }

    querySelectorAll (selector) {
        var selections = [];
        if (this.childNodes) {
            if (selector === '*') return this.children.slice();
            return select(selector, this.childNodes, selections);
        }
        return selections;
    }

    querySelector (selector) {
        if (this.childNodes) {
            if (selector === '*') return this.childNodes[0];
            return select(selector, this.childNodes);
        }
    }

    createElementNS (namespaceURI, qualifiedName) {
        var elem = new CanvasElement(this.context, this.factor);
        elem.tag = qualifiedName;
        return elem;
    }

    appendChild (child) {
        return this.insertBefore(child);
    }

    insertBefore (child, refChild) {
        if (refChild) {
            var children = this.children(),
                index = children.indexOf(refChild);
            if (index > -1)
                children.splice(index, 0, child);
            else
                children.push(child)
        } else
            this.children().push(child);
        child.parentNode = this;
        return child;
    }

    removeChild (child) {
        if (this.childNodes) {
            var index = this.childNodes.indexOf(child);
            if (index > -1) {
                this.childNodes.splice(index, 1);
                delete child.parentNode;
                return child;
            }
        }
    }

    setAttribute (attr, value) {
        if (this.parentNode) {
            if (attr === 'class') this.class = value;
            else {
                if (!this.attrs) this.attrs = map();
                canvasTransform(this, attr, value);
            }
        } else if (attr === 'draw')
            timeout(redraw(this, value));
    }

    removeAttribute (attr) {
        if (this.attrs) this.attrs.remove(attr);
    }

    removeProperty(name) {
        this.removeAttribute(name);
    }

    getAttribute (attr) {
        if (this.attrs) return this.attrs.get(attr);
    }

    get namespaceURI () {
        return namespace;
    }

    draw (t) {
        var ctx = this.context,
            attrs = this.attrs;
        if (!this.parentNode || !attrs) return;

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        var transform = this.getValue('transform');
        if (transform) {
            if (transform.translate)
                ctx.translate(transform.translate[0], transform.translate[1]);
        }
        ctx.beginPath();
        if (attrs.has('d')) attrs.get('d').draw(this, t);
        fillStyle(this);
        strokeStyle(this);
        ctx.restore();
    }

    getValue (attr) {
        var value = this.getAttribute(attr);
        if (value === undefined && this.parentNode) return this.parentNode.getValue(attr);
        return value;
    }

    // Additional attribute functions
    setProperty(name, value) {
        this.setAttribute(name, value);
    }

    getProperty(name) {
        return this.getAttribute(name);
    }

    getPropertyValue (name) {
        return this.getAttribute(name);
    }

    // Proxies to this object
    getComputedStyle () {
        return this;
    }

    get ownerDocument () {
        return this;
    }

    get style () {
        return this;
    }

    get defaultView () {
        return this;
    }

    get document () {
        return this;
    }
    //
    onStart () {
        return;
    }
}


function select(selector, children, selections) {
    var bits = selector.split('.'),
        tag = bits[0],
        classes = bits.splice(1).join(' ');

    for (let i = 0; i < children.length; ++i)
        if (children[i].tag === tag) {
            if (classes && children[i].class !== classes)
                continue;
            if (selections)
                selections.push(children[i]);
            else
                return children[i];
        }

    return selections;
}


function redraw (node, t) {

    return function () {
        var ctx = node.context;
        ctx.beginPath();
        ctx.closePath();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        node.children().forEach((child) => {
            child.draw(t);
        });
    };
}


function strokeStyle (node) {
    var stroke = node.getValue('stroke');
    if (stroke && stroke !== 'none') {
        stroke = d3.color(stroke);
        var opacity = node.getValue('stroke-opacity');
        if (opacity || opacity === 0)
            stroke.opacity = opacity;
        node.context.strokeStyle = '' + stroke;
        node.context.lineWidth = node.factor * (node.getValue('stroke-width') || 1);
        node.context.stroke();
        return stroke;
    }
}


function fillStyle (node) {
    var fill = node.getValue('fill');
    if (fill && fill !== 'none') {
        fill = d3.color(fill);
        var opacity = node.getValue('fill-opacity');
        if (opacity || opacity===0)
            fill.opacity = opacity;
        node.context.fillStyle = ''+fill;
        node.context.fill();
        return fill;
    }
}
