const ostring = Object.prototype.toString;

export function extend () {
    var length = arguments.length,
        object = arguments[0],
        index = 0,
        deep = false,
        obj;

    if (object === true) {
        deep = true;
        object = arguments[1];
        index++;
    }

    if (!object || length < index + 2)
        return object;

    while (++index < length) {
        obj = arguments[index];
        if (isObject(obj)) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (deep) {
                        if (isObject(obj[prop]))
                            if (isObject(object[prop]))
                                extend(true, object[prop], obj[prop]);
                            else
                                object[prop] = extend(true, {}, obj[prop]);
                        else
                            object[prop] = obj[prop];
                    } else
                        object[prop] = obj[prop];
                }
            }
        }
    }
    return object;
}

export function isObject (value) {
    return ostring.call(value) === '[object Object]';
}

export function isString (value) {
    return ostring.call(value) === '[object String]';
}

export function isFunction (value) {
    return ostring.call(value) === '[object Function]';
}

export function isArray (value) {
    return ostring.call(value) === '[object Array]';
}

export function isDate (value) {
    return ostring.call(value) === '[object Date]';
}


export function forEach (obj, callback) {
    if (!obj) return;
    if (obj.forEach) return obj.forEach(callback);
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            callback(obj[key], key);
    }
}

export function rebind (target, source) {
    var i = 1, n = arguments.length, method;
    while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
    return target;
}

function d3_rebind(target, source, method) {
    return function() {
      var value = method.apply(source, arguments);
      return value === source ? target : value;
    };
}
