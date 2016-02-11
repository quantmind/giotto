'use strict';

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

/**
 * This function retrieve the inner elements of an object
 * @param obj
 * @returns {*}
 */
export function inner (obj) {
    return obj._inner;
}
