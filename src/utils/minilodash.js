
    var
    //
    ostring = Object.prototype.toString,
    //
    // Underscore-like object
    _ = g._ = {},
    //  Simple extend function
    //
    extend = g.extend = _.extend = function () {
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
            if (Object(obj) === obj) {
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
    },
    //  copyMissing
    //  =================
    //
    //  Copy values to toObj from fromObj which are missing (undefined) in toObj
    copyMissing = _.copyMissing = function (fromObj, toObj, deep) {
        if (fromObj && toObj) {
            var v, t;
            for (var prop in fromObj) {
                if (fromObj.hasOwnProperty(prop)) {
                    t = fromObj[prop];
                    v = toObj[prop];
                    if (deep && isObject(t) && t !== v) {
                        if (!isObject(v)) v = {};
                        copyMissing(t, v, deep);
                        toObj[prop] = v;
                    } else if (v === undefined) {
                        toObj[prop] = t;
                    }
                }
            }
        }
        return toObj;
    },
    //
    getRootAttribute = function (name) {
        var obj = root,
            bits= name.split('.');

        for (var i=0; i<bits.length; ++i) {
            obj = obj[bits[i]];
            if (!obj) break;
        }
        return obj;
    },
    //
    //
    // Obtain extra information from javascript objects
    getOptions = function (attrs) {
        var options;
        if (attrs && typeof attrs.options === 'string') {
            options = getRootAttribute(attrs.options);
            if (typeof options === 'function')
                options = options();
        } else {
            options = {};
        }
        if (isObject(options))
            forEach(attrs, function (value, name) {
                if (name.substring(0, 1) !== '$' && name !== 'options')
                    options[name] = value;
            });
        return options;
    },
    //
    //
    keys = _.keys = function (obj) {
        var keys = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                keys.push(key);
        }
        return keys;
    },

    size = _.size = function (obj) {
        if (!obj)
            return 0;
        else if (obj.length !== undefined)
            return obj.length;
        else if (_.isObject(obj)) {
            var n = 0;
            for (var key in obj)
                if (obj.hasOwnProperty(key)) n++;
            return n;
        }
        else
            return 0;
    },
    //
    forEach = _.forEach = _.each = function (obj, callback) {
        if (!obj) return;
        if (obj.forEach) return obj.forEach(callback);
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                callback(obj[keys], key);
        }
    },
    //
    pick = _.pick = function (obj, callback) {
        var picked = {},
            val;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                val = callback(obj[key], key);
                if (val !== undefined)
                    picked[key] = val;
            }
        }
        return picked;
    },

    // Extend the initial array with values for other arrays
    extendArray = _.extendArray = function () {
        if (!arguments.length) return;
        var value = arguments[0],
            push = function (v) {
                value.push(v);
            };
        if (typeof(value.push) === 'function') {
            for (var i=1; i<arguments.length; ++i)
                forEach(arguments[i], push);
        }
        return value;
    },

    //
    isObject = _.isObject = function (value) {
        return ostring.call(value) === '[object Object]';
    },
    //
    isString = _.isString = function (value) {
        return ostring.call(value) === '[object String]';
    },
    //
    isFunction = _.isFunction = function (value) {
        return ostring.call(value) === '[object Function]';
    },
    //
    isArray = _.isArray = function (value) {
        return ostring.call(value) === '[object Array]';
    },
    //
    isNull = _.isNull = function (value) {
        return value === undefined || value === null;
    },

    encodeObject = _.encodeObject = function (obj, contentType) {
        var p;
        if (contentType === 'multipart/form-data') {
            var fd = new FormData();
            for(p in obj)
                if (obj.hasOwnProperty(p))
                    fd.append(p, obj[p]);
            return fd;
        } else if (contentType === 'application/json') {
            return JSON.stringify(obj);
        } else {
            var str = [];
            for(p in obj)
                if (obj.hasOwnProperty(p))
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        }
    },

    getObject = _.getObject = function (o) {
        if (_.isString(o)) {
            var bits= o.split('.');
            o = root;

            for (var i=0; i<bits.length; ++i) {
                o = o[bits[i]];
                if (!o) break;
            }
        }
        return o;
    },

    //  Load a style sheet link
    loadCss = _.loadCss = function (filename) {
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
        document.getElementsByTagName("head")[0].appendChild(fileref);
    },

    addCss = _.addCss = function (base, obj) {
        var css = [];

        accumulate(base, obj);

        if (css.length) {
            css = css.join('\n');
            var style = document.createElement("style");
            style.innerHTML = css;
            document.getElementsByTagName("head")[0].appendChild(style);
            return style;
        }

        function accumulate (s, o) {
            var bits = [],
                v;
            for (var p in o)
                if (o.hasOwnProperty(p)) {
                    v = o[p];
                    if (_.isObject(v))
                        accumulate(s + ' .' + p, v);
                    else
                        bits.push('    ' + p + ': ' + v + ';');
                }
            if (bits.length)
                css.push(s + ' {\n' + bits.join('\n') + '\n}');
        }
    },

        // Simple Slugify function
    slugify = _.slugify = function (str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to   = "aaaaeeeeiiiioooouuuunc------";
        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    },

    fontstrings = ['style', 'variant', 'weight', 'size', 'family'],

    fontString = _.fontString = function (opts) {
        var bits = [],
            v;
        for (var i=0; i<fontstrings.length; ++i) {
            v = opts[fontstrings[i]];
            if (v)
                bits.push(v);
        }
        return bits.join(' ');
    };
