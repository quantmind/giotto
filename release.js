var uglify = require('uglify-js');

uglify.minify('build/giotto.js', 'build/giotto.min.js');
