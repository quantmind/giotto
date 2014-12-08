//      Giotto - v0.1.0

//      Compiled 2014-12-08.
//      Copyright (c) 2014 - Luca Sbardella
//      Licensed BSD.
//      For all details and documentation:
//      http://quantmind.github.io/giotto/
//
(function (factory) {
    var root;
    if (typeof module === "object" && module.exports)
        root = module.exports;
    else
        root = window;
    //
    if (typeof define === 'function' && define.amd) {
        // Support AMD. Register as an anonymous module.
        // NOTE: List all dependencies in AMD style
        define(['d3'], function () {
            return factory(d3, root);
        });
    } else if (typeof module === "object" && module.exports) {
        // No AMD. Set module as a global variable
        // NOTE: Pass dependencies to factory function
        // (assume that d3 is also global.)
        factory(d3, root);
    }
}(function(d3, root) {
    "use strict";
    var giotto = {
            version: "0.1.0",
            d3: d3,
            math: {}
        },
        g = giotto;

    d3.giotto = giotto;
    d3.canvas = {};

    // Warps RequireJs call so it can be used in conjunction with
    //  require-config.js
    //
    //  http://quantmind.github.io/require-config-js/
    g.require = function (deps, callback) {
        if (root.rcfg && root.rcfg.min)
            deps = root.rcfg.min(deps);
        require(deps, callback);
        return g;
    };


    // D3 internal functions used by GiottoJS
    // These are copied from d3.js

    function d3_identity(d) {
        return d;
    }

    function d3_zero() {
        return 0;
    }

    function d3_functor (v) {
        return typeof v === "function" ? v : function() {
            return v;
        };
    }

    function d3_scaleExtent(domain) {
        var start = domain[0], stop = domain[domain.length - 1];
        return start < stop ? [ start, stop ] : [ stop, start ];
    }

    function d3_scaleRange(scale) {
        return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());
    }

    function d3_geom_pointX(d) {
        return d[0];
    }

    function d3_geom_pointY(d) {
        return d[1];
    }

    function d3_true() {
        return true;
    }

    // Matrix to transform basis (b-spline) control points to bezier
    // control points. Derived from FvD 11.2.8.
    var d3_svg_lineBasisBezier1 = [0, 2/3, 1/3, 0],
        d3_svg_lineBasisBezier2 = [0, 1/3, 2/3, 0],
        d3_svg_lineBasisBezier3 = [0, 1/6, 2/3, 1/6];

    // Computes the slope from points p0 to p1.
    function d3_svg_lineSlope(p0, p1) {
        return (p1[1] - p0[1]) / (p1[0] - p0[0]);
    }

    // Returns the dot product of the given four-element vectors.
    function d3_svg_lineDot4(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    }

    // Generates tangents for a cardinal spline.
    function d3_svg_lineCardinalTangents(points, tension) {
        var tangents = [],
            a = (1 - tension) / 2,
            p0,
            p1 = points[0],
            p2 = points[1],
            i = 1,
            n = points.length;
        while (++i < n) {
            p0 = p1;
            p1 = p2;
            p2 = points[i];
            tangents.push([a * (p2[0] - p0[0]), a * (p2[1] - p0[1])]);
        }
        return tangents;
    }

    // Compute three-point differences for the given points.
    // http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Finite_difference
    function d3_svg_lineFiniteDifferences(points) {
        var i = 0,
          j = points.length - 1,
          m = [],
          p0 = points[0],
          p1 = points[1],
          d = m[0] = d3_svg_lineSlope(p0, p1);
        while (++i < j) {
            m[i] = (d + (d = d3_svg_lineSlope(p0 = p1, p1 = points[i + 1]))) / 2;
        }
        m[i] = d;
        return m;
    }

    // Interpolates the given points using Fritsch-Carlson Monotone cubic Hermite
    // interpolation. Returns an array of tangent vectors. For details, see
    // http://en.wikipedia.org/wiki/Monotone_cubic_interpolation
    function d3_svg_lineMonotoneTangents(points) {
        var tangents = [],
          d,
          a,
          b,
          s,
          m = d3_svg_lineFiniteDifferences(points),
          i = -1,
          j = points.length - 1;

        // The first two steps are done by computing finite-differences:
        // 1. Compute the slopes of the secant lines between successive points.
        // 2. Initialize the tangents at every point as the average of the secants.

        // Then, for each segment…
        while (++i < j) {
            d = d3_svg_lineSlope(points[i], points[i + 1]);

            // 3. If two successive yk = y{k + 1} are equal (i.e., d is zero), then set
            // mk = m{k + 1} = 0 as the spline connecting these points must be flat to
            // preserve monotonicity. Ignore step 4 and 5 for those k.

            if (abs(d) < ε) {
                m[i] = m[i + 1] = 0;
            } else {
                // 4. Let ak = mk / dk and bk = m{k + 1} / dk.
                a = m[i] / d;
                b = m[i + 1] / d;

                // 5. Prevent overshoot and ensure monotonicity by restricting the
                // magnitude of vector <ak, bk> to a circle of radius 3.
                s = a * a + b * b;
                if (s > 9) {
                    s = d * 3 / Math.sqrt(s);
                    m[i] = s * a;
                    m[i + 1] = s * b;
                }
            }
        }

        // Compute the normalized tangent vector from the slopes. Note that if x is
        // not monotonic, it's possible that the slope will be infinite, so we protect
        // against NaN by setting the coordinate to zero.
        i = -1; while (++i <= j) {
            s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i]));
            tangents.push([s || 0, m[i] * s || 0]);
        }

        return tangents;
    }

    function d3_geom_polygonIntersect(c, d, a, b) {
        var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3, y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3, ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
        return [ x1 + ua * x21, y1 + ua * y21 ];
    }

    function d3_asin(x) {
        return x > 1 ? halfπ : x < -1 ? -halfπ : Math.asin(x);
    }

    // ARCS

    var d3_svg_arcAuto = "auto";

    function d3_svg_arcInnerRadius(d) {
        return d.innerRadius;
    }

    function d3_svg_arcOuterRadius(d) {
        return d.outerRadius;
    }

    function d3_svg_arcStartAngle(d) {
        return d.startAngle;
    }

    function d3_svg_arcEndAngle(d) {
        return d.endAngle;
    }

    function d3_svg_arcPadAngle(d) {
        return d && d.padAngle;
    }

    // Note: similar to d3_cross2d, d3_geom_polygonInside
    function d3_svg_arcSweep(x0, y0, x1, y1) {
        return (x0 - x1) * y0 - (y0 - y1) * x0 > 0 ? 0 : 1;
    }

    // Compute perpendicular offset line of length rc.
    // http://mathworld.wolfram.com/Circle-LineIntersection.html
    function d3_svg_arcCornerTangents(p0, p1, r1, rc, cw) {
        var x01 = p0[0] - p1[0],
            y01 = p0[1] - p1[1],
            lo = (cw ? rc : -rc) / Math.sqrt(x01 * x01 + y01 * y01),
            ox = lo * y01,
            oy = -lo * x01,
            x1 = p0[0] + ox,
            y1 = p0[1] + oy,
            x2 = p1[0] + ox,
            y2 = p1[1] + oy,
            x3 = (x1 + x2) / 2,
            y3 = (y1 + y2) / 2,
            dx = x2 - x1,
            dy = y2 - y1,
            d2 = dx * dx + dy * dy,
            r = r1 - rc,
            D = x1 * y2 - x2 * y1,
            d = (dy < 0 ? -1 : 1) * Math.sqrt(r * r * d2 - D * D),
            cx0 = (D * dy - dx * d) / d2,
            cy0 = (-D * dx - dy * d) / d2,
            cx1 = (D * dy + dx * d) / d2,
            cy1 = (-D * dx + dy * d) / d2,
            dx0 = cx0 - x3,
            dy0 = cy0 - y3,
            dx1 = cx1 - x3,
            dy1 = cy1 - y3;

        // Pick the closer of the two intersection points.
        // TODO Is there a faster way to determine which intersection to use?
        if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;

        return [
            [cx0 - ox, cy0 - oy],
            [cx0 * r1 / r, cy0 * r1 / r]
        ];
    }

    function noop () {}

    var log = function (debug) {

        function formatError(arg) {
            if (arg instanceof Error) {
                if (arg.stack) {
                    arg = (arg.message && arg.stack.indexOf(arg.message) === -1
                        ) ? 'Error: ' + arg.message + '\n' + arg.stack : arg.stack;
                } else if (arg.sourceURL) {
                    arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
                }
            }
            return arg;
        }

        function consoleLog(type) {
            var console = window.console || {},
                logFn = console[type] || console.log || noop,
                hasApply = false;

              // Note: reading logFn.apply throws an error in IE11 in IE8 document mode.
              // The reason behind this is that console.log has type "object" in IE8...
              try {
                    hasApply = !!logFn.apply;
              } catch (e) {}

              if (hasApply) {
                    return function() {
                        var args = [];
                        for(var i=0; i<arguments.length; ++i)
                            args.push(formatError(arguments[i]));
                        return logFn.apply(console, args);
                    };
            }

            // we are IE which either doesn't have window.console => this is noop and we do nothing,
            // or we are IE where console.log doesn't have apply so we log at least first 2 args
            return function(arg1, arg2) {
                logFn(arg1, arg2 === null ? '' : arg2);
            };
        }

        return {
            log: consoleLog('log'),
            info: consoleLog('info'),
            warn: consoleLog('warn'),
            error: consoleLog('error'),
            debug: (function () {
                var fn = consoleLog('debug');

                return function() {
                    if (debug) {
                        fn.apply(self, arguments);
                    }
                };
            }()),

        };
    };

    g.log = log(root.debug);


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
                            if (_.isObject(obj[prop]))
                                if (_.isObject(object[prop]))
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
    copyMissing = _.copyMissing = function (fromObj, toObj) {
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
    };


    function getWidth (element) {
        return getParentRectValue(element, 'width');
    }

    function getHeight (element) {
        return getParentRectValue(element, 'height');
    }

    function getWidthElement (element) {
        return getParentElementRect(element, 'width');
    }

    function getHeightElement (element) {
        return getParentElementRect(element, 'height');
    }

    function getParentRectValue (element, key) {
        var parent = element.node(),
            r, v;
        while (parent && parent.tagName !== 'BODY') {
            v = parent.getBoundingClientRect()[key];
            if (v)
                break;
            parent = parent.parentNode;
        }
        return v;
    }

    function getParentElementRect (element, key) {
        var parent = element.node(),
            r, v;
        while (parent && parent.tagName !== 'BODY') {
            v = parent.getBoundingClientRect()[key];
            if (v)
                return d3.select(parent);
            parent = parent.parentNode;
        }
    }


    g.math.distances = {

        euclidean: function(v1, v2) {
            var total = 0;
            for (var i = 0; i < v1.length; i++) {
                total += Math.pow(v2[i] - v1[i], 2);
            }
            return Math.sqrt(total);
        }
    };
    //
    //  K-means clustering
    g.math.kmeans = function (centroids, max_iter, distance) {
        var km = {};

        max_iter = max_iter || 300;
        distance = distance || "euclidean";
        if (typeof distance == "string")
            distance = g.math.distances[distance];

        km.centroids = function (x) {
            if (!arguments.length) return centroids;
            centroids = x;
            return km;
        };

        km.maxIters = function (x) {
            if (!arguments.length) return max_iter;
            max_iter = +x;
            return km;
        };

        // create a set of random centroids from a set of points
        km.randomCentroids = function (points, K) {
            var means = points.slice(0); // copy
            means.sort(function() {
                return Math.round(Math.random()) - 0.5;
            });
            return means.slice(0, K);
        };

        km.classify = function (point) {
            var min = Infinity,
                index = 0,
                i, dist;
            for (i = 0; i < centroids.length; i++) {
                dist = distance(point, centroids[i]);
                if (dist < min) {
                    min = dist;
                    index = i;
                }
           }
           return index;
        };

        km.cluster = function (points, callback) {

            var iterations = 0,
                movement = true,
                N = points.length,
                K = centroids.length,
                clusters = new Array(K),
                newCentroids,
                n, k;

            if (N < K)
                throw Error('Number of points less than the number of clusters in K-means classification');

            while (movement && iterations < max_iter) {
                movement = false;
                ++iterations;

                // Assignments
                for (k = 0; k < K; ++k)
                    clusters[k] = {centroid: centroids[k], points: [], indices: []};

                for (n = 0; n < N; n++) {
                    k = km.classify(points[n]);
                    clusters[k].points.push(points[n]);
                    clusters[k].indices.push(n);
                }

                // Update centroids
                newCentroids = [];
                for (k = 0; k < K; ++k) {
                    if (clusters[k].points.length)
                        newCentroids.push(g.math.mean(clusters[k].points));
                    else {
                        // A centroid with no points, randomly re-initialise it
                        newCentroids = km.randomCentroids(points, K);
                        break;
                    }
                }

                for (k = 0; k < K; ++k) {
                    if (newCentroids[k] != centroids[k]) {
                        centroids = newCentroids;
                        movement = true;
                        break;
                    }
                }

                if (callback)
                    callback(clusters, iterations);
            }

            return clusters;
        };

        return km;
    };
    var ε = 1e-6,
        ε2 = ε * ε,
        π = Math.PI,
        τ = 2 * π,
        τε = τ - ε,
        halfπ = π / 2,
        d3_radians = π / 180,
        d3_degrees = 180 / π,
        abs = Math.abs;

    g.math.xyfunction = function (X, funy) {
        var xy = [];
        if (isArray(X))
            X.forEach(function (x) {
                xy.push([x, funy(x)]);
            });
        return xy;
    };

    // The arithmetic average of a array of points
    g.math.mean = function (points) {
        var mean = points[0].slice(0), // copy the first point
            point, i, j;
        for (i=1; i<points.length; ++i) {
            point = points[i];
            for (j=0; j<mean.length; ++j)
                mean[j] += point[j];
        }
        for (j=0; j<mean.length; ++j)
            mean[j] /= points.length;
        return mean;
    };
    var BITS = 52,
        SCALE = 2 << 51,
        MAX_DIMENSION = 21201,
        COEFFICIENTS = [
            'd       s       a       m_i',
            '2       1       0       1',
            '3       2       1       1 3',
            '4       3       1       1 3 1',
            '5       3       2       1 1 1',
            '6       4       1       1 1 3 3',
            '7       4       4       1 3 5 13',
            '8       5       2       1 1 5 5 17',
            '9       5       4       1 1 5 5 5',
            '10      5       7       1 1 7 11 1'
        ];


    g.math.sobol = function (dim) {
        if (dim < 1 || dim > MAX_DIMENSION) throw new Error("Out of range dimension");
        var sobol = {},
            count = 0,
            direction = [],
            x = [],
            zero = [],
            lines,
            i;

        sobol.next = function() {
            var v = [];
            if (count === 0) {
                count++;
                return zero.slice();
            }
            var c = 1;
            var value = count - 1;
            while ((value & 1) == 1) {
                value >>= 1;
                c++;
            }
            for (i = 0; i < dim; i++) {
                x[i] ^= direction[i][c];
                v[i] = x[i] / SCALE;
            }
            count++;
            return v;
        };

        sobol.dimension = function () {
            return dim;
        };

        sobol.count = function () {
            return count;
        };


        var tmp = [];
        for (i = 0; i <= BITS; i++) tmp.push(0);
        for (i = 0; i < dim; i++) {
            direction[i] = tmp.slice();
            x[i] = 0;
            zero[i] = 0;
        }

        if (dim > COEFFICIENTS.length) {
            throw new Error("Out of range dimension");
            //var data = fs.readFileSync(file);
            //lines = ("" + data).split("\n");
        }
        else
            lines = COEFFICIENTS;

        for (i = 1; i <= BITS; i++) direction[0][i] = 1 << (BITS - i);
        for (var d = 1; d < dim; d++) {
            var cells = lines[d].split(/\s+/);
            var s = +cells[1];
            var a = +cells[2];
            var m = [0];
            for (i = 0; i < s; i++) m.push(+cells[3 + i]);
            for (i = 1; i <= s; i++) direction[d][i] = m[i] << (BITS - i);
            for (i = s + 1; i <= BITS; i++) {
                direction[d][i] = direction[d][i - s] ^ (direction[d][i - s] >> s);
                for (var k = 1; k <= s - 1; k++)
                direction[d][i] ^= ((a >> (s - 1 - k)) & 1) * direction[d][i - k];
            }
        }

        return sobol;
    };

    g.defaults = {};

    g.defaults.axis = {
        color: '#000',
        tickSize: 0.05,
        minTickSize: null,
        min: null,
        max: null
    };

    g.defaults.paper = {
        type: 'svg',
        resizeDelay: 200,
        resize: true,
        margin: {top: 20, right: 20, bottom: 20, left: 20},
        xaxis: extend({position: 'bottom'}, g.defaults.axis),
        yaxis: extend({position: 'left'}, g.defaults.axis),
        yaxis2: extend({position: 'right'}, g.defaults.axis),
        colors: d3.scale.category10().range(),
        css: null,
        line: {
            interpolate: 'cardinal',
            fill: false,
            lineWidth: 2
        },
        point: {
            symbol: 'circle',
            size: '8px',
            fill: true,
            fillOpacity: 1,
            lineWidth: 2
        },
        bar: {
            width: 'auto',
            color: null,
            fill: true,
            lineWidth: 2,
            // Radius in pixels of rounded corners. Set to 0 for no rounded corners
            radius: 4
        },
        pie: {
            lineWidth: 1,
            padAngle: 0,
            cornerRadius: 0,
            fillOpacity: 1,
            innerRadius: 0
        },
        font: {
            size: 11,
            weight: 'bold',
            lineHeight: 13,
            style: "italic",
            family: "sans-serif",
            variant: "small-caps"
        }
    };

    g.defaults.viz = extend({
        //
        // Optional callback after initialisation
        onInit: null,
        //
        // Default events dispatched by the visualization
        events: ['build', 'change', 'start', 'tick', 'end'],
    });

    g.constants = {
        DEFAULT_VIZ_GROUP: 'default_viz_group',
        WIDTH: 400,
        HEIGHT: 300,
        leaflet: 'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css'
    };
    var _idCounter = 0;
    //
    // Create a new paper for drawing stuff
    g.paper = function (element, p) {

        var paper = {},
            uid = ++_idCounter,
            color;

        if (isObject(element)) {
            p = element;
            element = null;
        }
        if (!element)
            element = document.createElement('div');

        element = d3.select(element);

        p = _newPaperAttr(element, p);

        // paper type
        paper.type = function () {
            return p.type;
        };

        paper.uid = function () {
            return uid;
        };

        // paper size, [width, height] in pixels
        paper.width = function () {
            return p.size[0];
        };

        paper.height = function () {
            return p.size[1];
        };

        paper.innerWidth = function () {
            return p.size[0] - p.margin.left - p.margin.right;
        };

        paper.innerHeight = function () {
            return p.size[1] - p.margin.top - p.margin.bottom;
        };

        paper.size = function () {
            return [paper.width(), paper.height()];
        };

        paper.aspectRatio = function () {
            return paper.innerHeight()/paper.innerWidth();
        };

        paper.element = function () {
            return element;
        };

        // returns the number of the y-axis currently selected
        paper.yaxis = function (x) {
            if (!arguments.length) return p.yaxisNumber;
            if (x === 1 || x === 2)
                p.yaxisNumber = x;
            return paper;
        };

        paper.xAxis = function (x) {
            return p.xAxis;
        };

        paper.yAxis = function () {
            return p.yAxis[p.yaxisNumber-1];
        };

        paper.scale = function (r) {
            var s = p.xAxis.scale();
            return Math.max(0, s(r) - s(0));
        };

        paper.scalex = function (x) {
            return p.xAxis.scale()(x);
        };

        paper.scaley = function (y) {
            return paper.yAxis().scale()(y);
        };

        paper.xfromPX = function (px) {
            return p.xAxis.scale().invert(px);
        };

        paper.yfromPX = function (px) {
            return paper.yAxis().scale().invert(px);
        };

        // Resize the paper and fire the resize event if resizing was performed
        paper.resize = function (size) {
            p._resizing = true;
            if (!size) {
                size = paper.boundingBox();
            }
            if (p.size[0] !== size[0] || p.size[1] !== size[1]) {
                g.log.info('Resizing paper');
                paper.refresh(size);
            }
            p._resizing = false;
        };

        // dimension in the input domain from a 0 <= x <= 1
        // assume a continuous domain
        // TODO allow for multiple domain points
        paper.dim = function (x) {
            var v = +x;
            // assume input is in pixels
            if (isNaN(v))
                return paper.xfromPX(x.substring(0, x.length-2));
            // otherwise assume it is a value between 0 and 1 defined as percentage of the x axis length
            else {
                var d = paper.xAxis().scale().domain();
                return v*(d[d.length-1] - d[0]);
            }
        };

        // x coordinate in the input domain
        paper.x = function (u) {
            var d = paper.xAxis().scale().domain();
            return u*(d[d.length-1] - d[0]) + d[0];
        };

        // y coordinate in the input domain
        paper.y = function (u) {
            var d = paper.yAxis().scale().domain();
            return u*(d[d.length-1] - d[0]) + d[0];
        };

        paper.boundingBox = function () {
            var w = p.elwidth ? getWidth(p.elwidth) : p.size[0],
                h;
            if (p.height_percentage)
                h = d3.round(w*p.height_percentage, 0);
            else
                h = p.elheight ? getHeight(p.elheight) : p.size[1];
            return [w, h];
        };

        paper.xyData = function (data) {
            if (!data) return;
            if (!data.data) data = {data: data};

            var xy = data.data,
                xmin = Infinity,
                ymin = Infinity,
                xmax =-Infinity,
                ymax =-Infinity,
                x = function (x) {
                    xmin = x < xmin ? x : xmin;
                    xmax = x > xmax ? x : xmax;
                    return x;
                },
                y = function (y) {
                    ymin = y < ymin ? y : ymin;
                    ymax = y > ymax ? y : ymax;
                    return y;
                };
            var xydata = [];
            if (isArray(xy[0]) && xy[0].length === 2) {
                xy.forEach(function (xy) {
                    xydata.push({x: x(xy[0]), y: y(xy[1])});
                });
            } else {
                var xl = data.xlabel || 'x',
                    yl = data.ylabel || 'y';
                xy.forEach(function (xy) {
                    xydata.push({x: x(xy[xl]), y: y(xy[yl])});
                });
            }
            data.data = xydata;
            data.xrange = [xmin, xmax];
            data.yrange = [ymin, ymax];
            return data;
        };

        // pick a unique color, never picked before
        paper.pickColor = function (index, darker) {
            if (arguments.length === 0) index = color++;
            var dk = 1,
                k = 0;
            while (index >= p.colors.length) {
                index -= p.colors.length;
                k += dk;
            }
            var c = p.colors[index];
            if (darker)
                c = d3.rgb(c).darker(darker);
            if (k)
                c = d3.rgb(c).brighter(k);
            return c;
        };

        paper.clear = function () {
            color = 0;
            return paper;
        };

        // Access internal options
        paper.options = function () {
            return p;
        };

        // Auto resize the paper
        if (p.resize) {
            //
            d3.select(window).on('resize.paper', function () {
                if (!p._resizing) {
                    if (p.resizeDelay) {
                        p._resizing = true;
                        d3.timer(function () {
                            paper.resize();
                            return true;
                        }, p.resizeDelay);
                    } else {
                        paper.resize();
                    }
                }
            });
        }

        return _initPaper(paper, p);
    };

    //
    //  Paper can be svg or canvas
    //  This function create a paper type with support for plugins
    g.paper.addType = function (type, constructor) {
        var plugins = [];

        g.paper[type] = function (paper, opts) {
            constructor(paper, opts);

            // Inject plugins
            for (var i=0; i < plugins.length; ++i)
                plugins[i](paper, opts);

            return paper;
        };

        g.paper[type].plugin = function (name, defaults, plugin) {
            g.defaults.paper[name] = defaults;
            plugins.push(plugin);
        };

    };

    //
    //  SVG Paper
    //  ================
    //
    g.paper.addType('svg', function (paper, p) {
        var svg = paper.element().append('svg')
                        .attr('class', 'giotto')
                        .attr('id', 'giotto-paper-' + paper.uid())
                        .attr('width', p.size[0])
                        .attr('height', p.size[1])
                        .attr("viewBox", "0 0 " + p.size[0] + " " + p.size[1]),
            clear = paper.clear,
            components,
            componentMap,
            cidCounter,
            current;

        p.xAxis = d3.svg.axis();
        p.yAxis = [d3.svg.axis(), d3.svg.axis()];

        paper.destroy = function () {
            svg = current = null;
            paper.element().selectAll('*').remove();
            return paper;
        };

        paper.refresh = function (size) {
            if (size) {
                p.size = size;
                svg.attr('width', p.size[0])
                   .attr('height', p.size[1]);
            }
            return paper;
        };

        //  Render the paper by executing all components
        //  If a component id is provided, render only the matching
        //  component
        paper.render = function (cid) {
            if (!arguments.length)
                components.forEach(function (callback) {
                    callback();
                });
            else if (componentMap[cid])
                componentMap[cid]();
        };

        paper.clear = function () {
            components = [];
            componentMap = {};
            cidCounter = 0;
            svg.selectAll('*').remove();
            current = svg.append('g')
                        .attr("transform", "translate(" + p.margin.left + "," + p.margin.top + ")")
                        .attr('class', 'paper');
            return clear();
        };

        // return the current svg element
        paper.current = function () {
            return current;
        };

        // set the current element to be the root svg element and returns the paper
        paper.root = function () {
            current = svg.select('g.paper');
            return paper;
        };

        // set the current element to be the parent and returns the paper
        paper.parent = function () {
            var node = current.node().parentNode;
            if (node !== svg.node())
                current = d3.select(node);
            return paper;
        };

        paper.on = function (event, callback) {
            current.on(event, function () {
                callback.call(this);
            });
            return paper;
        };

        paper.group = function (attr) {
            current = current.append('g');
            if (attr)
                current.attr(attr);
            return current;
        };

        paper.circle = function (cx, cy, r) {
            cx = paper.scalex(cx);
            cy = paper.scaley(cy);
            r = paper.scale(r);
            return current.append('circle')
                            .attr('cx', cx)
                            .attr('cy', cy)
                            .attr('r', r);
        };

        paper.rect = function (x, y, width, height, r) {
            var X = paper.scalex(x),
                Y = paper.scaley(y);
            width = paper.scalex(x+width) - X;
            height = paper.scalex(y+height) - Y;
            var rect = current.append('rect')
                                .attr('x', X)
                                .attr('y', Y)
                                .attr('width', width)
                                .attr('height', height);
            if (r) {
                var rx = paper.scalex(r) - paper.scalex(0),
                    ry = paper.scaley(r) - paper.scaley(0);
                rect.attr('rx', rx).attr('ry', rt);
            }
            return rect;
        };

        // Draw a path or an area, data must be an xy array [[x1,y1], [x2, y2], ...]
        paper.path = function (data, opts) {
            opts || (opts = {});
            copyMissing(p.line, opts);

            var container = current;

            return paper.addComponent(function () {

                var chart = container.select("path.line"),
                    scalex = paper.scalex,
                    scaley = paper.scaley,
                    line = opts.area ? d3.svg.area() : d3.svg.line();

                if (!opts.color)
                    opts.color = paper.pickColor();

                line.interpolate(opts.interpolate)
                    .x(function(d) {
                        return scalex(d.x);
                    })
                    .y(function(d) {
                        return scaley(d.y);
                    });

                if (!chart.node())
                    chart = container.append('path')
                                        .attr('class', 'line');

                chart
                    .classed('area', opts.area)
                    .attr('stroke', opts.color)
                    .attr('stroke-width', opts.lineWidth)
                    .datum(data)
                    .attr('d', line);

                opts.chart = chart;
                return opts;
            });
        };

        // Draw points
        paper.points = function (data, opts) {
            opts || (opts = {});
            copyMissing(p.point, opts);

            var container = current;

            return paper.addComponent(function () {
                var chart = container.select("g.points"),
                    scalex = paper.scalex,
                    scaley = paper.scaley,
                    symbol = d3.svg.symbol().type(function (d) {
                        return d.symbol || opts.symbol;
                    }).size(pointSize(paper, opts)),
                    points;

                chartColors(paper, data, opts);

                if (!chart.node()) {
                    chart = container.append("g")
                                    .attr('class', 'points');

                    points = chart.selectAll("path.point")
                                .data(data)
                                .enter()
                                .append("path")
                                .attr('class', 'point');

                } else
                    points = chart.selectAll("path.point");

                chart.attr('stroke', opts.color)
                        .attr('stroke-width', opts.lineWidth)
                        .attr('fill', opts.fill)
                        .attr('fill-opacity', opts.fillOpacity);

                points
                    .attr("transform", function(d) {
                        return "translate(" + scalex(d.x) + "," + scaley(d.y) + ")";
                    })
                    .attr('d', symbol);

                opts.chart = chart;
                return opts;
            });
        };

        // Draw a barchart
        paper.barchart = function (data, opts) {
            opts || (opts = {});
            copyMissing(p.bar, opts);

            var container = current;

            return paper.addComponent(function () {

                var scalex = paper.scalex,
                    scaley = paper.scaley,
                    width = barWidth(paper, data, opts),
                    zero = scaley(0),
                    chart = container.select('g.barchart');

                if (!chart.node())
                    chart = container.append("g")
                                .attr('class', 'barchart');

                var bar = chart
                        .attr('stroke', opts.color)
                        .attr('stroke-width', opts.lineWidth)
                        .attr('fill', opts.fill)
                        .selectAll(".bar")
                        .data(data)
                        .enter().append("rect")
                        .attr('class', 'bar')
                        .attr("x", function(d) {
                            return scalex(d.x) - width/2;
                        })
                        .attr("y", function(d) {return d.y < 0 ? zero : scaley(d.y); })
                        .attr("height", function(d) { return d.y < 0 ? scaley(d.y) - zero : zero - scaley(d.y); })
                        .attr("width", width);

                if (opts.radius > 0)
                    bar.attr('rx', opts.radius).attr('ry', opts.radius);

                opts.chart = chart;
                return opts;
            });
        };

        paper.pie = function (data, opts) {
            opts || (opts = {});
            copyMissing(p.pie, opts);

            var container = current;

            return paper.addComponent(function () {

                var scalex = paper.scalex,
                    scaley = paper.scaley,
                    width = paper.innerWidth(),
                    height = paper.innerHeight(),
                    radius = 0.5*Math.min(width, height),
                    innerRadius = opts.innerRadius*radius,
                    cornerRadius = paper.dim(opts.cornerRadius),
                    pie = d3.layout.pie()
                        .value(function (d, i) {
                            return d.length > 1 ? d[1] : d[0];
                        }),
                        //.padAngle(opts.padAngle),
                    chart = container.select('g.pie'),
                    arc = d3.svg.arc()
                            //.padRadius(radius)
                            //.cornerRadius(cornerRadius)
                            .innerRadius(innerRadius)
                            .outerRadius(radius),
                    c;

                if (!chart.node())
                    chart = container.append("g")
                                .attr('class', 'pie')
                                //.style('shape-rendering', 'crispEdges')
                                .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

                var piechart = chart
                        .attr('stroke-width', opts.lineWidth)
                        .attr('fill-opacity', opts.fillOpacity)
                        .selectAll(".slice")
                        .data(pie(data))
                        .enter().append("path")
                        .attr('class', 'slice')
                        .attr('stroke', function (d, i) {
                            return paper.pickColor(i, 1);
                        })
                        .attr('fill', function (d, i) {
                            return paper.pickColor(i);
                        })
                        .attr('d', arc);
            });
        };

        paper.drawXaxis = function () {
            var opts = p.xaxis,
                py = opts.position === 'top' ? 0 : paper.innerHeight();
            return _axis(p.xAxis, 'x-axis', 0, py, opts);
        };

        paper.drawYaxis = function () {
            var yaxis = paper.yaxis(),
                opts = yaxis === 1 ? p.yaxis : p.yaxis2,
                px = opts.position === 'left' ? 0 : paper.innerWidth();
            return _axis(paper.yAxis(), 'y-axis-' + yaxis, px, 0, opts);
        };

        paper.setBackground = function (o, background) {
            if (_.isObject(background)) {
                if (background.opacity !== undefined)
                    o.attr('fill-opacity', background.opacity);
                background = background.color;
            }
            if (_.isString(background))
                o.attr('fill', background);

            return paper;
        };

        // Create a gradient element to use by scg elements
        paper.gradient = function (id, color1, color2) {
            var svg = d3.select("body").append("svg"),
                gradient = svg.append('linearGradient')
                            .attr("x1", "0%")
                            .attr("x2", "100%")
                            .attr("y1", "0%")
                            .attr("y2", "100%")
                            .attr("id", id)
                            .attr("gradientUnits", "userSpaceOnUse");
            gradient
                .append("stop")
                .attr("offset", "0")
                .attr("stop-color", color1);

            gradient
                .append("stop")
                .attr("offset", "0.5")
                .attr("stop-color", color2);
        };

        paper.encode = function () {
            return btoa(unescape(encodeURIComponent(
                svg.attr("version", "1.1")
                    .attr("xmlns", "http://www.w3.org/2000/svg")
                    .node().parentNode.innerHTML)));
        };

        paper.downloadSVG = function (e) {
            var data = "data:image/svg+xml;charset=utf-8;base64," + paper.encode();
            d3.select(e.target).attr("href", data);
        };

        paper.downloadPNG = function (e) {
            if (!g.cloudConvertApiKey)
                return;

            var params = {
                apikey: g.cloudConvertApiKey,
                inputformat: 'svg',
                outputformat: 'png'
            };

            var blob = new Blob(['base64,',paper.encode()], {type : 'image/svg+xml;charset=utf-8'});

            d3.xhr('https://api.cloudconvert.org/process?' + encodeObject(params))
                .header('content-type', 'multipart/form-data')
                .post(submit);

            function submit(_, request) {
                if (!request || request.status !== 200)
                    return;
                var data = JSON.parse(request.responseText);
                d3.xhr(data.url)
                    .post(encodeObject({
                        input: 'upload',
                        file: blob
                    }, 'multipart/form-data'), function (r, request) {
                        if (!request || request.status !== 200)
                            return;
                        data = JSON.parse(request.responseText);
                        wait_for_data(data);
                    });
            }

            function wait_for_data (data) {
                d3.xhr(data.url, function (r, request) {
                    if (!request || request.status !== 200)
                        return;
                    data = JSON.parse(request.responseText);
                    if (data.step === 'finished')
                        download(data.output);
                    else if (data.step === 'error')
                        error(data);
                    else
                        wait_for_data(data);
                });
            }

            function error (data) {

            }

            function download(data) {
                d3.select(e.target).attr("href", data.url + '?inline');
            }
        };

        // LOW LEVEL FUNCTIONS - MAYBE THEY SHOULD BE PRIVATE?

        // Add a new component to the paper and return the component id
        paper.addComponent = function (callback) {
            var cid = ++cidCounter;
            components.push(callback);
            componentMap[cid] = callback;
            return cid;
        };

        paper.removeComponent = function (cid) {
            if (!cid) return;
            var callback = componentMap[cid];
            if (callback) {
                delete componentMap[cid];
                var index = components.indexOf(callback);
                if (index > -1)
                    return components.splice(index, 1)[0];
            }
        };

        // PRIVATE FUNCTIONS

        function _axis(axis, cn, px, py, opts) {
            var font = opts.font,
                g = paper.root().current().select('g.' + cn);
            if (!g.node()) {
                g = _font(paper.current().append('g')
                            .attr("class", "axis " + cn)
                            .attr("transform", "translate(" + px + "," + py + ")")
                            .attr('stroke', opts.color), opts.font);
                paper.addComponent(function () {
                    g.call(axis);
                });
            }
        }

        function _font(element, opts) {
            var font = p.font;
            opts || (opts = {});
            return element.style({
                'font-size': opts.size || font.size,
                'font-weight': opts.weight || font.weight,
                'font-style': opts.style || font.style,
                'font-family': opts.family || font.family,
                'font-variant': opts.variant || font.variant
            });
        }
    });

    //
    g.viz = {};
    //
    // Factory of Giotto visualization factories
    //  name: name of the visualization constructor, the constructor is
    //        accessed via the giotto.viz object
    //  defaults: object of default parameters
    //  constructor: function called back with a visualization object
    //               and an object containing options for the visualization
    //  returns a functyion which create visualization of the ``name`` family
    g.createviz = function (name, defaults, constructor) {

        // The visualization factory
        var plugins = [],
            vizType = function (element, opts) {

            if (isObject(element)) {
                opts = element;
                element = null;
            }
            opts = extend({}, vizType.defaults, opts);

            var viz = {},
                event = d3.dispatch.apply(d3, opts.events),
                alpha = 0,
                loading_data = false,
                paper;

            opts.event = event;

            // Return the visualization type (a function)
            viz.vizType = function () {
                return vizType;
            };

            viz.vizName = function () {
                return vizType.vizName();
            };

            viz.paper = function (createNew) {
                if (createNew || paper === undefined) {
                    if (paper)
                        paper.destroy();
                    paper = g.paper(element, opts);
                }
                return paper;
            };

            viz.element = function () {
                return viz.paper().element();
            };

            viz.clear = function () {
                viz.paper().clear();
                return viz;
            };

            viz.alpha = function(x) {
                if (!arguments.length) return alpha;

                x = +x;
                if (alpha) { // if we're already running
                    if (x > 0) alpha = x; // we might keep it hot
                    else alpha = 0; // or, next tick will dispatch "end"
                } else if (x > 0) { // otherwise, fire it up!
                    event.start({type: "start", alpha: alpha = x});
                    d3.timer(viz.tick);
                }

                return viz;
            };

            viz.resume = function() {
                return viz.alpha(0.1);
            };

            viz.stop = function() {
                return viz.alpha(0);
            };

            viz.tick = function() {
                if (opts.scope && opts.scope.stats)
                    opts.scope.stats.begin();

                // simulated annealing, basically
                if ((alpha *= 0.99) < 0.005) {
                    event.end({type: "end", alpha: alpha = 0});
                    return true;
                }

                event.tick({type: "tick", alpha: alpha});

                if (opts.scope && opts.scope.stats)
                    opts.scope.stats.end();
            };

            // Starts the visualization
            viz.start = function () {
                return viz.resume();
            };

            // render the visualization by invoking the render method of the paper
            viz.render = function () {
                paper.render();
                return viz;
            };

            viz.loadData = function (callback) {
                if (opts.src && !loading_data) {
                    loading_data = true;
                    g.log.info('Giotto loading data from ' + opts.src);
                    return d3.json(opts.src, function(error, json) {
                        loading_data = false;
                        if (!error) {
                            viz.setData(json, callback);
                        }
                    });
                }
            };

            //
            // Set new data for the visualization
            viz.setData = function (data, callback) {
                if (opts.processData)
                    data = opts.processData(data);
                if (Object(data) === data && data.data)
                    extend(opts, data);
                else
                    opts.data = data;
                if (callback)
                    callback();
            };

            // returns the options object
            viz.options = function () {
                return opts;
            };

            viz.xyfunction = g.math.xyfunction;

            d3.rebind(viz, event, 'on');

            // If constructor available, call it first
            if (constructor)
                constructor(viz, opts);

            // Inject visualization plugins
            for (var i=0; i < plugins.length; ++i)
                plugins[i](viz, opts);

            // if the onInit callback available, execute it
            if (opts.onInit) {
                var init = getObject(opts.onInit);
                if (isFunction(init))
                    init(viz, opts);
                else
                    g.log.error('Could not locate onInit function ' + opts.onInit);
            }

            return viz;
        };

        g.viz[name] = vizType;

        vizType.defaults = extend({}, g.defaults.viz, g.defaults.paper, defaults);

        vizType.vizName = function () {
            return name;
        };

        vizType.plugin = function (callback) {
            plugins.push(callback);
        };

        return vizType;
    };


    g.crossfilter = function (options) {
        var cf = {
            dims: {},
            tolerance: options.tolerance === undefined ? g.crossfilter.tolerance : options.tolerance
        };

        // Add a new dimension to the crossfilter
        cf.addDimension = function (name, callback) {
            if (!callback) {
                callback = function (d) {
                    return d[name];
                };
            }
            cf.dims[name] = cf.data.dimension(callback);
        };

        // Reduce the number of points by using a K-mean clustering algorithm
        cf.reduceDensity = function (dimension, points, start, end) {
            var count = 0,
                dim = cf.dims[dimension],
                group;

            if (!dim)
                throw Error('Cross filter dimension "' + dimension + '"" not available. Add it with the addDimension method');

            if (start === undefined) start = null;
            if (end === undefined) end = null;

            if (start === null && end === null)
                group = dim.filter();
            else
                group = dim.filter(function (d) {
                    if (start !== null && d < start) return;
                    if (end !== null && d > end) return;
                    return true;
                });

            var all = group.bottom(Infinity);

            if (all.length > cf.tolerance*points) {
                var km = g.math.kmeans(),
                    reduced = [],
                    cl = [],
                    centroids = [],
                    r = all.length / points,
                    index, i, c;

                // Create the input for the k-means algorithm
                for (i=0; i<all.length; i++)
                    cl.push([all[i][dimension]]);

                for (i=0; i<points; i++) {
                    centroids.push(cl[Math.round(i*r)]);
                }

                km.centroids(centroids).maxIters(10);

                cl = km.cluster(cl).sort(function (a, b) {
                    return a.centroid[0] - b.centroid[0];
                });

                cl.forEach(function (d) {
                    index = d.indices[0];
                    c = d.points[0];
                    for (i=1; i<d.points.length; ++i) {
                        if (d.points[i] > c) {
                            index = d.indices[i];
                            c = d.points[i];
                        }
                    }
                    reduced.push(all[index]);
                });
                all = reduced;
            }

            return all;
        };


        function build () {
            if (!g.crossfilter.lib)
                throw Error('Could not find crossfilter library');

            cf.data = g.crossfilter.lib(options.data);

            if (g._.isArray(options.dimensions))
                options.dimensions.forEach(function (o) {
                    cf.addDimension(o);
                });

            if (options.callback)
                options.callback(cf);
        }

        if (g.crossfilter.lib === undefined)
            if (typeof crossfilter === 'undefined') {
                g.require(['crossfilter'], function (crossfilter) {
                    g.crossfilter.lib = crossfilter || null;
                    build();
                });
                return cf;
            }
            else {
                g.crossfilter.lib = crossfilter;
            }

        build();
        return cf;
    };

    g.crossfilter.tolerance = 1.1;


    function chartColors (paper, data, opts) {
        if (!opts.color)
            opts.color = paper.pickColor();

        if (opts.fill === true)
            opts.fill = d3.rgb(opts.color).brighter();
    }

    function barWidth (paper, data, opts) {
        chartColors(paper, data, opts);

        if (opts.width === 'auto')
            return d3.round(0.8*(paper.innerWidth() / data.length));
        else
            return opts.width;
    }

    function pointSize (paper, opts) {
        var scale = paper.scale,
            size = paper.dim(opts.size),
            fraction = {
                circle: 0.7,
                cross: 0.7,
                diamond: 0.7,
                "triangle-up": 0.6,
                "triangle-down": 0.6
            }, type, s;

        return function (d) {
            type = d.symbol || opts.symbol;
            s = d.size === undefined ? size : d.size;

            if (type === 'circle' && d.radius !== undefined)
                s = 2*d.radius;
            s = scale(s);
            return s*s*(fraction[type] || 1);
        };
    }

    //
    //  Initaise paper
    function _initPaper (paper, p) {
        //
        // Apply paper type
        g.paper[p.type](paper, p);

        // clear the paper
        paper.clear();
        _reset_axis(paper);

        var width = paper.innerWidth(),
            height = paper.innerHeight(),
            allAxis = [{axis: paper.xAxis(), o: p.xaxis},
                       {axis: paper.yaxis(2).yAxis(), o: p.yaxis2},
                       {axis: paper.yaxis(1).yAxis(), o: p.yaxis}];

        allAxis.forEach(function (a) {
            var axis = a.axis, o = a.o;
            axis.orient(o.position);
            if (o.min !== null && o.max !== null)
                axis.scale().domain([o.min, o.max]);
            else
                o.auto = true;
        });
        //
        if (p.css)
            addCss('#giotto-paper-' + paper.uid(), p.css);
        //
        return paper;
    }

    function _reset_axis (paper) {
        var yaxis = paper.yaxis();
        paper.xAxis().scale().range([0, paper.innerWidth()]);
        paper.yaxis(2).yAxis().scale().range([paper.innerHeight(), 0]);
        paper.yaxis(1).yAxis().scale().range([paper.innerHeight(), 0]);
        return paper.yaxis(yaxis);
    }


    function _newPaperAttr (element, cfg) {
        var width, height;

        if (cfg) {
            width = cfg.width;
            height = cfg.height;
            cfg = pick(cfg, function (value, key) {
                if (g.defaults.paper[key] !== undefined)
                    return value;
            });
        }
        else
            cfg = {};

        var p = extend(true, {}, g.defaults.paper, cfg);

        if (!width) {
            width = getWidth(element);
            if (width)
                p.elwidth = getWidthElement(element);
            else
                width = g.constants.WIDTH;
        }

        if (!height) {
            height = getHeight(element);
            if (height)
                p.elheight = getHeightElement(element);
            else
                height = g.constants.HEIGHT;
        }
        else if (typeof(height) === "string" && height.indexOf('%') === height.length-1) {
            p.height_percentage = 0.01*parseFloat(height);
            height = d3.round(p.height_percentage*width);
        }

        p.size = [width, height];
        return p;
    }

    var drawArc = d3.canvas.drawArc = function (ctx, xyfrom, xyto, radius, laf, sweep) {
        var dx = xyfrom[0] - xyto[0],
            dy = xyfrom[1] - xyto[1],
            q2 = dx*dx + dy*dy,
            q = Math.sqrt(q2),
            xc = 0.5*(xyfrom[0] + xyto[0]),
            yc = 0.5*(xyfrom[1] + xyto[1]),
            l =  Math.sqrt(radius*radius - 0.25*q2);
        if (sweep > 0) {
            xc += l*dy/q;
            yc -= l*dx/q;
        } else {
            xc -= l*dy/q;
            yc += l*dx/q;
        }
        var a1 = Math.atan2(xyfrom[1]-yc, xyfrom[0]-xc),
            a2 = Math.atan2(xyto[1]-yc, xyto[0]-xc);
        ctx.arc(xc, yc, radius, a1, a2, sweep<=0);
    };

    // same as d3.svg.arc... but for canvas
    d3.canvas.arc = function() {
        var innerRadius = d3_svg_arcInnerRadius,
        outerRadius = d3_svg_arcOuterRadius,
        cornerRadius = d3_zero,
        padRadius = d3_svg_arcAuto,
        startAngle = d3_svg_arcStartAngle,
        endAngle = d3_svg_arcEndAngle,
        padAngle = d3_svg_arcPadAngle,
        ctx;

        function arc () {
            var r0 = Math.max(0, +innerRadius.apply(arc, arguments)),
                r1 = Math.max(0, +outerRadius.apply(arc, arguments)),
                a0 = startAngle.apply(arc, arguments) - halfπ,
                a1 = endAngle.apply(arc, arguments) - halfπ,
                da = Math.abs(a1 - a0),
                cw = a0 > a1 ? 0 : 1;

            // Ensure that the outer radius is always larger than the inner radius.
            if (r1 < r0) rc = r1, r1 = r0, r0 = rc;

            ctx.beginPath();

            // Special case for an arc that spans the full circle.
            if (da >= τε) {
                ctx.arc(0, 0, r1, 0, τ, false);
                if (r0)
                    ctx.arc(0, 0, r0, 0, τ, true);
                ctx.closePath();
                return;
            }

            var rc,
                cr,
                rp,
                laf,
                l0,
                l1,
                ap = (+padAngle.apply(arc, arguments) || 0) / 2,
                p0 = 0,
                p1 = 0,
                x0 = null,
                y0 = null,
                x1 = null,
                y1 = null,
                x2 = null,
                y2 = null,
                x3 = null,
                y3 = null,
                path = [];

            // The recommended minimum inner radius when using padding is outerRadius *
            // padAngle / sin(θ), where θ is the angle of the smallest arc (without
            // padding). For example, if the outerRadius is 200 pixels and the padAngle
            // is 0.02 radians, a reasonable θ is 0.04 radians, and a reasonable
            // innerRadius is 100 pixels.

            if (ap) {
                rp = padRadius === d3_svg_arcAuto ? Math.sqrt(r0 * r0 + r1 * r1) : +padRadius.apply(arc, arguments);
                if (!cw) p1 *= -1;
                if (r1) p1 = d3_asin(rp / r1 * Math.sin(ap));
                if (r0) p0 = d3_asin(rp / r0 * Math.sin(ap));
            }

            // Compute the two outer corners.
            if (r1) {
                x0 = r1 * Math.cos(a0 + p1);
                y0 = r1 * Math.sin(a0 + p1);
                x1 = r1 * Math.cos(a1 - p1);
                y1 = r1 * Math.sin(a1 - p1);

                // Detect whether the outer corners are collapsed.
                l1 = Math.abs(a1 - a0 - 2 * p1) <= π ? 0 : 1;
                if (p1 && d3_svg_arcSweep(x0, y0, x1, y1) === cw ^ l1) {
                    var h1 = (a0 + a1) / 2;
                    x0 = r1 * Math.cos(h1);
                    y0 = r1 * Math.sin(h1);
                    x1 = y1 = null;
                }
            } else {
                x0 = y0 = 0;
            }

            // Compute the two inner corners.
            if (r0) {
                x2 = r0 * Math.cos(a1 - p0);
                y2 = r0 * Math.sin(a1 - p0);
                x3 = r0 * Math.cos(a0 + p0);
                y3 = r0 * Math.sin(a0 + p0);

                // Detect whether the inner corners are collapsed.
                l0 = Math.abs(a0 - a1 + 2 * p0) <= π ? 0 : 1;
                if (p0 && d3_svg_arcSweep(x2, y2, x3, y3) === (1 - cw) ^ l0) {
                    var h0 = (a0 + a1) / 2;
                    x2 = r0 * Math.cos(h0);
                    y2 = r0 * Math.sin(h0);
                    x3 = y3 = null;
                }
            } else
                x2 = y2 = 0;

            // Compute the rounded corners.
            if ((rc = Math.min(Math.abs(r1 - r0) / 2, +cornerRadius.apply(arc, arguments))) > 1e-3) {
                cr = r0 < r1 ^ cw ? 0 : 1;

                // Compute the angle of the sector formed by the two sides of the arc.
                var oc = x3 === null ? [x2, y2] : x1 === null ? [x0, y0] : d3_geom_polygonIntersect([x0, y0], [x3, y3], [x1, y1], [x2, y2]),
                    ax = x0 - oc[0],
                    ay = y0 - oc[1],
                    bx = x1 - oc[0],
                    by = y1 - oc[1],
                    kc = 1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2),
                    lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);

                // Compute the outer corners.
                if (x1 !== null) {
                    var rc1 = Math.min(rc, (r1 - lc) / (kc + 1)),
                        t30 = d3_svg_arcCornerTangents(x3 === null ? [x2, y2] : [x3, y3], [x0, y0], r1, rc1, cw),
                        t12 = d3_svg_arcCornerTangents([x1, y1], [x2, y2], r1, rc1, cw);

                    // Detect whether the outer edge is fully circular.
                    if (rc === rc1) {
                        laf = (1 - cw) ^ d3_svg_arcSweep(t30[1][0], t30[1][1], t12[1][0], t12[1][1]);
                        drawArc(ctx, t30[0], t30[1], rc1, 0, cr);
                        drawArc(ctx, t30[1], t12[1], r1, laf, cw);
                        drawArc(ctx, t12[1], t12[0], rc1, 0, cr);
                        ctx.moveTo(t12[0][0], t12[0][1]);
                    } else {
                        drawArc(ctx, t30[0], t12[0], rc1, 1, cr);
                        ctx.moveTo(t12[0][0], t12[0][1]);
                    }
                } else
                    ctx.moveTo(x0, y0);

                // Compute the inner corners.
                if (x3 !== null) {
                    var rc0 = Math.min(rc, (r0 - lc) / (kc - 1)),
                        t03 = d3_svg_arcCornerTangents([x0, y0], [x3, y3], r0, -rc0, cw),
                        t21 = d3_svg_arcCornerTangents([x2, y2], x1 === null ? [x0, y0] : [x1, y1], r0, -rc0, cw);

                    // Detect whether the inner edge is fully circular.
                    ctx.lineTo(t21[0][0], t21[0][1]);
                    if (rc === rc0) {
                        laf = cw ^ d3_svg_arcSweep(t21[1][0], t21[1][1], t03[1][0], t03[1][1]);
                        ctx.lineTo(t21[0][0], t21[0][1]);
                        drawArc(ctx, t21[0], t21[1], rc0, 0, cr);
                        drawArc(ctx, t21[1], t03[1], r0, laf, 1 - cw);
                        drawArc(ctx, t03[1], t03[0], rc0, 0, cr);
                    } else
                        drawArc(ctx, t21[0], t03[0], rc0, 0, cr);
                    ctx.moveTo(t03[0][0], t03[0][1]);
                } else
                    ctx.lineTo(x2, y2);
            }

            // Compute straight corners.
            else {
                //ctx.moveTo(x0, y0);
                if (x1 !== null) {
                    drawArc(ctx, [x0, y0], [x1, y1], r1, l1, cw);
                    //ctx.moveTo(x1, y1);
                }
                ctx.lineTo(x2, y2);
                if (x3 !== null) {
                    drawArc(ctx, [x2, y2], [x3, y3], r0, l0, 1 - cw);
                    //ctx.moveTo(x3, y3);
                }
            }

            ctx.closePath();
        }

        arc.context = function (_) {
            if (!arguments.length) return ctx;
            ctx = _;
            return arc;
        };

        arc.innerRadius = function (v) {
            if (!arguments.length) return innerRadius;
            innerRadius = d3_functor(v);
            return arc;
        };

        arc.outerRadius = function (v) {
            if (!arguments.length) return outerRadius;
            outerRadius = d3_functor(v);
            return arc;
        };

        arc.cornerRadius = function (v) {
            if (!arguments.length) return cornerRadius;
            cornerRadius = d3_functor(v);
            return arc;
        };

        arc.padRadius = function (v) {
            if (!arguments.length) return padRadius;
            padRadius = v == d3_svg_arcAuto ? d3_svg_arcAuto : d3_functor(v);
            return arc;
        };

        arc.startAngle = function(v) {
            if (!arguments.length) return startAngle;
            startAngle = d3_functor(v);
            return arc;
        };

        arc.endAngle = function(v) {
            if (!arguments.length) return endAngle;
            endAngle = d3_functor(v);
            return arc;
        };

        arc.padAngle = function(v) {
            if (!arguments.length) return padAngle;
            padAngle = d3_functor(v);
            return arc;
        };

        arc.centroid = function() {
            var r = (+innerRadius.apply(arc, arguments) + outerRadius.apply(arc, arguments)) / 2,
                a = (+startAngle.apply(arc, arguments) + endAngle.apply(arc, arguments)) / 2 - halfπ;
            return [Math.cos(a) * r, Math.sin(a) * r];
        };

        return arc;
    };



    d3.canvas.axis = function() {
        var scale = d3.scale.linear(),
            orient = d3_canvas_axisDefaultOrient,
            innerTickSize = 6,
            outerTickSize = 6,
            tickPadding = 3,
            tickArguments_ = [10],
            tickValues = null,
            tickFormat_ = null,
            lineColor_,
            lineWidth = 1,
            font = g.defaults.paper.font;

        function axis (canvas) {
            canvas.each(function() {
                var ctx = this.canvas.getContext('2d');

                var scale0 = this.__chart__ || scale,
                    scale1 = this.__chart__ = scale.copy();

                // Ticks, or domain values for ordinal scales.
                var ticks = tickValues === null ? (scale1.ticks ? scale1.ticks.apply(scale1, tickArguments_) : scale1.domain()) : tickValues,
                    tickFormat = tickFormat_ === null ? (scale1.tickFormat ? scale1.tickFormat.apply(scale1, tickArguments_) : d3_identity) : tickFormat_,
                    tick = g.selectAll(".tick").data(ticks, scale1),
                    tickSpacing = Math.max(innerTickSize, 0) + tickPadding,
                    lineColor = lineColor_ || font.color,
                    tickTransform;

                // Domain.
                var range = d3_scaleRange(scale1);

                ctx.fillStyle = font.color;
                ctx.font = font.family;
                // Apply axis labels on major ticks
                if (orient === "bottom" || orient === "top") {
                    ticks.forEach(function (tick, index) {
                        ctx.beginPath();
                        ctx.lineWidth = lineWidth;
                        ctx.strokeStyle = lineColor;
                        ctx.moveTo(xStart, linePositionY);
                        ctx.lineTo(this.width, linePositionY);
                        ctx.stroke();
                        ctx.closePath();
                    });
                } else {
                    ticks.forEach(function (tick, index) {
                        ctx.beginPath();
                        ctx.lineWidth = lineWidth;
                        ctx.strokeStyle = lineColor;
                        ctx.moveTo(xStart, linePositionY);
                        ctx.lineTo(this.width, linePositionY);
                        ctx.stroke();
                        ctx.closePath();
                    });
                }
            });
        }

        axis.scale = function(x) {
            if (!arguments.length) return scale;
            scale = x;
            return axis;
        };

        axis.orient = function(x) {
            if (!arguments.length) return orient;
            orient = x in d3_canvas_axisOrients ? x + "" : d3_canvas_axisDefaultOrient;
            return axis;
        };

        axis.ticks = function() {
            if (!arguments.length) return tickArguments_;
            tickArguments_ = arguments;
            return axis;
        };

        axis.tickValues = function(x) {
            if (!arguments.length) return tickValues;
            tickValues = x;
            return axis;
        };

        axis.tickFormat = function(x) {
            if (!arguments.length) return tickFormat_;
            tickFormat_ = x;
            return axis;
        };

        axis.tickSize = function(x) {
            var n = arguments.length;
            if (!n) return innerTickSize;
            innerTickSize = +x;
            outerTickSize = +arguments[n - 1];
            return axis;
        };

        axis.innerTickSize = function(x) {
            if (!arguments.length) return innerTickSize;
            innerTickSize = +x;
            return axis;
        };

        axis.outerTickSize = function(x) {
            if (!arguments.length) return outerTickSize;
            outerTickSize = +x;
            return axis;
        };

        axis.tickPadding = function(x) {
            if (!arguments.length) return tickPadding;
            tickPadding = +x;
            return axis;
        };

        axis.tickSubdivide = function() {
            return arguments.length && axis;
        };

        return axis;
    };

    var d3_canvas_axisDefaultOrient = "bottom",
        d3_canvas_axisOrients = {top: 1, right: 1, bottom: 1, left: 1};

    function d3_canvas_axisX(selection, x0, x1) {
        selection.attr("transform", function(d) { var v0 = x0(d); return "translate(" + (isFinite(v0) ? v0 : x1(d)) + ",0)"; });
    }

    function d3_canvas_axisY(selection, y0, y1) {
        selection.attr("transform", function(d) { var v0 = y0(d); return "translate(0," + (isFinite(v0) ? v0 : y1(d)) + ")"; });
    }


    d3.canvas.retinaScale = function(ctx, width, height){
        ctx.canvas.width = width;
        ctx.canvas.height = height;

        if (window.devicePixelRatio) {
            ctx.canvas.style.width = width + "px";
            ctx.canvas.style.height = height + "px";
            ctx.canvas.width = width * window.devicePixelRatio;
            ctx.canvas.height = height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
        return window.devicePixelRatio || 1;
    };

    // same as d3.svg.line... but for canvas
    d3.canvas.line = function() {
        return d3_canvas_line(d3_identity);
    };


    function d3_canvas_line (projection) {
        var x = d3_geom_pointX,
            y = d3_geom_pointY,
            defined = d3_true,
            interpolate = d3_canvas_lineLinear,
            interpolateKey = interpolate.key,
            tension = 0.7,
            ctx;

        function line (data) {
            if (!ctx) return;

            var segments = [],
                points = [],
                i = -1,
                n = data.length,
                d,
                fx = d3_functor(x),
                fy = d3_functor(y);

            function segment () {
                interpolate(ctx, projection(points), tension);
            }

            while (++i < n) {
                if (defined.call(line, d = data[i], i)) {
                    points.push([+fx.call(line, d, i), +fy.call(line, d, i)]);
                } else if (points.length) {
                    segment();
                    points = [];
                }
            }

            if (points.length) segment();

            return segments.length ? segments.join("") : null;
        }

        line.context = function (_) {
            if (!arguments.length) return ctx;
            ctx = _;
            return line;
        };

        line.x = function(_) {
            if (!arguments.length) return x;
            x = _;
            return line;
        };

        line.y = function(_) {
            if (!arguments.length) return y;
            y = _;
            return line;
        };

        line.defined  = function(_) {
            if (!arguments.length) return defined;
            defined = _;
            return line;
        };

        line.interpolate = function(_) {
            if (!arguments.length) return interpolateKey;
            if (typeof _ === "function") interpolateKey = interpolate = _;
            else interpolateKey = (interpolate = d3_canvas_lineInterpolators.get(_) || d3_canvas_lineLinear).key;
            return line;
        };

        line.tension = function(_) {
            if (!arguments.length) return tension;
            tension = _;
            return line;
        };

        return line;
    }


    var d3_canvas_lineInterpolators = d3.map({
        "linear": d3_canvas_lineLinear,
        "linear-closed": d3_canvas_lineLinearClosed,
        "step": d3_canvas_lineStep,
        "step-before": d3_canvas_lineStepBefore,
        "step-after": d3_canvas_lineStepAfter,
        "basis": d3_canvas_lineBasis,
        "basis-open": d3_canvas_lineBasisOpen,
        "basis-closed": d3_canvas_lineBasisClosed,
        "bundle": d3_canvas_lineBundle,
        "cardinal": d3_canvas_lineCardinal,
        "cardinal-open": d3_canvas_lineCardinalOpen,
        "cardinal-closed": d3_canvas_lineCardinalClosed,
        "monotone": d3_canvas_lineMonotone
    });

    function d3_canvas_lineLinear(ctx, points, _, started) {
        var p = points[0];
        if (!started) {
            ctx.beginPath();
            ctx.moveTo(p[0], p[1]);
        }
        for (var i=1; i<points.length; ++i) {
            p = points[i];
            ctx.lineTo(p[0], p[1]);
        }
    }

    function d3_canvas_lineLinearClosed(ctx, points) {
        d3_canvas_lineLinear(ctx, points);
        ctx.closePath();
    }

    function d3_canvas_lineStep(ctx, points) {
        var pn = points[1], p = points[0],
            x = 0.5*(pn[0] + p[0]);
        ctx.beginPath();
        ctx.moveTo(p[0], p[1]);
        ctx.lineTo(x, p[1]);
        ctx.lineTo(x, pn[1]);
        for (var i=2; i<points.length; ++i) {
            p = pn;
            pn = points[i];
            x = 0.5*(pn[0] + p[0]);
            ctx.lineTo(x, p[1]);
            ctx.lineTo(x, pn[1]);
        }
        ctx.lineTo(pn[0], pn[1]);
    }

    function d3_canvas_lineStepBefore(ctx, points) {
        var pn = points[0], p;
        ctx.beginPath();
        ctx.moveTo(pn[0], pn[1]);
        for (var i=1; i<points.length; ++i) {
            p = pn;
            pn = points[i];
            ctx.lineTo(p[0], pn[1]);
            ctx.lineTo(pn[0], pn[1]);
        }
    }

    function d3_canvas_lineStepAfter(ctx, points) {
        var pn = points[0], p;
        ctx.beginPath();
        ctx.moveTo(pn[0], pn[1]);
        for (var i=1; i<points.length; ++i) {
            p = pn;
            pn = points[i];
            ctx.lineTo(pn[0], p[1]);
            ctx.lineTo(pn[0], pn[1]);
        }
    }

    function d3_canvas_lineBasis(ctx, points) {
        if (points.length < 3) return d3_canvas_lineLinear(ctx, points);
        var i = 1,
            n = points.length,
            pi = points[0],
            x0 = pi[0],
            y0 = pi[1],
            px = [x0, x0, x0, (pi = points[1])[0]],
            py = [y0, y0, y0, pi[1]];

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px),
                   d3_svg_lineDot4(d3_svg_lineBasisBezier3, py));

        points.push(points[n - 1]);
        while (++i <= n) {
            pi = points[i];
            px.shift();
            px.push(pi[0]);
            py.shift();
            py.push(pi[1]);
            d3_canvas_lineBasisBezier(ctx, px, py);
        }
        points.pop();
        ctx.lineTo(pi[0], pi[1]);
    }

    // Open B-spline interpolation; generates "C" commands.
    function d3_canvas_lineBasisOpen(ctx, points) {
        if (points.length < 4) return d3_canvas_lineLinear(points);
        var path = [],
            i = -1,
            n = points.length,
            pi,
            px = [0],
            py = [0];
        while (++i < 3) {
            pi = points[i];
            px.push(pi[0]);
            py.push(pi[1]);
        }
        ctx.beginPath();
        ctx.moveTo(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px),
                   d3_svg_lineDot4(d3_svg_lineBasisBezier3, py));
        --i; while (++i < n) {
            pi = points[i];
            px.shift(); px.push(pi[0]);
            py.shift(); py.push(pi[1]);
            d3_canvas_lineBasisBezier(ctx, px, py);
        }
    }

    // Closed B-spline interpolation; generates "C" commands.
    function d3_canvas_lineBasisClosed(ctx, points) {
        var path,
            i = -1,
            n = points.length,
            m = n + 4,
            pi,
            px = [],
            py = [];
        while (++i < 4) {
            pi = points[i % n];
            px.push(pi[0]);
            py.push(pi[1]);
        }
        ctx.beginPath();
        ctx.moveTo(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px),
                   d3_svg_lineDot4(d3_svg_lineBasisBezier3, py));
        --i; while (++i < m) {
            pi = points[i % n];
            px.shift(); px.push(pi[0]);
            py.shift(); py.push(pi[1]);
            d3_canvas_lineBasisBezier(ctx, px, py);
        }
    }

    function d3_canvas_lineBundle(ctx, points, tension) {
        var n = points.length - 1;
        if (n) {
            var x0 = points[0][0],
                y0 = points[0][1],
                dx = points[n][0] - x0,
                dy = points[n][1] - y0,
                i = -1,
                p,
                t;
            while (++i <= n) {
                p = points[i];
                t = i / n;
                p[0] = tension * p[0] + (1 - tension) * (x0 + t * dx);
                p[1] = tension * p[1] + (1 - tension) * (y0 + t * dy);
            }
        }
        return d3_canvas_lineBasis(ctx, points);
    }

    function d3_canvas_lineCardinal(ctx, points, tension) {
        if (points.length < 3)
            d3_canvas_lineLinear(ctx, points);
        else {
            ctx.beginPath();
            ctx.moveTo(points[0][0], points[0][1]);
            d3_canvas_lineHermite(ctx, points, d3_svg_lineCardinalTangents(points, tension));
        }
    }

    // Open cardinal spline interpolation; generates "C" commands.
    function d3_canvas_lineCardinalOpen(ctx, points, tension) {
        if (points.length < 4)
            d3_canvas_lineLinear(ctx, points);
        else {
            ctx.beginPath();
            ctx.moveTo(points[1][0], points[1][1]);
            d3_canvas_lineHermite(ctx, points.slice(1, -1), d3_svg_lineCardinalTangents(points, tension));
        }
    }

    // Closed cardinal spline interpolation; generates "C" commands.
    function d3_canvas_lineCardinalClosed(ctx, points, tension) {
        if (points.length < 3)
            d3_canvas_lineLinear(ctx, points);
        else {
            ctx.beginPath();
            ctx.moveTo(points[0][0], points[0][1]);
            d3_canvas_lineHermite(ctx, (points.push(points[0]), points),
                d3_svg_lineCardinalTangents([points[points.length - 2]].concat(points, [points[1]]), tension));
        }
    }

    function d3_canvas_lineMonotone(ctx, points) {
        if (points.length < 3)
            d3_canvas_lineLinear(ctx, points);
        else {
            ctx.beginPath();
            ctx.moveTo(points[0][0], points[0][1]);
            d3_canvas_lineHermite(ctx, points, d3_svg_lineMonotoneTangents(points));
        }
    }


    function d3_canvas_lineBasisBezier(ctx, x, y) {
        ctx.bezierCurveTo(d3_svg_lineDot4(d3_svg_lineBasisBezier1, x),
                          d3_svg_lineDot4(d3_svg_lineBasisBezier1, y),
                          d3_svg_lineDot4(d3_svg_lineBasisBezier2, x),
                          d3_svg_lineDot4(d3_svg_lineBasisBezier2, y),
                          d3_svg_lineDot4(d3_svg_lineBasisBezier3, x),
                          d3_svg_lineDot4(d3_svg_lineBasisBezier3, y));
    }


    function d3_canvas_lineHermite(ctx, points, tangents) {
        if (tangents.length < 1 ||
            (points.length != tangents.length && points.length != tangents.length + 2))
            return d3_canvas_lineLinear(ctx, points, null, true);

        var quad = points.length != tangents.length,
            p0 = points[0],
            p = points[1],
            t0 = tangents[0],
            t = t0,
            pi = 1,
            xc, yc;

        if (quad) {
            ctx.quadraticCurveTo((p[0] - t0[0] * 2 / 3), (p[1] - t0[1] * 2 / 3), p[0], p[1]);
            p0 = points[1];
            pi = 2;
        }

        if (tangents.length > 1) {
            t = tangents[1];
            p = points[pi];
            pi++;
            ctx.bezierCurveTo(p0[0] + t0[0], p0[1] + t0[1],
                              p[0] - t[0], p[1] - t[1],
                              p[0], p[1]);
            for (var i = 2; i < tangents.length; i++, pi++) {
                xc = p[0] + t[0];
                yc = p[1] + t[1];
                p = points[pi];
                t = tangents[i];
                ctx.bezierCurveTo(xc, yc,
                                  p[0] - t[0], p[1] - t[1],
                                  p[0], p[1]);
            }
        }

        if (quad) {
            var lp = points[pi];
            ctx.quadraticCurveTo((p[0] + t[0] * 2 / 3), (p[1] + t[1] * 2 / 3), lp[0], lp[1]);
        }
    }


    // same as d3.svg.symbol... but for canvas
    d3.canvas.symbol = function() {
        var svg = d3.svg.symbol(),
            type = svg.type(),
            size = svg.size(),
            ctx;

        function symbol (ctx, d, i) {
            return (d3_canvas_symbols.get(type.call(symbol, d, i)) || d3_canvas_symbolCircle)(ctx, size.call(symbol, d, i));
        }

        symbol.type = function (x) {
            if (!arguments.length) return type;
            type = d3_functor(x);
            return symbol;
        };

        // size of symbol in square pixels
        symbol.size = function (x) {
            if (!arguments.length) return size;
            size = d3_functor(x);
            return symbol;
        };

        return symbol;
    };


    function d3_canvas_symbolCircle(ctx, size) {
        var r = Math.sqrt(size / π);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, τ, false);
        ctx.closePath();
    }

    var d3_canvas_symbols = d3.map({
        "circle": d3_canvas_symbolCircle,
        "cross": function(ctx, size) {
            var r = Math.sqrt(size / 5) / 2,
                r3 = 3*r;
            ctx.beginPath();
            ctx.moveTo(-r3, -r);
            ctx.lineTo(-r, -r);
            ctx.lineTo(-r, -r3);
            ctx.lineTo(r, -r3);
            ctx.lineTo(r, -r);
            ctx.lineTo(r3, -r);
            ctx.lineTo(r3, r);
            ctx.lineTo(r, r);
            ctx.lineTo(r, r3);
            ctx.lineTo(-r, r3);
            ctx.lineTo(-r, r);
            ctx.lineTo(-r3, r);
            ctx.closePath();
        },
        "diamond": function(ctx, size) {
            var ry = Math.sqrt(size / (2 * d3_svg_symbolTan30)),
                rx = ry * d3_svg_symbolTan30;
            ctx.beginPath();
            ctx.moveTo(0, -ry);
            ctx.lineTo(rx, 0);
            ctx.lineTo(0, ry);
            ctx.lineTo(-rx, 0);
            ctx.closePath();
        },
        "square": function(ctx, size) {
            var s = Math.sqrt(size);
            ctx.beginPath();
            ctx.rect(-0.5*s, -0.5*s, s, s);
            ctx.closePath();
        },
        "triangle-down": function(ctx, size) {
            var rx = Math.sqrt(size / d3_svg_symbolSqrt3),
                ry = rx * d3_svg_symbolSqrt3 / 2;
            ctx.beginPath();
            ctx.moveTo(0, ry);
            ctx.lineTo(rx, -ry);
            ctx.lineTo(-rx, -ry);
            ctx.closePath();
        },
        "triangle-up": function(ctx, size) {
            var rx = Math.sqrt(size / d3_svg_symbolSqrt3),
                ry = rx * d3_svg_symbolSqrt3 / 2;
            ctx.beginPath();
            ctx.moveTo(0, -ry);
            ctx.lineTo(rx, ry);
            ctx.lineTo(-rx, ry);
            ctx.closePath();
        }
    });

    d3.canvas.symbolTypes = d3_canvas_symbols.keys();


    var d3_svg_symbolSqrt3 = Math.sqrt(3),
        d3_svg_symbolTan30 = Math.tan(30 * d3_radians);

    //
    //  Canvas based Paper
    //  ======================
    //
    g.paper.addType('canvas', function (paper, p) {

        var clear = paper.clear,
            components,
            componentMap,
            cidCounter,
            factor = 1,
            cid = null,
            container = paper.element().append('div')
                            .attr('class', 'canvas-container')
                            .style('position', 'relative');

        p.xAxis = d3.canvas.axis();
        p.yAxis = [d3.canvas.axis(), d3.canvas.axis()];

        paper.destroy = function () {
            _clear();
            return paper;
        };

        paper.refresh = function (size) {
            if (size) {
                var oldsize = p.size;
                p.size = size;
                _apply(function (ctx) {
                    _clearCanvas(ctx, oldsize);
                    _scaleCanvas(ctx);
                });
            }
            paper.render();
            return paper;
        };

        paper.width = function () {
            return factor*p.size[0];
        };

        paper.height = function () {
            return factor*p.size[1];
        };

        paper.innerWidth = function () {
            return factor*(p.size[0] - p.margin.left - p.margin.right);
        };

        paper.innerHeight = function () {
            return factor*(p.size[1] - p.margin.top - p.margin.bottom);
        };

        paper.factor = function (x) {
            if (!arguments.length) return factor;
            factor = +x;
            return paper;
        };

        // Re-render the canvas/es in this paper
        paper.render = function (_cid) {
            if (!arguments.length)
                _apply(_render);
            else
                _apply(_render, _cid);
            return paper;
        };

        paper.clear = function () {
            _clear();
            _addCanvas();
            return clear();
        };

        paper.group = function (attr) {
            var canvas = _addCanvas();
            if (attr)
                canvas.attr(attr);
            return paper.current();
        };

        paper.on = function (event, callback) {
            paper.element().on(event, function () {
                callback.call(this);
            });
            return paper;
        };

        paper.current = function () {
            return cid !== null ? componentMap[cid].canvas.getContext('2d') : null;
        };

        // set the current element to be the root svg element and returns the paper
        paper.root = function () {
            if (components)
                cid = components[0];
            return paper;
        };

        // set the current element to be the parent and returns the paper
        paper.parent = function () {
            var index = components.indexOf(cid);
            cid = Math.max(0, index-1);
            return paper;
        };

        paper.xfromPX = function (px) {
            return p.xAxis.scale().invert(factor*px);
        };

        paper.yfromPX = function (px) {
            return paper.yAxis().scale().invert(factor*px);
        };

        paper.circle = function (cx, cy, r) {
            var ctx = paper.current();
            ctx.beginPath();
            cx = paper.scalex(cx);
            cy = paper.scaley(cy);
            r = paper.scale(r);
            ctx.arc(cx, cy, r, 0, Math.PI * 2, false);
            ctx.endPath();
        };

        paper.drawXaxis = function () {
        };

        paper.drawYaxis = function () {
        };

        // Draw a path or an area
        paper.path = function (data, opts) {
            opts || (opts = {});
            copyMissing(p.line, opts);

            return _addComponent(function (ctx) {

                var scalex = paper.scalex,
                    scaley = paper.scaley,
                    line = opts.area ? d3.canvas.area() : d3.canvas.line();

                if (!opts.color)
                    opts.color = paper.pickColor();

                ctx.strokeStyle = opts.color;
                ctx.lineWidth = factor*opts.lineWidth;

                line.interpolate(opts.interpolate)
                    .x(function(d) {
                        return scalex(d.x);
                    })
                    .y(function(d) {
                        return scaley(d.y);
                    }).context(ctx)(data);

                ctx.stroke();
            });
        };

        paper.points = function (data, opts) {
            opts || (opts = {});
            copyMissing(p.point, opts);

            return _addComponent(function (ctx) {

                var scalex = paper.scalex,
                    scaley = paper.scaley,
                    fill = opts.fill,
                    symbol = d3.canvas.symbol().type(function (d) {
                        return d.symbol || opts.symbol;
                    }).size(pointSize(paper, opts)),
                    d, i;

                chartColors(paper, data, opts);

                if (fill === true)
                    opts.fill = fill = d3.rgb(opts.color).brighter();

                for (i=0; i<data.length; ++i) {
                    d = data[i];
                    ctx.save();
                    ctx.translate(scalex(d.x), scaley(d.y));
                    ctx.fillStyle = d.fill || fill;
                    ctx.strokeStyle = d.color || opts.color;
                    ctx.lineWidth = factor*(d.lineWidth || opts.width);
                    symbol(ctx, d, i);
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();
                }

            });

        };

        paper.barchart = function (data, opts) {
            opts || (opts = {});
            copyMissing(p.point, opts);

            return _addComponent(function (ctx) {

                var scalex = paper.scalex,
                    scaley = paper.scaley,
                    fill = opts.fill,
                    width = barWidth(paper, data, opts),
                    zero = scaley(0),
                    chart = container.select('g.barchart'),
                    y0 = scaley(0),
                    radius = factor*opts.radius,
                    x, y, d, i;

                for (i=0; i<data.length; ++i) {
                    d = data[i];
                    ctx.beginPath();
                    ctx.fillStyle = d.fill || opts.fill;
                    ctx.strokeStyle = d.color || opts.color;
                    ctx.lineWidth = factor*(d.lineWidth || opts.lineWidth);
                    x = scalex(d.x) - width;
                    y = scaley(d.y);
                    drawPolygon(ctx, [[x,y0], [x+width,y0], [x+width,y], [x, y]], radius);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
            });
        };

        paper.pie = function (data, opts) {
            opts || (opts = {});
            copyMissing(p.pie, opts);

            return _addComponent(function (ctx) {

                var scalex = paper.scalex,
                    scaley = paper.scaley,
                    width = paper.innerWidth(),
                    height = paper.innerHeight(),
                    radius = 0.5*Math.min(width, height),
                    innerRadius = opts.innerRadius*radius,
                    cornerRadius = paper.dim(opts.cornerRadius),
                    pie = d3.layout.pie()
                        .value(function (d, i) {
                            return d.length > 1 ? d[1] : d[0];
                        }),
                        //.padAngle(opts.padAngle),
                    arc = d3.canvas.arc()
                            //.padRadius(radius)
                            //.cornerRadius(cornerRadius)
                            .innerRadius(innerRadius)
                            .outerRadius(radius)
                            .context(ctx),
                    arcs = pie(data),
                    j = -1, d;

                ctx.save();
                ctx.translate(width/2, height/2);

                for (var i=0; i<data.length; ++i) {
                    d = data[i];
                    ctx.fillStyle = d.fill || paper.pickColor(++j);
                    ctx.strokeStyle = d.color || paper.pickColor(j, 1);
                    ctx.lineWidth = factor*(d.lineWidth || opts.lineWidth);
                    arc(arcs[i]);
                    ctx.fill();
                    ctx.stroke();
                }
                ctx.restore();
            });
        };

        // INTERNALS
        function _clear () {
            components = [];
            componentMap = {};
            cidCounter = 0;
            cid = null;
            container.selectAll('*').remove();
        }

        function _addCanvas() {
            cid = ++cidCounter;

            var canvas = container.append("canvas")
                            .attr("class", "giotto")
                            .attr("id", "giottoCanvas-" + paper.uid() + "-" + cid),
                element = canvas.node(),
                ctx = _scaleCanvas(element.getContext('2d'));

            var component = {
                    cid: cid,
                    canvas: element,
                    callbacks: []
                };

            if (components.length)
                canvas.style({"position": "absolute", "top": "0", "left": "0"});

            components.push(cid);
            componentMap[cid] = component;
            return canvas;
        }

        function _addComponent (callback) {
            componentMap[cid].callbacks.push(callback);
            return cid;
        }

        function _render (ctx, canvas) {
            _clearCanvas(ctx, p.size);
            //
            // translate the axis range
            ctx.translate(factor*p.margin.left, factor*p.margin.top);
            //
            // apply components
            componentMap[cid].callbacks.forEach(function (callback) {
                callback(ctx);
            });
        }

        function _apply (callback, _cid) {
            var current = cid,
                component;
            if (!_cid)
                components.forEach(function (_cid) {
                    cid = _cid;
                    component = componentMap[cid];
                    callback(component.canvas.getContext('2d'), component.canvas);
                });
            else if (componentMap[_cid]) {
                cid = component.cid;
                component = componentMap[cid];
                callback(component.canvas.getContext('2d'), component.canvas);
            }
            cid = current;
        }

        function _clearCanvas(ctx, size) {
            // clear previous stuff
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect (0 , 0, factor*size[0], factor*size[1]);
            return ctx;
        }

        function _scaleCanvas(ctx) {
            factor = d3.canvas.retinaScale(ctx, p.size[0], p.size[1]);
            _reset_axis(paper);
        }

    });


    function drawPolygon (ctx, pts, radius) {
        if (radius > 0)
            pts = getRoundedPoints(pts, radius);
        var i, pt, len = pts.length;
        ctx.beginPath();
        for (i = 0; i < len; i++) {
            pt = pts[i];
            if (i === 0)
                ctx.moveTo(pt[0], pt[1]);
            else
                ctx.lineTo(pt[0], pt[1]);
            if (radius > 0)
                ctx.quadraticCurveTo(pt[2], pt[3], pt[4], pt[5]);
        }
        ctx.closePath();
    }

    function getRoundedPoints(pts, radius) {
        var i1, i2, i3, p1, p2, p3, prevPt, nextPt,
            len = pts.length,
            res = new Array(len);
        for (i2 = 0; i2 < len; i2++) {
            i1 = i2-1;
            i3 = i2+1;
            if (i1 < 0)
                i1 = len - 1;
            if (i3 === len) i3 = 0;
            p1 = pts[i1];
            p2 = pts[i2];
            p3 = pts[i3];
            prevPt = getRoundedPoint(p1[0], p1[1], p2[0], p2[1], radius, false);
            nextPt = getRoundedPoint(p2[0], p2[1], p3[0], p3[1], radius, true);
            res[i2] = [prevPt[0], prevPt[1], p2[0], p2[1], nextPt[0], nextPt[1]];
        }
      return res;
    }

    function getRoundedPoint(x1, y1, x2, y2, radius, first) {
        var total = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
            idx = first ? radius / total : (total - radius) / total;
        return [x1 + (idx * (x2 - x1)), y1 + (idx * (y2 - y1))];
    }


    g.createviz('chart', {
        margin: {top: 30, right: 30, bottom: 30, left: 30},
        chartTypes: ['bar', 'line', 'point', 'pie'],

        line: {show: true},
        point: {show: false},
        bar: {show: false},
        pie: {show: false}
    },

    function (chart, opts) {

        var series = [];

        chart.numSeries = function () {
            return series.length;
        };

        // iterator over each serie
        chart.each = function (callback) {
            series.forEach(callback);
            return chart;
        };

        chart.forEach = chart.each;

        chart.addSeries = function (series) {
            // Loop through data and build the graph
            var xrange = [Infinity, -Infinity],
                yrange = [Infinity, -Infinity],
                wasempty = chart.numSeries() === 0,
                paper = chart.paper(),
                data = [];

            series.forEach(function (serie) {

                if (isFunction(serie))
                    serie = serie(chart);

                serie = addSerie(serie);

                if (serie) {
                    data.push(serie);
                    xrange[0] = Math.min(xrange[0], serie.xrange[0]);
                    xrange[1] = Math.max(xrange[1], serie.xrange[1]);
                    yrange[0] = Math.min(yrange[0], serie.yrange[0]);
                    yrange[1] = Math.max(yrange[1], serie.yrange[1]);
                }
            });

            paper.xAxis().scale().domain([ac(opts.xaxis.min, xrange[0]), ac(opts.xaxis.max, xrange[1])]);
            paper.yAxis().scale().domain([ac(opts.yaxis.min, yrange[0]), ac(opts.yaxis.max, yrange[1])]);

            data.forEach(function (serie) {
                addSerie(serie, true);
            });

            if (wasempty)
                if (show(opts.xaxis))
                    paper.drawXaxis();
                if (show(opts.yaxis))
                    paper.drawYaxis();
                if (show(opts.yaxis2, false))
                    paper.drawYaxis();

            return chart;
        };

        chart.addSerie = function (serie) {
            return chart.addSeries([serie]);
        };

        chart.clear = function () {
            chart.paper().clear();
            series = [];
            return chart;
        };

        chart.draw = function () {
            var data = opts.data;
            if (data === undefined && opts.src)
                return chart.loadData(chart.draw);
            if (g._.isFunction(data))
                data = opts.data = data(chart);

            chart.clear();
            if (data) {
                chart.addSeries(data);
                chart.render();
            }

        };


        chart.on('tick.main', function () {
            // Chart don't need ticking unless explicitly required (real time updates for example)
            chart.stop();
            chart.draw();
        });


        // INTERNALS
        function show (o, d) {
            if (o) {
                if (o.show === undefined)
                    return d === undefined ? true : d;
                else
                    return o.show;
            }
            return false;
        }

        function ac(val, calc) {
            val = val === undefined || val === null ? calc : val;
            return val;
        }

        function addSerie (serie, add) {
            // The serie is
            if (!serie) return;

            var paper = chart.paper(),
                color;

            if (add) {
                g.log.info('Add new serie to chart');

                series.push(serie);
                if (!serie.label)
                    serie.label = 'serie ' + series.length;

                paper.group({'class': 'serie ' + slugify(serie.label)});

                opts.chartTypes.forEach(function (type) {
                    var o = serie[type];

                    if (o === undefined)
                        serie[type] = o = opts[type];

                    if (o.show) {
                        if (!o.color) {
                            if (!color)
                                color = paper.pickColor();
                            o.color = color;
                        }
                        chartTypes[type](chart, serie.data, o);
                    }

                    serie[type] = o;
                });

                paper.parent();
            } else {

                if (isArray(serie)) {
                    serie = {data: serie};
                }
                return paper.xyData(serie);
            }
        }

    });

    var chartTypes = {

        bar: function (chart, data, opts) {
            return chart.paper().barchart(data, opts);
        },

        line: function (chart, data, opts) {
            return chart.paper().path(data, opts);
        },

        point: function (chart, data, opts) {
            return chart.paper().points(data, opts);
        }
    };

    //
    //
    // Force layout example
    g.createviz('force', {
        theta: 0.8,
        friction: 0.9,
    }, function (force, opts) {

        var nodes = [],
            forces = [],
            neighbors, friction,
            q, i, j, o, l, s, t, x, y, k;

        force.nodes = function(x) {
            if (!arguments.length) return nodes;
            neighbors = null;
            nodes = x;
            for (i = 0; i < nodes.length; ++i)
                initNode(nodes[i]).index = i;
            return force;
        };

        // Add a new node to the force layout and return the force object
        force.addNode = function (o) {
            o.index = nodes.length;
            nodes.push(initNode(o));
            return force;
        };

        force.theta = function(x) {
            if (!arguments.length) return +opts.theta;
            opts.theta = x;
            return force;
        };

        force.friction = function(x) {
            if (!arguments.length) return +opts.friction;
            opts.friction = x;
            return force;
        };

        force.quadtree = function (createNew) {
            if (!q || createNew)
                q = force.paper().quadtree()(nodes);
                //q = paper.quadtree().x(function (d) {return d.x;})
                //                    .y(function (d) {return d.y;})
                //                    (nodes);
            return q;
        };

        force.addForce = function (callback) {
            forces.push(callback);
        };

        // Draw points in the paper
        force.drawPoints = function () {
            var colors = force.paper().options().colors,
                j = 0;

            for (i=0; i<nodes.length; i++) {
                if (!nodes[i].fill) {
                    nodes[i].fill = colors[j % colors.length];
                    j++;
                }
            }

            return force.paper().points(nodes);
        };

        force.drawQuadTree = function (options) {
            return force.paper().drawQuadTree(force.quadtree, options);
        };

        force.on('tick.main', function() {
            q = null;
            i = -1; while (++i < nodes.length) {
                o = nodes[i];
                o.px = o.x;
                o.py = o.y;
            }

            for (i=0; i<forces.length; ++i)
                forces[i]();

            friction = force.friction();
            i = -1; while (++i < nodes.length) {
                o = nodes[i];
                if (o.fixed) {
                    o.x = o.px;
                    o.y = o.py;
                } else  {
                    o.x -= (o.px - o.x) * friction;
                    o.y -= (o.py - o.y) * friction;
                }
            }
        });

        function initNode (o) {
            var paper = force.paper();
            o.weight = 0;
            if (isNaN(o.x)) o.x = paper.x(Math.random());
            if (isNaN(o.y)) o.y = paper.y(Math.random());
            return o;
        }
    });

    // gauss-seidel relaxation for links
    g.viz.force.plugin(function (force, opts) {
        var links = [],
            distances, strengths,
            nodes, i, o, s, t, x, y, l;

        g._.copyMissing({linkStrength: 1, linkDistance: 20}, opts);


        force.linkStrength = function(x) {
            if (!arguments.length) return opts.linkStrength;
            opts.linkStrength = typeof x === "function" ? x : +x;
            return force;
        };

        force.linkDistance = function(x) {
            if (!arguments.length) return opts.linkDistance;
            opts.linkDistance = typeof x === "function" ? x : +x;
            return force;
        };

        force.addForce(function () {
            if (!distances)
                _init();

            for (i = 0; i < links.length; ++i) {
                o = links[i];
                s = o.source;
                t = o.target;
                x = t.x - s.x;
                y = t.y - s.y;
                l = (x * x + y * y);
                if (l) {
                    l = opts.alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l;
                    x *= l;
                    y *= l;
                    t.x -= x * (k = s.weight / (t.weight + s.weight));
                    t.y -= y * k;
                    s.x += x * (k = 1 - k);
                    s.y += y * k;
                }
            }
        });

        function _init () {
            var linkDistance = opts.linkDistance,
                linkStrength = opts.linkStrength,
                nodes = force.nodes();
            distances = [];
            strengths = [];

            if (links.length) {

                for (i = 0; i < links.length; ++i) {
                    o = links[i];
                    if (typeof o.source == "number") o.source = nodes[o.source];
                    if (typeof o.target == "number") o.target = nodes[o.target];
                    ++o.source.weight;
                    ++o.target.weight;
                }

                if (typeof linkDistance === "function")
                    for (i = 0; i < links.length; ++i)
                        distances[i] = +linkDistance.call(force, links[i], i);
                else
                    for (i = 0; i < links.length; ++i)
                        distances[i] = linkDistance;

                if (typeof linkStrength === "function")
                    for (i = 0; i < links.length; ++i)
                        strengths[i] = +linkStrength.call(force, links[i], i);
                else
                    for (i = 0; i < links.length; ++i)
                        strengths[i] = linkStrength;
            }
        }
    });

    //
    // Gravity plugin
    g.viz.force.plugin(function (force, opts) {
        var i, k, o, nodes;

        if (opts.gravity === undefined)
            opts.gravity = 0.05;

        force.gravity = function (x) {
            if (!arguments.length) return +opts.gravity;
            opts.gravity = x;
            return force;
        };

        force.addForce(function () {
            k = force.alpha() * opts.gravity;
            nodes = force.nodes();

            var xc = force.paper().x(0.5),
                yc = force.paper().y(0.5);
            for (i = 0; i < nodes.length; ++i) {
                o = nodes[i];
                if (!o.fixed) {
                    o.x += (xc - o.x) * k;
                    o.y += (yc - o.y) * k;
                }
            }
        });
    });

    //
    // Charge plugin
    g.viz.force.plugin(function (force, opts) {
        var paper = force.paper(),
            charges,
            charge, nodes, q, i, k, o,
            chargeDistance2;

        g._.copyMissing({charge: -30, chargeDistance: Infinity}, opts);

        force.charge = function (x) {
            if (!arguments.length) return typeof opts.charge === "function" ? opts.charge : +opts.charge;
            opts.charge = x;
            if (charges)
                _init();
            return force;
        };

        force.chargeDistance = function(x) {
            if (!arguments.length) return +opts.chargeDistance;
            opts.chargeDistance2 = +x;
            chargeDistance2 = x * x;
            return force;
        };

        force.addForce(function () {
            // compute quadtree center of mass and apply charge forces
            nodes = force.nodes();
            charge = force.charge();
            if (charge && nodes.length) {
                if (!charges)
                    _init();

                d3_layout_forceAccumulate(q = force.quadtree(), force.alpha(), charges);
                i = -1; while (++i < nodes.length) {
                    o = nodes[i];
                    if (!o.fixed) q.visit(repulse(o));
                }
            }
        });

        function _init () {
            force.chargeDistance(opts.chargeDistance);
            charge = force.charge();
            nodes = force.nodes();
            charges = [];
            if (typeof charge === "function")
                for (i = 0; i < nodes.length; ++i)
                    charges[i] = +charge.call(force, nodes[i], i);
            else
                for (i = 0; i < nodes.length; ++i)
                    charges[i] = charge;
        }

        function repulse(node) {
            var theta = force.theta(),
                theta2 = theta*theta;

            return function(quad, x1, _, x2) {
                if (quad.point !== node && quad.charge) {
                    var dx = quad.cx - node.x,
                        dy = quad.cy - node.y,
                        dw = x2 - x1,
                        dn = dx * dx + dy * dy;

                    /* Barnes-Hut criterion. */
                    if (dw * dw / theta2 < dn) {
                        if (dn < chargeDistance2) {
                            k = quad.charge / dn;
                            node.px -= dx * k;
                            node.py -= dy * k;
                        }
                        return true;
                    }

                    if (quad.point && dn && dn < chargeDistance2) {
                        k = quad.pointCharge / dn;
                        node.px -= dx * k;
                        node.py -= dy * k;
                    }
                }
                return !quad.charge;
            };
        }

        function d3_layout_forceAccumulate(quad, alpha, charges) {
            var cx = 0,
                cy = 0;
            quad.charge = 0;
            if (!quad.leaf) {
                var nodes = quad.nodes,
                    n = nodes.length,
                    i = -1,
                    c;
                while (++i < n) {
                    c = nodes[i];
                    if (!c) continue;
                    d3_layout_forceAccumulate(c, alpha, charges);
                    quad.charge += c.charge;
                    cx += c.charge * c.cx;
                    cy += c.charge * c.cy;
                }
            }
            if (quad.point) {
                // jitter internal nodes that are coincident
                if (!quad.leaf) {
                    var paper = force.paper();
                    quad.point.x += paper.x(Math.random()) - paper.x(0.5);
                    quad.point.y += paper.y(Math.random()) - paper.y(0.5);
                }
                var k = alpha * charges[quad.point.index];
                quad.charge += quad.pointCharge = k;
                cx += k * quad.point.x;
                cy += k * quad.point.y;
            }
            quad.cx = quad.charge ? cx / quad.charge : 0;
            quad.cy = quad.charge ? cy / quad.charge : 0;
        }
    });


    g.createviz('map', {
        tile: null,
        center: [41.898582, 12.476801],
        zoom: 4,
        maxZoom: 18,
        zoomControl: true,
        wheelZoom: true,
    }, function (viz, opts) {

        viz.start = function () {};

        viz.innerMap = function () {};

        viz.addLayer = function (collection, draw) {};

        // Override when tile provider available
        if (opts.tile)
            g.viz.map.tileProviders[opts.tile](viz, opts);

    }).tileProviders = {};

    //
    //  Leaflet tiles
    g.viz.map.tileProviders.leaflet = function (viz, opts) {
        var map,
            callbacks = [];

        // Override start
        viz.start = function () {
            if (typeof L === 'undefined') {
                g._.loadCss(g.constants.leaflet);
                g.require(['leaflet'], function () {
                    viz.start();
                });
            } else {
                map = new L.map(viz.element().node(), {
                    center: opts.center,
                    zoom: opts.zoom
                });
                if (opts.zoomControl) {
                    if (!opts.wheelZoom)
                        map.scrollWheelZoom.disable();
                } else {
                    map.dragging.disable();
                    map.touchZoom.disable();
                    map.doubleClickZoom.disable();
                    map.scrollWheelZoom.disable();

                    // Disable tap handler, if present.
                    if (map.tap) map.tap.disable();
                }

                // Attach the view reset callback
                map.on("viewreset", function () {
                    for (var i=0; i<callbacks.length; ++i)
                        callbacks[i]();
                });

                viz.resume();
            }
        };

        viz.innerMap = function () {
            return map;
        };

        viz.addLayer = function (url, options) {
            if (map)
                L.tileLayer(url, options).addTo(map);
        };

        viz.addOverlay = function (collection, callback) {
            var transform = d3.geo.transform({point: ProjectPoint}),
                path = d3.geo.path().projection(transform),
                svg = map ? d3.select(map.getPanes().overlayPane).append("svg") : null,
                g = svg ? svg.append("g").attr("class", "leaflet-zoom-hide") : null,
                draw = function () {
                    var bounds = path.bounds(collection),
                        topLeft = bounds[0],
                        bottomRight = bounds[1];

                    svg.attr("width", bottomRight[0] - topLeft[0])
                        .attr("height", bottomRight[1] - topLeft[1])
                        .style("left", topLeft[0] + "px")
                        .style("top", topLeft[1] + "px");

                    g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

                    if (callback)
                        callback(path);
                };

            callbacks.push(draw);

            return {
                element: g,
                collection: collection,
                path: path,
                draw: draw
            };
        };

        // Use Leaflet to implement a D3 geometric transformation.
        function ProjectPoint (x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }

    };




    g.createviz('pie', {},

    function (chart, opts) {

        chart.draw = function () {
            if (opts.data === undefined && opts.src)
                return chart.loadData(chart.draw);
            if (g._.isFunction(opts.data))
                opts.data = data(chart);

            chart.clear();
            if (opts.data) {
                chart.paper().pie(opts.data, opts);
                chart.render();
            }
        };

        chart.on('tick.main', function () {
            // Chart don't need ticking unless explicitly required (real time updates for example)
            chart.stop();
            chart.draw();
        });
    });

    //
    //  Sunburst visualization
    //
    g.createviz('sunBurst', {
        // Show labels
        labels: true,
        // Add the order of labels if available in the data
        addorder: false,
        // speed in transitions
        transition: 750,
        //
        scale: 'sqrt',
        //
        initNode: null
    }, function (self, opts) {

        var current,
            loading = false,
            paper = self.paper(),
            textSize = calcTextSize(),
            color = d3.scale.category20c(),
            transition = +opts.transition,
            x = d3.scale.linear().range([0, 2 * Math.PI]),  // angular position
            y,
            arc = d3.svg.arc()
                    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
                    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
                    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
                    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); }),
            radius,
            textContainer,
            dummyPath,
            text,
            positions,
            depth,
            path;

        self.on('tick.main', function (e) {
            // Load data if not already available
            if (!opts.data)
                return self.loadData();
            else {
                build();
                self.alpha(0);
            }
        });

        // API
        //
        // Select a path
        self.select = function (path) {
            if (!current) return;
            var node = opts.data;
            if (path && path.length) {
                for (var n=0; n<path.length; ++n) {
                    var name = path[n];
                    if (node.children) {
                        for (var i=0; i<=node.children.length; ++i) {
                            if (node.children[i] && node.children[i].name === name) {
                                node = node.children[i];
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }
            }
            return select(node);
        };

        // Set the scale or returns it
        self.scale = function (scale) {
            if (!arguments.length) return opts.scale;
            if (opts.scale !== scale) {
                opts.scale = scale;
                self.resume();
            }
            return self;
        };

        // Private methods

        // Calculate the text size to use from dimensions
        function calcTextSize () {
            var dim = Math.min(paper.innerWidth(), paper.innerHeight());
            if (dim < 400)
                return Math.round(100 - 0.15*(500-dim));
            else
                return 100;
        }

        function select (node) {
            if (node === current) return;

            if (text) text.transition().attr("opacity", 0);
            //
            function visible (e) {
                return e.x >= node.x && e.x < (node.x + node.dx);
            }

            var arct = arcTween(node);
            depth = node.depth;

            path.transition()
                .duration(transition)
                .attrTween("d", arct)
                .each('end', function (e, i) {
                    if (node === e) {
                        self.current = e;
                        self.fire('change');
                    }
                });

            if (text) {
                positions = [];
                dummyPath.transition()
                    .duration(transition)
                    .attrTween("d", arct)
                    .each('end', function (e, i) {
                        // check if the animated element's data lies within the visible angle span given in d
                        if (e.depth >= depth && visible(e)) {
                            // fade in the text element and recalculate positions
                            alignText(d3.select(this.parentNode)
                                        .select("text")
                                        .transition().duration(transition)
                                        .attr("opacity", 1));
                        }
                    });
            }
            return true;
        }

        //
        function build () {

            var width = 0.5*paper.innerWidth(),
                height = 0.5*paper.innerHeight(),
                // Create the partition layout
                partition = d3.layout.partition()
                    .value(function(d) { return d.size; })
                    .sort(function (d) { return d.order === undefined ? d.size : d.order;}),
                svg = paper.group()
                          .attr("transform", "translate(" + width + "," + height + ")"),
                sunburst = svg.append('g').attr('class', 'sunburst');

            radius = Math.min(width, height);
            y = scale(radius);  // radial position
            depth = 0;
            current = opts.data;

            var y0 = y(0),
                yr = y(radius);

            path = sunburst.selectAll("path")
                    .data(partition.nodes(current))
                    .enter()
                    .append('path')
                    .attr("d", arc)
                    .style("fill", function(d) { return color((d.children ? d : d.parent).name); });

            if (opts.labels) {
                var data = path.data();
                positions = [];
                textContainer = svg.append('g')
                                .attr('class', 'text')
                                .selectAll('g')
                                .data(data)
                                .enter().append('g');
                dummyPath = textContainer.append('path')
                        .attr("d", arc)
                        .attr("opacity", 0)
                        .on("click", click);
                text = textContainer.append('text')
                        .text(function(d) {
                            if (opts.addorder !== undefined && d.order !== undefined)
                                return d.order + ' - ' + d.name;
                            else
                                return d.name;
                        });
                alignText(text);
            }

            //
            if (!self.select(opts.initNode))
                opts.event.change({type: 'change', viz: self});
        }

        function scale (radius) {
            //if (opts.scale === 'log')
            //    return d3.scale.log().range([1, radius]);
            if (opts.scale === 'linear')
                return d3.scale.linear().range([0, radius]);
            else
                return d3.scale.sqrt().range([0, radius]);
        }

        function click (d) {
            // Fade out all text elements
            if (depth === d.depth) return;
            if (text) text.transition().attr("opacity", 0);
            depth = d.depth;
            //
            function visible (e) {
                return e.x >= d.x && e.x < (d.x + d.dx);
            }
            //
            path.transition()
                .duration(transition)
                .attrTween("d", arcTween(d))
                .each('end', function (e, i) {
                    if (e.depth === depth && visible(e)) {
                        self.current = e;
                        opts.event.change({type: 'change', viz: self});
                    }
                });

            if (text) {
                positions = [];
                dummyPath.transition()
                    .duration(transition)
                    .attrTween("d", arcTween(d))
                    .each('end', function (e, i) {
                        // check if the animated element's data lies within the visible angle span given in d
                        if (e.depth >= depth && visible(e)) {
                            // fade in the text element and recalculate positions
                            alignText(d3.select(this.parentNode)
                                        .select("text")
                                        .transition().duration(transition)
                                        .attr("opacity", 1));
                        }
                    });
            }
        }

        function calculateAngle (d) {
            var a = x(d.x + d.dx / 2),
                changed = true,
                tole=Math.PI/40;

            function tween (angle) {
                var da = a - angle;
                if (da >= 0 && da < tole) {
                    a += tole;
                    changed = true;
                }
                else if (da < 0 && da > -tole) {
                    a -= tole - da;
                    changed = true;
                }
            }

            while (changed) {
                changed = false;
                positions.forEach(tween);
            }
            positions.push(a);
            return a;
        }

        // Align text when labels are displaid
        function alignText (text) {
            var a;
            return text.attr("x", function(d, i) {
                // Set the Radial position
                if (d.depth === depth)
                    return 0;
                else {
                    a = calculateAngle(d);
                    this.__data__.angle = a;
                    return a > Math.PI ? -y(d.y) : y(d.y);
                }
            }).attr("dx", function(d) {
                // Set the margin
                return d.depth === depth ? 0 : (d.angle > Math.PI ? -6 : 6);
            }).attr("dy", function(d) {
                // Set the Radial position
                if (d.depth === depth)
                    return d.depth ? 40 : 0;
                else
                    return ".35em";
            }).attr("transform", function(d) {
                // Set the Angular position
                a = 0;
                if (d.depth > depth) {
                    a = d.angle;
                    if (a > Math.PI)
                        a -= Math.PI;
                    a -= Math.PI / 2;
                }
                return "rotate(" + (a / Math.PI * 180) + ")";
            }).attr("text-anchor", function (d) {
                // Make sure text is never oriented downwards
                a = d.angle;
                if (d.depth === depth)
                    return "middle";
                else if (a && a > Math.PI)
                    return "end";
                else
                    return "start";
            }).style("font-size", function(d) {
                var g = d.depth - depth,
                    pc = textSize;
                if (!g) pc *= 1.2;
                else if (g > 0)
                    pc = Math.max((1.2*pc - 20*g), 30);
                return Math.round(pc) + '%';
            });
        }

        // Interpolate the scales!
        function arcTween(d) {
            var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                yd = d3.interpolate(y.domain(), [d.y, 1]),
                yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
            return function(d, i) {
                return i ? function(t) {
                    return arc(d);
                } : function(t) {
                    x.domain(xd(t));
                    y.domain(yd(t)).range(yr(t));
                    return arc(d);
                };
            };
        }
    });


    g.createviz('trianglify', {
        bleed: 150,
        fillOpacity: 1,
        strokeOpacity: 1,
        noiseIntensity: 0,
        gradient: null,
        cellsize: 0,
        cellpadding: 0,
        x_gradient: null,
        y_gradient: null
    }, function (tri, opts) {
        var waiting, t;

        tri.gradient = function (value) {
            if (value && typeof(value) === 'string') {
                var bits = value.split('-');
                if (bits.length === 2) {
                    var palette = Trianglify.colorbrewer[bits[0]],
                        num = +bits[1];
                    if (palette) {
                        return palette[num];
                    }
                }
            }
        };
        //
        tri.on('tick.main', function (e) {
            // Load data if not already available
            if (tri.Trianglify === undefined && typeof Trianglify === 'undefined') {
                if (!waiting) {
                    waiting = true;
                    return g.require(['trianglify'], function (Trianglify) {
                        waiting = false;
                        tri.Trianglify = Trianglify || null;
                    });
                }
            } else {
                if (tri.Trianglify === undefined)
                    tri.Trianglify = Trianglify;
                build();
                tri.stop();
            }
        });


        function build () {
            var cellsize = +opts.cellsize,
                cellpadding = +opts.cellpadding,
                fillOpacity = +opts.fillOpacity,
                strokeOpacity = +opts.strokeOpacity,
                noiseIntensity = +opts.noiseIntensity,
                gradient = tri.gradient(opts.gradient),
                x_gradient = tri.gradient(opts.x_gradient) || gradient,
                y_gradient = tri.gradient(opts.y_gradient) || gradient,
                paper = tri.paper().clear(),
                element = paper.element(),
                size = tri.paper().size();

            element.selectAll('*').remove();
            if (!t)
                t = new Trianglify();

            t.options.fillOpacity = Math.min(1, Math.max(fillOpacity, 0));
            t.options.strokeOpacity = Math.min(1, Math.max(strokeOpacity, 0));
            t.options.noiseIntensity = Math.min(1, Math.max(noiseIntensity, 0));
            if (x_gradient)
                t.options.x_gradient = x_gradient;
            if (y_gradient)
                t.options.y_gradient = y_gradient;
            if (cellsize > 0) {
                t.options.cellsize = cellsize;
                t.options.bleed = +attrs.bleed;
            }
            var pattern = t.generate(size[0], size[1]),
                telement = element.select('.trianglify-background');
            if (!telement.node()) {
                var parentNode = element.node(),
                    node = document.createElement('div'),
                    inner = parentNode.childNodes;
                while (inner.length) {
                    node.appendChild(inner[0]);
                }
                node.className = 'trianglify-background';
                parentNode.appendChild(node);
                telement = element.select('.trianglify-background');
            }
            telement.style("min-height", "100%")
                   //.style("height", this.attrs.height+"px")
                   //.style("width", this.attrs.width+"px")
                    .style("background-image", pattern.dataUrl);
        }
    });

    //
    //  Add brush functionality to svg paper
    g.paper.svg.plugin('brush', {
        axis: 'x',
        opacity: 0.125,
        fill: '#000'
    },

    function (paper, opts) {
        var cid, brush;

        paper.brush = function () {
            return brush;
        };

        // get/set the extent for the brush
        // When set, it re-renders in the paper
        paper.extent = function (x) {
            if (!arguments.length) return brush ? brush.extent() : null;
            if (brush) {
                brush.extent(x);
                paper.render(cid);
            }
        };

        // Add a brush to the paper if not already available
        paper.addBrush = function (options) {
            if (cid) return paper;

            if (_.isObject(options))
                extend(opts.brush, options);

            brush = d3.svg.brush()
                            .on("brushstart", brushstart)
                            .on("brush", brushmove)
                            .on("brushend", brushend);

            cid = paper.addComponent(function () {
                if (!brush) return;

                var current = paper.root().current(),
                    gBrush = current.select('g.brush');

                if (opts.brush.axis === 'x') brush.x(paper.xAxis().scale());

                if (!gBrush.node()) {
                    if (opts.brush.extent)
                        brush.extent(opts.brush.extent);
                    gBrush = current.append('g');

                    var rect = gBrush.call(brush).selectAll("rect")
                                        .attr('fill', opts.brush.fill)
                                        .attr('fill-opacity', opts.brush.opacity);

                    if (opts.brush.axis === 'x') {
                        gBrush.attr("class", "brush x-brush");
                        rect.attr("y", -6).attr("height", paper.innerHeight() + 7);
                    }
                } else
                    gBrush.call(brush);

                brushstart();
                brushmove();
                brushend();
            });

            return brush;
        };

        paper.removeBrush = function () {
            cid = paper.removeComponent(cid);
            paper.root().current().select('g.brush').remove();
            brush = null;
        };


        function brushstart () {
            paper.root().current().classed('selecting', true);
            if (opts.brush.start) opts.brush.start();
        }

        function brushmove () {
            if (opts.brush.move) opts.brush.move();
        }

        function brushend () {
            paper.root().current().classed('selecting', false);
            if (opts.brush.end) opts.brush.end();
        }
    });


    //
    //  Add brush functionality to charts
    g.viz.chart.plugin(function (chart, opts) {
        var dimension,
            brush, brushopts;

        if (opts.brush) {
            brush = opts.brush;
            if (!_.isObject(brush)) brush = {};
            brushopts = extend({}, brush);

            brushopts.start = function () {
                if (brush.start) brush.start(chart);
            };

            brushopts.move = function () {
                //
                // loop through series and add selected class
                chart.each(function (serie) {
                    var brush = chart.paper().brush(),
                        s = brush.extent();

                    if (serie.point.chart)
                        serie.point.chart.selectAll('.point')
                            .classed("selected", function(d) {
                                return s[0] <= d.x && d.x <= s[1];
                            });
                    if (serie.bar.chart)
                        serie.bar.chart.selectAll('.bar')
                            .classed("selected", function(d) {
                                return s[0] <= d.x && d.x <= s[1];
                            });
                });
                if (brush.move) brush.move(chart);
            };

            brushopts.end = function () {
                if (brush.end) brush.end(chart);
            };
        }

        chart.dimension = function (x) {
            init();
            if (!arguments.length) return dimension;
            dimension = x;
            return chart;
        };

        chart.on('tick.brush', function () {
            if (brushopts)
                chart.paper().addBrush(brushopts);
        });

    });

    g.viz.force.plugin(function (force, opts) {
        g._.copyMissing({collidePadding: 0.002, collideBuffer: 0.02}, opts);

        force.collide = function () {
            var snodes = [],
                nodes = force.nodes(),
                paper = force.paper(),
                scalex = paper.scalex,
                scaley = paper.scaley,
                invertx = paper.xAxis().scale().invert,
                inverty = paper.yAxis().scale().invert,
                scale = paper.scale,
                buffer = scale(paper.dim(opts.collideBuffer)),
                padding = paper.dim(opts.collidePadding),
                node;

            for (var i=0; i<nodes.length; ++i) {
                node = nodes[i];
                if (node.radius)
                    snodes.push({
                        x: scalex(node.x),
                        y: scaley(node.y),
                        index: node.index,
                        radius: scale(node.radius + padding)
                    });
            }

            var q = d3.geom.quadtree(snodes);

            for (i=0; i<snodes.length; ++i)
                q.visit(circleCollide(snodes[i], buffer));

            for (i=0; i<snodes.length; ++i) {
                node = snodes[i];
                nodes[node.index].x = invertx(node.x);
                nodes[node.index].y = inverty(node.y);
            }
        };

        function circleCollide (node, buffer) {

            var r = node.radius + buffer,
                nx1 = node.x - r,
                nx2 = node.x + r,
                ny1 = node.y - r,
                ny2 = node.y + r,
                dx, dy, d;

            return function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== node)) {
                    dx = node.x - quad.point.x;
                    dy = node.y - quad.point.y;
                    d = Math.sqrt(dx * dx + dy * dy);
                    r = node.radius + quad.point.radius;
                    if (d < r) {
                        d = 0.5 * (r - d) / d;
                        dx *= d;
                        dy *= d;
                        if (node.fixed || quad.point.fixed) {
                            if (node.fixed) {
                                quad.point.x -= 2*dx;
                                quad.point.y -= 2*dy;
                            } else {
                                node.x += 2*dx;
                                node.y += 2*dy;
                            }
                        } else {
                            node.x += dx;
                            node.y += dy;
                            quad.point.x -= dx;
                            quad.point.y -= dy;
                        }
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            };
        }

    });
    var gridDefaults = {
        color: '#333',
        background: {
            color: '#c6dbef',
            opacity: 0.4
        },
        opacity: 0.3
    };
    //
    //  Add grid functionality to svg paper
    g.paper.svg.plugin('grid', gridDefaults,

    function (paper, opts) {

        var xGrid, yGrid;

        paper.showGrid = function (options) {
            init();
            addgrid();
            showhide(xGrid, paper.xAxis(), 'x', opts.xaxis.grid);
            showhide(yGrid, paper.yAxis(), 'y', opts.yaxis.grid);
            return paper;
        };

        paper.hideGrid = function () {
            if (xGrid) {
                showhide(xGrid, paper.xAxis(), 'x');
                showhide(yGrid, paper.yAxis(), 'y');
            }
            return paper;
        };

        paper.xGrid = function () {
            init();
            return xGrid;
        };

        paper.yGrid = function () {
            init();
            return yGrid;
        };

        // PRIVATE FUNCTIONS

        function init () {
            if (!xGrid) {
                opts.grid = extend({}, opts.grid, g.defaults.paper.grid);
                if (opts.xaxis.grid === undefined) opts.xaxis.grid = true;
                if (opts.yaxis.grid === undefined) opts.yaxis.grid = true;
                xGrid = d3.svg.axis();
                yGrid = d3.svg.axis();
            }
        }

        function addgrid () {
            var r = paper.root().current().select('rect.grid');
            if (!r.node()) {
                r = paper.current().insert("rect", "*")
                        .attr("class", "grid")
                        .attr("width", paper.innerWidth())
                        .attr("height", paper.innerHeight());
            }
            paper.setBackground(r, opts.grid.background);
        }

        function showhide(grid, axis, xy, show) {
            var g = paper.root().current()
                            .select('.' + xy + '-grid');
            if (show) {
                if(!g.node()) {
                    grid.scale(axis.scale()).ticks(axis.ticks()).tickFormat("");
                    g = paper.group().attr('class', 'grid ' + xy + '-grid')
                            .attr('stroke', opts.grid.color)
                            .attr('stroke-opacity', opts.grid.opacity);
                    if (opts.grid.background)
                        g.attr('fill', opts.grid.backgroundColor);

                    if (xy === 'x')
                        grid.tickSize(paper.innerHeight(), 0, 0);
                    else
                        grid.tickSize(-paper.innerWidth(), 0, 0).orient('left');

                    paper.addComponent(function () {
                        g.call(grid);
                    });
                }
            } else
                g.remove();
        }
    });

    g.paper.canvas.plugin('grid', gridDefaults,

    function (paper, opts) {

        paper.showGrid = function (options) {
            return paper;
        };

        paper.hideGrid = function () {
            return paper;
        };

     });
    //
    //  Add grid functionality to charts
    g.viz.chart.plugin(function (chart, opts) {
        opts.grid = extend({show: false}, opts.grid);

        // Show grid
        chart.showGrid = function (options) {
            chart.paper().showGrid(options);
            return chart;
        };

        // Hide grid
        chart.hideGrid = function () {
            chart.paper().hideGrid();
            return chart;
        };

        chart.on('tick.grid', function () {
            if (opts.grid.show)
                chart.showGrid();
            else
                chart.hideGrid();
        });
    });

    var quadDefaults = {
        color: '#ccc',
        opacity: 1,
        width: 1,
        fill: 'none',
        fillOpacity: 0.5,
    };


    g.paper.svg.plugin("quadtree",

        quadDefaults,

        function (paper, opts) {

            paper.quadtree = function () {
                //var sx = paper.xAxis().scale(),
                //    sy = paper.yAxis().scale(),
                //    x0 = sx.invert(-1),
                //    y1 = sy.invert(-1),
                //    x1 = sx.invert(paper.innerWidth()+1),
                //    y0 = sy.invert(paper.innerHeight()+1);
                //return d3.geom.quadtree().extent([[x0, y0], [x1, y1]]);
                return d3.geom.quadtree;
            };

            // Draw a quad tree on the paper
            paper.drawQuadTree = function (factory, options) {
                g.extend(opts.quadtree, options);

                var container = paper.current(),
                    o = opts.quadtree;

                return paper.addComponent(function () {
                    var gc = container.select('g.quadtree'),
                        quadtree = factory();

                    if (!gc.node())
                        gc = container.append('g')
                                        .attr('class', 'quadtree')
                                        .attr('stroke', o.color)
                                        .attr('stroke-width', o.width)
                                        .attr('stroke-opacity', o.opacity)
                                        .attr('fill', o.fill)
                                        .attr('fill-opacity', o.fillOpacity)
                                        .style('shape-rendering', 'crispEdges');
                    else
                        gc.selectAll(".quad-node").remove();

                    gc.selectAll(".quad-node")
                        .data(qnodes(quadtree))
                        .enter().append("rect")
                        .attr("class", "quad-node")
                        .attr("x", function(d) { return d.x1; })
                        .attr("y", function(d) { return d.y1; })
                        .attr("width", function(d) { return d.x2 - d.x1; })
                        .attr("height", function(d) { return d.y2 - d.y1; });

                    return {chart: gc};
                });
            };

            function nice (s, maxs) {
                return s <= 0 ? 0 : s >= maxs ? maxs : s;
            }

            function qnodes (quadtree) {
                var nodes = [],
                    scalex = paper.scalex,
                    scaley = paper.scaley,
                    width = paper.innerWidth(),
                    height = paper.innerHeight();

                quadtree.depth = 0; // root
                quadtree.visit(function(node, x1, y1, x2, y2) {
                    node.x1 = nice(scalex(x1), width);
                    node.y1 = nice(scaley(y2), height);
                    node.x2 = nice(scalex(x2), width);
                    node.y2 = nice(scaley(y1), height);
                    nodes.push(node);
                    for (var i=0; i<4; i++) {
                        if (node.nodes[i]) node.nodes[i].depth = node.depth+1;
                    }
                });
                return nodes;
            }
        });

    g.paper.canvas.plugin("quadtree",

        quadDefaults,

        function (paper, opts) {

            paper.quadtree = function () {
                return d3.geom.quadtree;
            };

        });


    g.viz.force.plugin(function (force, opts) {
        var xc = 0,
            yc = 1;

        if (opts.velocity === undefined)
            opts.velocity = 0;

        force.velocity = function (x) {
            if (!arguments.length) return typeof opts.velocity === "function" ? opts.velocity : +opts.velocity;
            opts.velocity = x;
            return force;
        };

        force.velocity_x = function (x) {
            if (!arguments.length) return xc;
            xc = x;
            return force;
        };

        force.velocity_y = function (y) {
            if (!arguments.length) return yc;
            yc = y;
            return force;
        };

        force.addForce(function () {
            var velocity = force.velocity();
            if (!velocity) return;
            var nodes = force.nodes(),
                node, v;

            if (typeof opts.velocity !== "function")
                velocity = asFunction(velocity);

            for (var i=0; i<nodes.length; ++i) {
                node = nodes[i];
                if (!node.fixed) {
                    v = velocity(node);
                    node.x += v[xc];
                    node.y += v[yc];
                }
            }
        });

        function asFunction (value) {
            return function (d) {return value;};
        }
    });
    var zoomDefaults = {
        x: true,
        y: true,
        extent: [1, 10]
    };
    //
    //  Add zoom functionality to an svg paper
    g.paper.svg.plugin('zoom', zoomDefaults,

    function (paper, opts) {
        var zoom;

        paper.zoom = function (options) {
            init();
            if (options)
                extend(opts.zoom, options);
            if (opts.zoom.x)
                zoom.x(paper.xAxis().scale());
            if (opts.zoom.y)
                zoom.y(paper.yAxis().scale());
            if (opts.zoom.extent)
                zoom.scaleExtent(opts.zoom.extent);
            zoom.on('zoom', paper.render);
            var g = paper.root().current();
            g.call(zoom);
            paper.showGrid();
        };

        // PRIVATE FUNCTIONS

        function init () {
            if (!zoom) {
                zoom = d3.behavior.zoom();
                opts.zoom = extend({}, opts.zoom, g.defaults.paper.zoom);
            }
        }
    });

    g.paper.canvas.plugin('zoom', zoomDefaults,

    function (paper, opts) {
        var zoom;

        paper.zoom = function (options) {
            init();
            if (options)
                extend(opts.zoom, options);
            if (opts.zoom.x)
                zoom.x(paper.xAxis().scale());
            if (opts.zoom.y)
                zoom.y(paper.yAxis().scale());
            if (opts.zoom.extent)
                zoom.scaleExtent(opts.zoom.extent);
            //zoom.on('zoom', paper.render);
            //var g = paper.root().current();
            //g.call(zoom);
            paper.showGrid();
        };

        // PRIVATE FUNCTIONS

        function init () {
            if (!zoom) {
                zoom = d3.behavior.zoom();
                opts.zoom = extend({}, opts.zoom, g.defaults.paper.zoom);
            }
        }
    });

    //
    //  Add grid functionality to charts
    g.viz.chart.plugin(function (chart, opts) {

        chart.on('tick.zoom', function () {
            if (opts.zoom)
                chart.paper().zoom(opts.zoom);
        });
    });


    //
    //  Optional Angular Integration
    //  ==================================
    //
    //  To create the angular module containing giotto directive:
    //
    //      d3.giotto.angular.module(angular)
    //
    //  To add all visualizations to the module
    //
    //      d3.giotto.angular.addAll()
    //
    //  To register the module and add all viausizations
    //
    //      d3.giotto.angular.module(angular).addAll();
    //
    g.angular = (function () {
        var ag = {},
            mod;

        ag.module = function (angular, moduleName, deps) {

            if (!arguments.length) return mod;

            if (!mod) {
                moduleName = moduleName || 'giotto';
                deps = deps || [];

                mod = angular.module(moduleName, deps);

                mod.config(['$compileProvider', function (compileProvider) {

                        mod.directive = function (name, factory) {
                            compileProvider.directive(name, factory);
                            return (this);
                        };

                    }])

                    .directive('jstats', function () {
                        return {
                            link: function (scope, element, attrs) {
                                var mode = attrs.mode ? +attrs.mode : 1;
                                g.require(['stats'], function () {
                                    var stats = new Stats();
                                    stats.setMode(mode);
                                    scope.stats = stats;
                                    element.append(angular.element(stats.domElement));
                                });
                            }
                        };
                    });
            }
            return ag;
        };

        ag.directive = function (vizType, name, injects) {

            if (!mod) {
                g.log.warn('No angular module, cannot add directive');
                return;
            }

            injects = injects ? injects.slice() : [];
            if (!name) {
                name = vizType.vizName();
                name = mod.name.toLowerCase() + name.substring(0,1).toUpperCase() + name.substring(1);
            }

            function startViz(scope, element, options) {
                options.scope = scope;
                var viz = vizType(element[0], options);
                options = viz.options();
                element.data(name, viz);

                if (_.isFunction(options.angular))
                    options.angular(viz, options);

                scope.$emit('giotto-viz', viz);
                viz.start();
            }

            injects.push(function () {
                var injected = arguments;
                return {
                    //
                    // Create via element tag or attribute
                    restrict: 'AE',
                    //
                    link: function (scope, element, attrs) {
                        var viz = element.data(name);
                        if (!viz) {
                            var options = getOptions(attrs),
                                require = options.require;
                            if (require) {
                                if (!g._.isArray(require)) require = [require];
                                g.require(require, function (opts) {
                                    extend(options, opts);
                                    startViz(scope, element, options);
                                });
                            } else
                                startViz(scope, element, options);
                        }
                    }
                };
            });

            return mod.directive(name, injects);
        };

        //  Load all visualizations into angular 'giotto' module
        ag.addAll = function (injects) {
            //
            // Loop through d3 extensions and create directives
            // for each Visualization class
            g.log.info('Adding giotto visualization directives');

            angular.forEach(g.viz, function (vizType) {
                g.angular.directive(vizType, null, injects);
            });

            return ag;
        };

        return ag;
    }());


    return d3;
}));