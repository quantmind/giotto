'use strict';
import {Giotto} from './main';
import {loadCss} from '../utils/dom'

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
    loadCss('https://giottojs.com/media/' + Giotto.version + '/css/' + theme + '.min.css');
    current_theme = theme;
}
