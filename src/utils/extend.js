
    var
    //  Simple extend function
    //
    extend = g.extend = function () {
        var length = arguments.length,
            object = arguments[0];

        if (!object || length < 2) {
            return object;
        }
        var index = 0,
            obj;

        while (++index < length) {
            obj = arguments[index];
            if (Object(obj) === obj) {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop))
                        object[prop] = obj[prop];
                }
            }
        }
        return object;
    },
    //  copyMissing
    //  =================
    //
    //  Copy values to toObj from fromObj which are missing (undefined) in toObj
    copyMissing = function (fromObj, toObj) {
        if (fromObj && toObj) {
            for (var prop in fromObj) {
                if (fromObj.hasOwnProperty(prop) && toObj[prop] === undefined)
                    toObj[prop] = fromObj[prop];
            }
        }
        return toObj;
    },
    //
    //
    // Obtain extra information from javascript objects
    getOptions = function (attrs) {
        if (attrs && typeof attrs.options === 'string') {
            var obj = root,
                bits= attrs.options.split('.');

            for (var i=0; i<bits.length; ++i) {
                obj = obj[bits[i]];
                if (!obj) break;
            }
            if (typeof obj === 'function')
                obj = obj(g, attrs);
            attrs = extend(attrs, obj);
        }
        return attrs;
    };
