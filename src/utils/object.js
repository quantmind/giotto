export function rebind (target, source) {
    var i = 1, n = arguments.length, method;
    while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
    return target;
}


export function popKey (object, key) {
    if (object && object[key]) {
        var value = object[key];
        delete object[key];
        return value;
    }
}

function d3_rebind(target, source, method) {
    return function() {
      var value = method.apply(source, arguments);
      return value === source ? target : value;
    };
}
