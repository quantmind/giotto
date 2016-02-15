var requirejs = require('requirejs');

var config = {
    baseUrl: '.',
    name: 'main',
    out: '../giottojs/giottojs.js'
};

console.log('Building giottojs.js');

requirejs.optimize(config, function (buildResponse) {
    //buildResponse is just a text output of the modules
    //included. Load the built file for the contents.
    //Use config.out to get the optimized file contents.
    console.log('Building giottojs.js');
    var contents = fs.readFileSync(config.out, 'utf8');
}, function(err) {
    //optimization err callback
});
