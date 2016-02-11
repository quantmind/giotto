'use strict';
import {Giotto} from './main';

// load Css unless blocked
Giotto.theme = theme;

let current_theme = null;

/**
 * Set or get the theme
 *
 * @param theme
 * @returns {*}
 */
function theme (theme) {
    if (arguments.length === 0) return current_theme;
    if (current_theme === theme) return;

    var style = document.createElement("style");
    style.src = 'https://giottojs.com/media/' + Giotto.version + '/css/' + theme + '.min.css';
    document.getElementsByTagName("head")[0].appendChild(style);
    current_theme = theme;
}
