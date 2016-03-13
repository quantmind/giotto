import {map} from 'd3-collection';

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

    setProperty(name, value) {
        this.setAttribute(name, value);
    }

    removeProperty(name) {
        this.removeAttribute(name);
    }

    getAttribute (attr) {
        if (this.attrs) return this.attrs.get(attr);
    }

    getProperty(name) {
        return this.getAttribute(name);
    }

    getPropertyValue (name) {
        return this.getAttribute(name);
    }

    get namespaceURI () {
        return namespace;
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
