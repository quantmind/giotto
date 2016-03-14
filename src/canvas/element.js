import {map} from 'd3-collection';
import * as d3 from 'd3-color';

var namespace = 'canvas';


/**
 * A proxy for a data entry on canvas
 * It allow to use the d3-select and d3-transition libraries
 * on canvas joins
 */
export class CanvasElement {

    constructor (context) {
        this.context = context;
    }

    children () {
        if (!this.childNodes) this.childNodes = [];
        return this.childNodes;
    }

    querySelectorAll (selector) {
        var selections = [];
        if (this.childNodes) {
            var children = this.childNodes;
            if (selector === '*')
                return children.slice();
            for (let i = 0; i < children.length; ++i)
                if (children[i].tag === selector)
                    selections.push(children[i]);
        }
        return selections;
    }

    querySelector (selector) {
        if (this.childNodes) {
            var children = this.childNodes;
            for (let i = 0; i < children.length; ++i)
                if (children[i].tag === selector)
                    return children[i];
        }
    }

    createElementNS (namespaceURI, qualifiedName) {
        var elem = new CanvasElement(this.context);
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
        if (!this.attrs) this.attrs = map();
        this.attrs.set(attr, value);
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

    draw () {
        var attrs = this.attrs,
            ctx = this.context;
        if (!attrs) return;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        var transform = this._get('transform');
        if (transform) {
            if (transform.translate)
                ctx.translate(transform.translate[0], transform.translate[1]);
        }
        ctx.beginPath();
        if (attrs.has('d'))
            attrs.get('d').context(ctx)();
        fillColor(ctx, this._get('fill'), this._get('fill-opacity'));
        strokeColor(ctx, this._get('stroke'), this._get('stroke-opacity'), this._get('stroke-width'));
        ctx.restore();
    }

    _get (attr) {
        var value = this.getAttribute(attr);
        if (value === undefined && this.parentNode) return this.parentNode._get(attr);
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
}


function fillColor(ctx, fill, opacity) {
    if (fill) {
        fill = d3.color(fill);
        if (opacity || opacity===0)
            fill.opacity = opacity;
        ctx.fillStyle = ''+fill;
        ctx.fill();
        return fill;
    }
}



function strokeColor(ctx, stroke, opacity, width) {
    if (stroke) {
        stroke = d3.color(stroke);
        if (opacity || opacity===0)
            stroke.opacity = opacity;
        ctx.strokeStyle = ''+stroke;
        ctx.lineWidth = width || 1;
        ctx.stroke();
        return stroke;
    }
}
