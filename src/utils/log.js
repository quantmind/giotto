import {default as noop} from './noop';


export default function (_) {
    if (arguments.length === 0) return logger;
    logger = _;
}

var debug_level = 'debug';
var debug = false;


var logger = {

    debug: consoleLog(debug_level),

    info: consoleLog('info'),

    warn: consoleLog('warn'),

    error: consoleLog('error'),

    debugEnabled: function(flag) {
        if (arguments.length === 0) return debug;
        debug = flag;
        return logger;
    }
};


function consoleLog(level) {

    var Console = window.console || {},
        logFn = Console[level] || Console.log || noop,
        hasApply = false;

    try {
        hasApply = !!logFn.apply;
    } catch (e) {
        // continue regardless of error
    }

    if (hasApply) {
        return function() {
            var args = Array.prototype.slice.call(arguments);
            return logFn.apply(Console, args);
        };
    } else {
        return function (arg1, arg2) {
            logFn(arg1, arg2 == null ? '' : arg2);
        };
    }
}
