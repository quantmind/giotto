import {default as giotto} from './main';
import {loadCss} from '../utils/dom'


let current_theme = null;

/**
 * Set or get the theme
 *
 * @param theme
 * @returns {*}
 */
export function theme (theme) {
    if (arguments.length === 0) return current_theme;
    if (current_theme === theme) return;
    loadCss('https://giottojs.com/media/' + giotto.version + '/css/' + theme + '.min.css');
    current_theme = theme;
}
