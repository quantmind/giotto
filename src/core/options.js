'use strict';


export function setOptions (options, defaults) {
    options || (options = {});
    var opts = [defaults];
    if (options.plugins) {
        options.plugins.forEach(function () {

        });
    }
    return opts;
}
