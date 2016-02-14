import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    entry: 'index.js',
    format: 'umd',
    moduleName: 'giotto',
    plugins: [
        babel({
            babelrc: false,
            presets: ['es2015-rollup']
        }),
        nodeResolve({jsnext: true})
    ],
    dest: 'build/giotto.js'
};
