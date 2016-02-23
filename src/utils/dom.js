import {isFunction} from 'd3-quant';

let _idCounter = 0;


export function giottoId (element) {
    var id = element ? element.attr('id') : null;
    if (!id) {
        id = 'giotto' + (++_idCounter);
        if (element) element.attr('id', id);
    }
    return id;
}

//  Load a style sheet link
export function loadCss (filename) {
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
    document.getElementsByTagName("head")[0].appendChild(fileref);
}


export function getElement (element) {
    if (!element) {
        element = document.createElement('div');
    } if (isFunction(element.node))
        element = element.node();
    return element;
}
