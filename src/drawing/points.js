import {Drawing} from '../core/drawing';

Drawing.defaults.points = {
    symbol: 'circle',
    size: '8px',
    fill: true,
    fillOpacity: 1,
    colorOpacity: 1,
    lineWidth: 2,
    active: {
        fill: 'darker',
        color: 'brighter',
        // Multiplier for size, set to 100% for no change
        size: '150%'
    }
};

/**
 * Draw points on a paper
 */
class Points extends Drawing {

}


export function points (options) {
    return new Points(options);
}
