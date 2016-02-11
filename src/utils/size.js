'use strict';


export function getWidth (element) {
    return getParentRectValue(element, 'width');
}

export function getHeight (element) {
    return getParentRectValue(element, 'height');
}

export function getWidthElement (element) {
    return getParentElementRect(element, 'width');
}

export function getHeightElement (element) {
    return getParentElementRect(element, 'height');
}

function getParentRectValue (element, key) {
    let parent = element.node ? element.node() : element,
        v;
    while (parent && parent.tagName !== 'BODY') {
        v = parent.getBoundingClientRect()[key];
        if (v)
            break;
        parent = parent.parentNode;
    }
    return v;
}

function getParentElementRect (element, key) {
    let parent = element.node ? element.node() : element,
        v;
    while (parent && parent.tagName !== 'BODY') {
        v = parent.getBoundingClientRect()[key];
        if (v)
            return parent;
        parent = parent.parentNode;
    }
}
