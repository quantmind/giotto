
    var

    ostring = Object.prototype.toString,

    isFunction = function (value) {
        return ostring.call(value) === '[object Function]';
    },

    isArray = function (value) {
        return ostring.call(value) === '[object Array]';
    };
