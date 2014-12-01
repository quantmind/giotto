//      Giotto - v0.1.0

//      Compiled 2014-12-01.
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

    //
    //  Create an angular module for visualizations
    //
    g.angular = {
        module: function (angular, moduleName, deps) {
            moduleName = moduleName || 'giotto';
            deps = deps || [];

            return angular.module(moduleName, deps)

                    .directive('jstats', function () {
                        return {
                            link: function (scope, element, attrs) {
                                var mode = attrs.mode ? +attrs.mode : 1;
                                require(rcfg.min(['stats']), function () {
                                    var stats = new Stats();
                                    stats.setMode(mode);
                                    scope.stats = stats;
                                    element.append(angular.element(stats.domElement));
                                });
                            }
                        };
                    });
        },

        directive: function (angular, name, vizType, moduleName, injects) {
            moduleName = moduleName || 'giotto';
            injects = injects ? injects.slice() : [];
            var dname = moduleName.toLowerCase() + name.substring(0,1).toUpperCase() + name.substring(1);

            injects.push(function () {
                var injected = arguments;
                return {
                    //
                    // Create via element tag or attribute
                    restrict: 'AE',
                    //
                    link: function (scope, element, attrs) {
                        var viz = element.data(dname);
                        if (!viz) {
                            var options = getOptions(attrs);
                            options.scope = scope;
                            viz = vizType(element[0], options);
                            element.data(dname, viz);
                            scope.$emit('giotto-viz', viz);
                            viz.start();
                        }
                    }
                };
            });

            angular.module(moduleName).directive(dname, injects);
        },
        //
        //  Load all visualizations into angular 'giotto' module
        addAll: function (angular, moduleName, deps, injects) {
            g.angular.module(angular, moduleName, deps);
            //
            // Loop through d3 extensions and create directives
            // for each Visualization class
            angular.forEach(g.viz, function (vizType, name) {
                g.angular.directive(angular, name, vizType, moduleName, injects);
            });
        }
    };

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


    g.xyfunction = function (X, funy) {
        var xy = [];
        if (isArray(X))
            X.forEach(function (x) {
                xy.push([x, funy(x)]);
            });
        return xy;
    };


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

    g.defaults = {};

    g.defaults.axis = {
        color: '#000',
        tickSize: 0.05,
        minTickSize: null
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
            interpolate: 'basis',
            width: 2
        },
        point: {
            symbol: 'circle',
            size: 8,
            fill: true,
            fillOpacity: 0.5,
            width: 1
        },
        bar: {
            width: 'auto',
            stroke: 'none',
            radius: 4
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
            components,
            componentMap,
            cidCounter,
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
        paper.size = function () {
            return [p.size[0], p.size[1]];
        };

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
            return s(r) - s(0);
        };

        paper.scalex = function (x) {
            return p.xAxis.scale()(x);
        };

        paper.scaley = function (y) {
            return paper.yAxis().scale()(y);
        };

        // Resize the paper and fire the resize event if resizing was performed
        paper.resize = function (size) {
            p._resizing = true;
            if (!size) {
                size = paper.boundingBox();
            }
            if (p.size[0] !== size[0] || p.size[1] !== size[1]) {
                g.log.info('Resizing paper');
                p.size = size;
                paper.refresh();
            }
            p._resizing = false;
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
            if (isArray(xy[0]) && xy[0].length === 2) {
                var xydata = [];
                xy.forEach(function (xy) {
                    xydata.push({x: x(xy[0]), y: y(xy[1])});
                });
                xy = xydata;
            } else {
                xy.forEach(function (xy) {
                    xy.x = x(xy.x);
                    xy.y = y(xy.y);
                });
            }
            data.data = xy;
            data.xrange = [xmin, xmax];
            data.yrange = [ymin, ymax];
            return data;
        };

        // pick a unique color, never picked before
        paper.pickColor = function () {
            var c = p.colors[color++];
            if (color === p.colors.length) {
                // TODO: lighetn the colors maybe?
                color = 0;
            }
            return c;
        };

        //
        // Add a new component to the paper and return the component id
        paper.addComponent = function (callback) {
            var cid = ++cidCounter;
            components.push(callback);
            componentMap[cid] = callback;
            callback();
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

        paper.render = function () {
            components.forEach(function (callback) {
                callback();
            });
        };

        // Clear the paper from all compoents
        // It erases everything
        paper.clear = function () {
            components = [];
            componentMap = {};
            cidCounter = 0;
            color = 0;
            return paper;
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
            current;

        p.xAxis = d3.svg.axis();
        p.yAxis = [d3.svg.axis(), d3.svg.axis()];

        paper.refresh = function () {
            svg.attr('width', p.size[0])
               .attr('height', p.size[1]);
            p.event.refresh({type: 'refresh', size: p.size.slice(0)});
            return paper;
        };

        paper.clear = function () {
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

        paper.group = function () {
            current = current.append('g');
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
            opts.color = opts.color || paper.pickColor();

            var container = current;

            paper.addComponent(function () {

                var chart = container.select("path.line"),
                    scalex = paper.scalex,
                    scaley = paper.scaley,
                    line = opts.area ? d3.svg.area() : d3.svg.line();

                line.interpolate(opts.interpolate)
                    .x(function(d) {
                        return scalex(d.x);
                    })
                    .y(function(d) {
                        return scaley(d.y);
                    });

                if (!chart.node())
                    chart = current.append('path')
                                    .attr('class', 'line');

                chart
                    .classed('area', opts.area)
                    .attr('stroke', opts.color)
                    .attr('stroke-width', opts.width)
                    .datum(data)
                    .attr('d', line);

                opts.chart = chart;
                return opts;
            });

            return opts;
        };

        // Draw points
        paper.points = function (data, opts) {
            opts || (opts = {});
            copyMissing(p.point, opts);
            opts.color = opts.color || paper.pickColor();

            var container = current;

            paper.addComponent(function () {
                var chart = container.select("g.points"),
                    scalex = paper.scalex,
                    scaley = paper.scaley,
                    fill = opts.fill;

                if (fill === true)
                    opts.fill = fill = d3.rgb(opts.color).brighter();

                if (!chart.node())
                    chart = container.append("g")
                                    .attr('class', 'points');

                chart.attr('stroke', opts.color)
                        .attr('stroke-width', opts.width);
                if (fill)
                    chart.attr('fill', fill).attr('fill-opacity', opts.fillOpacity);
                else
                    chart.attr('fill', 'none');

                if (opts.symbol === 'circle') {
                    var radius = 0.5*opts.size;
                    chart.selectAll(".point")
                                .data(data)
                                .enter().append("circle")
                                .attr('class', 'point')
                                .attr('cx', function (d) {return scalex(d.x);})
                                .attr('cy', function (d) {return scaley(d.y);})
                                .attr('r', function (d) {return s(d.radius, radius);});
                } else if (opts.symbol === 'square') {
                    var size = opts.size;
                    chart.selectAll(".point")
                                .data(data)
                                .enter().append("rect")
                                .attr('class', 'point')
                                .attr('x', function (d) {return scalex(d.x) - 0.5*s(d.size, size);})
                                .attr('y', function (d) {return scaley(d.y) - 0.5*s(d.size, size);})
                                .attr('height', function (d) {return  s(d.size, size);})
                                .attr('width', function (d) {return  s(d.size, size);});
                }
                opts.chart = chart;
                return opts;
            });

            return opts;

            function s(v, d) {
                return v === undefined ? d : v;
            }
        };

        // Draw a barchart
        paper.barchart = function (data, opts) {
            opts || (opts = {});
            copyMissing(p.bar, opts);
            opts.color = opts.color || paper.pickColor();

            var container = current;

            paper.addComponent(function () {

                var scalex = paper.scalex,
                    scaley = paper.scaley,
                    width = opts.width,
                    zero = scaley(0),
                    chart = container.select('g.barchart');

                if (width === 'auto')
                    width = d3.round(0.8*(paper.innerWidth() / data.length));

                if (!chart.node())
                    chart = container.append("g")
                                .attr('class', 'barchart');
                chart.attr('stroke', opts.stroke).attr('fill', opts.color);

                var bar = chart
                        .attr('stroke', opts.stroke)
                        .attr('fill', opts.color)
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

                if (opts.radius)
                    bar.attr('rx', opts.radius).attr('ry', opts.radius);

                opts.chart = chart;
                return opts;
            });

            return opts;
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

        // Setup the svg paper
        paper.clear();

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
                    paper.on('refresh', function () {
                        viz.refresh();
                    });
                }
                return paper;
            };

            viz.element = function () {
                return viz.paper().element();
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
                // simulated annealing, basically
                if ((alpha *= 0.99) < 0.005) {
                    event.end({type: "end", alpha: alpha = 0});
                    return true;
                }

                event.tick({type: "tick", alpha: alpha});
            };

            // Starts the visualization
            viz.start = function () {
                return viz.resume();
            };

            // refresh the visualization
            // By default it does nothing unless the paper is canvas in which case
            // it start the visualization
            viz.refresh = function () {
                if (paper && paper.type() === 'canvas')
                    this.start();
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

            viz.xyfunction = g.xyfunction;

            d3.rebind(viz, event, 'on');

            if (constructor)
                constructor(viz, opts);

            // Inject plugins
            for (var i=0; i < plugins.length; ++i)
                plugins[i](viz, opts);

            // if the onInit callback available, execute it
            if (opts.onInit) {
                var init = getObject(opts.onInit);
                if (isFunction(init))
                    init(viz);
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
        var cf = {},
            dimensions = {},
            cfdata;

        // Add a new dimension to the crossfilter
        cf.addDimension = function (name, callback) {
            if (!callback) {
                callback = function (d) {
                    return d[name];
                };
            }
            dimensions[name] = cfdata.dimension(callback);
        };

        cf.data = function () {
            return cfdata;
        };


        function build () {
            if (!g.crossfilter.lib)
                throw Error('Could not find crossfilter library');

            cfdata = g.crossfilter.lib(options.data);

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
    //
    //  Initaise paper
    function _initPaper (paper, p) {
        g.paper[p.type](paper, p);

        var width = paper.innerWidth(),
            height = paper.innerHeight();

        paper.xAxis().orient(p.xaxis.position).scale().range([0, width]);
        paper.yaxis(2).yAxis().orient(p.yaxis2.position).scale().range([height, 0]);
        paper.yaxis(1).yAxis().orient(p.yaxis.position).scale().range([height, 0]);
        //
        if (p.css)
            addCss('#giotto-paper-' + paper.uid(), p.css);
        //
        return d3.rebind(paper, p.event, 'on');
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
        p.event = d3.dispatch('refresh');
        return p;
    }

    d3.canvas.axis = function() {
        var scale = d3.scale.linear(),
            orient = d3_canvas_axisDefaultOrient,
            innerTickSize = 6,
            outerTickSize = 6,
            tickPadding = 3,
            tickArguments_ = [10],
            tickValues = null,
            tickFormat_;

        function axis (g) {
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

    g.paper.addType('canvas', function (paper, p) {
        var current,
            clear = paper.clear;

        p.xAxis = d3.canvas.axis();
        p.yAxis = [d3.canvas.axis(), d3.canvas.axis()];

        paper.refresh = function () {
            clearCanvas();
            paper.render();
            p.event.refresh({type: 'refresh', size: p.size.slice(0)});
            return paper;
        };

        paper.clear = function () {
            clearCanvas();
            return clear();
        };

        paper.current = function () {
            return current;
        };

        function clearCanvas() {
            var element = paper.element();
            element.selectAll('*').remove();
            current = paper.element().append("canvas")
                            .attr("width", p.size[0])
                            .attr("height", p.size[1]);
        }

        paper.clear();
    });


    g.createviz('chart', {
        margin: {top: 30, right: 30, bottom: 30, left: 30},
        chartTypes: ['bar', 'line', 'point', 'pie'],

        line: {show: true},
        point: {show: false},
        bar: {show: false},
        pie: {show: false}
    },

    function (chart, opts) {

        var paper = chart.paper(),
            series = [];

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
                data = [];

            series.forEach(function (serie) {

                if (isFunction (serie)) {
                    serie = serie(chart);
                }

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
            return chart;
        };

        chart.addSerie = function (serie) {
            return chart.addSeries([serie]);
        };

        chart.draw = function () {
            var data = opts.data;
            if (data === undefined && opts.src)
                return chart.loadData(chart.draw);
            if (g._.isFunction(data))
                data = data(chart);

            if (data) {
                chart.addSeries(data);

                if (show(opts.xaxis))
                    paper.drawXaxis();
                if (show(opts.yaxis))
                    paper.drawYaxis();
                if (show(opts.yaxis2, false))
                    paper.drawYaxis();
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

            if (add) {
                paper.group({'class': 'serie'});

                g.log.info('Add new serie to chart');

                series.push(serie);
                if (!serie.label)
                    serie.label = 'serie ' + series.length;

                opts.chartTypes.forEach(function (type) {
                    var o = serie[type];

                    if (o === undefined)
                        serie[type] = o = opts[type];

                    serie[type] = o.show ? chartTypes[type](chart, serie.data, o) : o;
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
        line: function (chart, data, opts) {
            return chart.paper().path(data, opts);
        },

        point: function (chart, data, opts) {
            return chart.paper().points(data, opts);
        },

        bar: function (chart, data, opts) {
            return chart.paper().barchart(data, opts);
        },

        pie: function (chart, data, opts) {
            return chart.paper().pie(data, opts);
        }
    };

    //
    //
    // Force layout example
    g.createviz('force', {
        nodes: 0,
        minRadius: 0.02,
        maxRadius: 0.08,
        theta: 0.8,
        friction: 0.9
    }, function (force, opts) {
        var nodes = [],
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

        force.addNode = function (o) {
            o.index = nodes.length;
            nodes.push(initNode(o));
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

        force.quadtree = function () {
            if (!q)
                q = d3.geom.quadtree(nodes);
            return q;
        };

        // Create a node with random radius
        force.randomNode = function () {
            var minRadius = +opts.minRadius,
                maxRadius = +opts.maxRadius,
                dr = maxRadius > minRadius ? maxRadius - minRadius : 0;
            return {radius: Math.random() * dr + minRadius};
        };

        force.drawCircles = function (color) {
            if (!color)
                color = d3.scale.category10();
            var paper = force.paper(),
                N = color.range().length;

            if (paper.type() === 'svg') {
                var svg = paper.clear().current();
                return svg.selectAll("circle")
                            .data(nodes)
                            .enter().append("svg:circle")
                            .attr("r", function (d) {
                                var r = paper.scale(d.radius);
                                return r > 2 ? r - 2 : 0;
                            })
                            .attr("cx", function (d) {
                                return paper.scalex(d.x);
                            })
                            .attr("cy", function (d) {
                                return paper.scaley(d.y);
                            })
                            .style("fill", function(d, i) { return color(i % N); });
            }
        };

        force.on("tick.main", function(e) {
            q = null;
            force.quadtree();
            friction = force.friction();
            i = -1; while (++i < nodes.length) {
                o = nodes[i];
                if (o.fixed) {
                    o.x = o.px;
                    o.y = o.py;
                } else {
                    o.x -= (o.px - (o.px = o.x)) * friction;
                    o.y -= (o.py - (o.py = o.y)) * friction;
                }
                q.visit(collide(nodes[i]));
            }
        });

        function collide (node) {
            var r = node.radius + 0.05,
                nx1 = node.x - r,
                nx2 = node.x + r,
                ny1 = node.y - r,
                ny2 = node.y + r;

            return function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== node)) {
                    var x = node.x - quad.point.x,
                        y = node.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = node.radius + quad.point.radius;
                    if (l < r) {
                        l = (l - r) / l * 0.5;
                        node.x -= x *= l;
                        node.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            };
        }

        // INTERNALS
        if (+opts.nodes) {
            // Add a set of random nodes if required
            force.nodes(d3.range(+opts.nodes).map(function() {
                return force.randomNode();
            }));
        }

        function initNode (o) {
            o.weight = 0;
            if (isNaN(o.x)) o.x = Math.random();
            if (isNaN(o.y)) o.y = Math.random();
            if (isNaN(o.px)) o.px = o.x;
            if (isNaN(o.py)) o.py = o.y;
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

        force.on('tick.links', function () {
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

        force.on('tick.gravity', function () {
            k = force.alpha() * opts.gravity;
            nodes = force.nodes();

            if (k) {
                for (i = 0; i < nodes.length; ++i) {
                    o = nodes[i];
                    if (!o.fixed) {
                        o.x += (0.5 - o.x) * k;
                        o.y += (0.5 - o.y) * k;
                    }
                }
            }
        });
    });

    //
    // Charge plugin
    g.viz.force.plugin(function (force, opts) {
        var charges,
            charge, nodes, q, i, k, o,
            chargeDistance2;

        g._.copyMissing({charge: -30, chargeDistance: Infinity}, opts);

        force.charge = function (x) {
            if (!arguments.length) return typeof opts.charge === "function" ? opts.charge : +opts.charge;
            opts.charge = x;
            return force;
        };

        force.chargeDistance = function(x) {
            if (!arguments.length) return +opts.chargeDistance;
            opts.chargeDistance2 = +x;
            chargeDistance2 = x * x;
            return force;
        };

        force.on('tick.charge', function () {
            // compute quadtree center of mass and apply charge forces
            nodes = force.nodes();
            charge = force.charge();
            if (charge && nodes.length) {
                if (!charges)
                    _init();

                d3_layout_forceAccumulate(q = force.quadtree(), force.alpha(), charges);
                i = -1; while (++i < nodes.length) {
                    if (!(o = nodes[i]).fixed) {
                        q.visit(repulse(o));
                    }
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
                if (quad.point !== node) {
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
                  quad.point.x += Math.random() - 0.5;
                  quad.point.y += Math.random() - 0.5;
                }
                var k = alpha * charges[quad.point.index];
                quad.charge += quad.pointCharge = k;
                cx += k * quad.point.x;
                cy += k * quad.point.y;
            }
            quad.cx = cx / quad.charge;
            quad.cy = cy / quad.charge;
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



    //
    //  Sunburst visualization
    //
    //  In addition to standard Viz parameters:
    //      labels: display labels or not (default false)
    //      padding: padding of sunburst (default 10)
    g.createviz('sunBurst', {
        // Show labels
        labels: true,
        // sunburst padding
        addorder: false,
        // Add the order of labels if available in the data
        padding: 10,
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
            var size = paper.size(),
                dim = Math.min(size[0], size[1]);
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

            var size = paper.clear().size(),
                width = size[0]/2,
                height = size[1]/2,
                // Create the partition layout
                partition = d3.layout.partition()
                    .value(function(d) { return d.size; })
                    .sort(function (d) { return d.order === undefined ? d.size : d.order;}),
                svg = paper.group()
                          .attr("transform", "translate(" + width + "," + height + ")"),
                sunburst = svg.append('g').attr('class', 'sunburst');

            radius = Math.min(width, height) - opts.padding;
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

        // Add a brush to the paper if not already available
        paper.addBrush = function (options) {
            if (_.isObject(options))
                extend(opts.brush, options);

            if (!cid) {
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
                    }

                });
            }

            brushstart();
            brushmove();
            brushend();


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
    //
    //  Add grid functionality to svg paper
    g.paper.svg.plugin('grid', {
        color: '#333',
        background: {
            color: '#c6dbef',
            opacity: 0.4
        },
        opacity: 0.3
    },

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

    //
    //  Add zoom functionality to an svg paper
    g.paper.svg.plugin('zoom', {
        x: true,
        y: true,
        extent: [1, 10]
    },

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

    //
    //  Add grid functionality to charts
    g.viz.chart.plugin(function (chart, opts) {

        chart.on('tick.zoom', function () {
            if (opts.zoom)
                chart.paper().zoom(opts.zoom);
        });
    });


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


    return d3;
}));