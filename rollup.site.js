import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
    entry: 'site/index.js',
    format: 'umd',
    moduleName: 'giottojs',
    moduleId: 'giottojs',
    plugins: [
        json(),
        babel({
            babelrc: false,
            presets: ['es2015-rollup']
        })
    ],
    dest: '../giottojs.org/giottojs.js',
    paths: {
        'd3-view': 'd3',
        'd3-let': 'd3',
        'd3-selection': 'd3',
        'd3-transition': 'd3'
    }
};
