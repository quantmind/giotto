
    var drawingOptions = ['fill', 'fillOpacity', 'color', 'colorOpacity',
                          'lineWidth'];
    //
    // A drawing is drawn on a group by the renderer function
    function drawing (group, renderer, draw) {
        var uid = giotto_id(),
            x = d3_geom_pointX,
            y = d3_geom_pointY,
            opts = {},
            pointOptions = drawingOptions,
            size = function (d) {return d.size;},
            changed,
            name,
            data,
            formatX,
            formatY,
            label,
            dataConstructor,
            set;

        draw = highlightMixin(draw);
        set = draw.set;

        draw.uid = function () {
            return uid;
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

        // set a value and its default (override highlight)
        draw.set = function (name, value) {
            opts[name] = value;
            set(name, value);
            if (data && pointOptions.indexOf(name) > -1) {
                data.forEach(function (d) {
                    d.set(name, value);
                });
            }
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

        draw.add = function (d) {
            if (dataConstructor)
                d = dataConstructor.call(draw, [d]);
            if (data)
                data.push(d[0]);
            else
                data = d;
            return draw;
        };

        // replace the data for this drawing
        draw.data = function (_) {
            if (!arguments.length) return data;
            changed = true;
            if (dataConstructor)
                data = dataConstructor.call(draw, _);
            else
                data = _;
            return draw;
        };

        draw.dataConstructor = function (_) {
            if (!arguments.length) return dataConstructor;
            dataConstructor = d3_functor(_);
            return draw;
        };

        draw.label = function (_) {
            if (!arguments.length) return label;
            label = _;
            return draw;
        };

        draw.pointOptions = function (_) {
            if (!arguments.length) return pointOptions;
            pointOptions = _;
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
    // This is used by the drawing and drawingData constructors
    function highlightMixin (d) {
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
                d.pointOptions().forEach(function (name) {
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
            if (d.pointOptions().indexOf(name) > -1) {
                values[name] = value;
                d[name] = value;
            }
            return d;
        };

        d.reset = function () {
            highlight = false;
            d.pointOptions().forEach(function (name) {
                d[name] = values[name];
            });
            return d;
        };

        d.init = function (data, opts, dd) {
            var value;
            d.pointOptions().forEach(function (name) {
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
    //
    // Manage a data point to be drawn on a drawing
    function drawingData (draw, data, d) {
        var opts = draw.options();
        d = highlightMixin(d);
        d.data = data;

        d.options = function () {
            return opts;
        };

        d.draw = function () {
            return draw;
        };

        d.group = function () {
            return draw.group();
        };

        d.pointOptions = function () {
            return draw.pointOptions();
        };

        if (isArray(data))
            d.init(d, opts);
        else {
            d.init(data, opts, data);
            d.active = data.active;
        }

        return d;
    }
