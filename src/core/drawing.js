
    //
    // A drawing is drawn on a group
    function drawing (group, renderer, draw) {
        var uid = ++_idCounter,
            x = d3_geom_pointX,
            y = d3_geom_pointY,
            size = default_size,
            changed,
            name,
            data,
            opts,
            formatX,
            formatY,
            label,
            dataConstructor;

        draw = highlightMixin(drawingOptions, draw);

        var set = draw.set;

        draw.uid = function () {
            return 'giottodraw' + uid;
        };

        draw.remove = noop;

        draw.render = function () {
            if (renderer)
                return renderer.apply(draw);
        };

        draw.group = function () {
            return group;
        };

        draw.draw = function () {
            return draw;
        };

        draw.each = function (callback) {
            if (data)
                data.forEach(function (d) {
                    callback.call(d);
                });
            else
                callback.call(draw);
            return draw;
        };

        draw.renderer = function (_) {
            if (arguments.length === 0) return renderer;
            renderer = _;
            return draw;
        };

        draw.options = function (_) {
            if (arguments.length === 0) return opts;
            opts = _;
            if (isFunction(opts.x)) draw.x(opts.x);
            if (isFunction(opts.y)) draw.y(opts.y);
            if (opts.formatX) formatX = _format(opts.formatX);
            if (opts.formatY) formatY = _format(opts.formatY);
            draw.init(draw, opts);
            return draw;
        };

        // set a value and its default
        draw.set = function (name, value) {
            if (pointOptions.indexOf(name) === -1) {
                opts[name] = value;
            } else if (data) {
                data.forEach(function (d) {
                    d.set(name, value);
                });
            } else
                set(name, value);
            return draw;
        };

        draw.x = function (_) {
            if (arguments.length === 0) return x;
            x = d3_functor(_);
            return draw;
        };

        draw.y = function (_) {
            if (arguments.length === 0) return y;
            y = d3_functor(_);
            return draw;
        };

        draw.formatX = function (x) {
            if (!formatX) formatX = d3.format('n');
            return formatX(x);
        };

        draw.formatY = function (y) {
            if (!formatY) formatY = d3.format('n');
            return formatY(y);
        };

        draw.size = function (_) {
            if (arguments.length === 0) return size;
            size = d3_functor(_);
            return draw;
        };

        draw.name = function (_) {
            if (arguments.length === 0) return name;
            name = _;
            return draw;
        };

        draw.scalex = function () {
            var scalex = group.xaxis().scale();
            return function (d) {
                return scalex(x(d));
            };
        };

        draw.scaley = function () {
            var scaley = group.yaxis().scale();
            return function (d) {
                return scaley(y(d));
            };
        };

        // replace the data for this drawing
        draw.data = function (_) {
            if (arguments.length === 0) return data;
            changed = true;
            if (dataConstructor)
                data = dataConstructor.call(draw, _);
            else
                data = _;
            return draw;
        };

        draw.add = function (d) {
            if (dataConstructor)
                d = dataConstructor.call(draw, [d]);
            if (data)
                data.push(d[0]);
            else
                data = d;
            return draw;
        };

        draw.dataConstructor = function (_) {
            if (arguments.length === 0) return dataConstructor;
            dataConstructor = d3_functor(_);
            return draw;
        };

        draw.label = function (_) {
            if (arguments.length === 0) return label;
            label = _;
            return draw;
        };

        return draw;

        function _set(name, value) {
            if (typeof draw[name] === 'function')
                draw[name](value);
            else
                draw[name] = value;
        }

        function _format (format) {
            return isFunction(format) ? format : d3.format(format);
        }
    }

    // A mixin for highlighting elements
    //
    // THis is used by the drawing and paperData constructors
    function highlightMixin (parameters, d) {
        var values = {},
            opts,
            highlight = false;

        d || (d = {});

        d.factor = function () {
            return d.group().factor();
        };

        d.paper = function () {
            return d.group().paper();
        };

        d.highLight = function () {
            if (highlight) return d;
            highlight = true;

            var a = d.active,
                v;
            if (a) {
                parameters.forEach(function (name) {
                    v = a[name];
                    if (v) {
                        if (typeof v === 'string') {
                            if (v === 'darker')
                                v = d3.rgb(values[name]).darker();
                            else if (v === 'brighter')
                                v = d3.rgb(values[name]).brighter();
                            else if (v.substring(v.length-1) === '%')
                                v = 0.01 * v.substring(0,v.length-1) * values[name];
                        }
                        d[name] = v;
                    }
                });
            }
            return d;
        };

        // set a value and its default
        d.set = function (name, value) {
            if (parameters.indexOf(name) > -1) {
                values[name] = value;
                d[name] = value;
            }
            return d;
        };

        d.reset = function () {
            highlight = false;
            parameters.forEach(function (name) {
                d[name] = values[name];
            });
            return d;
        };

        d.init = function (data, opts, dd) {
            var value;
            parameters.forEach(function (name) {
                value = data[name] || opts[name];
                if (isFunction(value) && dd) value = value(dd);
                values[name] = value;
            });
            if (opts.active) {
                if (!data.active)
                    data.active = {};
                copyMissing(opts.active, data.active);
            }
            return d.reset();
        };

        d.setBackground = function (e) {
            d.group().setBackground(d, e);
            return d;
        };

        d.inRange = noop;

        return d;
    }

    function pathdraw(group, render, draw) {
        var type = group.type(),
            bisector = d3.bisector(function (d) {return d.sx;}).left,
            data, ordered;

        draw = drawing(group, render, draw);

        draw.bisector = d3.bisector(function (d) {return d.sx;}).left;

        draw.each = function (callback) {
            callback.call(draw);
            return draw;
        };

        draw.path_line = function () {
            var opts = draw.options();

            return d3[type].line()
                            .interpolate(opts.interpolate)
                            .x(function (d) {return d.sx;})
                            .y(function (d) {return d.sy;});
        };

        draw.path_area = function () {
            var opts = draw.options(),
                scaley = group.yaxis().scale();

            return d3[type].area()
                                .interpolate(opts.interpolate)
                                .x(function (d) {return d.sx;})
                                .y0(scaley(scaley.domain()[0]))
                                .y1(function (d) {return d.sy;});
        };

        draw.path_data = function () {
            var sx = draw.x(),
                sy = draw.y(),
                scalex = group.xaxis().scale(),
                scaley = group.yaxis().scale();

            ordered = null;
            draw.symbol = d3[type].symbol().type(function (d) {return d.symbol || 'circle';})
                                           .size(draw.size());
            data = draw.data().map(function (d, i) {
                var xy = {
                    x: sx(d),
                    y: sy(d),
                    index: i,
                    data: d
                };
                xy.sx = scalex(xy.x);
                xy.sy = scaley(xy.y);
                return xy;
            });
            return data;
        };

        draw.bisect = function (x) {
            if (!ordered && data)
                ordered = data.slice().sort(function (a, b) {return d3.ascending(a.sx, b.sx);});
            if (ordered) {
                var index = bisector(ordered, x);
                if (index < ordered.length)
                    return ordered[index];
            }
        };

        return draw;
    }
    //
    // Manage attributes for data to be drawn on papers
    function paperData (draw, data, parameters, d) {
        var opts = draw.options();
        d = highlightMixin(parameters, d);
        d.data = data;

        if (isArray(data))
            d.init(d, opts);
        else {
            d.init(data, opts, data);
            d.active = data.active;
        }

        d.options = function () {
            return opts;
        };

        d.draw = function () {
            return draw;
        };

        d.group = function () {
            return draw.group();
        };

        return d;
    }

    function point (draw, data, size) {
        var d = paperData(draw, data, pointOptions);
        d.set('size', data.size === undefined ? size : data.size);
        return d;
    }

    var SymbolSize = {
            circle: 0.7,
            cross: 0.7,
            diamond: 0.7,
            "triangle-up": 0.6,
            "triangle-down": 0.6
        },

        drawingOptions = ['fill', 'color', 'fillOpacity',
                        'colorOpacity', 'lineWidth'],

        pointOptions = extendArray(['size', 'symbol'], drawingOptions),

        pieOptions = extendArray(['innerRadius', 'outerRadius'], drawingOptions),

        default_size = function (d) {
            return d.size;
        },

        point_size = function (d) {
            var s = +d.size;
            if (isNaN(s)) {
                var g = d.group();
                s = g.scale(g.xfromPX(d.size.substring(0, d.size.length-2)));
            }
            return s*s*(SymbolSize[d.symbol] || 1);
        },

        bar_size = function (d) {
            var w = d.size;
            if (typeof w === 'function') w = w();
            return w;
        };

