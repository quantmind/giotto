    //
    // Manage attributes for data to be drawn on papers
    function paperData (paper, opts, d) {
        // Default values
        var values = {},
            highlight = false,
            _size;

        pointOptions.forEach(function (name) {
            values[name] = d[name] || opts[name];
        });
        values.size = 0;

        if (opts.active) {
            if (!d.active)
                d.active = {};
            copyMissing(opts.active, d.active);
            activeColors(d);
        }

        d.reset = function () {
            highlight = false;
            pointOptions.forEach(function (name) {
                _set(name, values[name]);
            });
            return d;
        };

        d.highLight = function () {
            if (highlight) return d;
            highlight = true;

            var a = d.active,
                v;
            if (a) {
                pointOptions.forEach(function (name) {
                    v = a[name];
                    if (v) {
                        if (multiplyOptions.indexOf(name) > -1)
                            v *= values[name];
                        _set(name, v);
                    }
                });
            }
            return d;
        };

        // set a value and its default
        d.set = function (name, value) {
            values[name] = value;
            _set(name, value);
            return d;
        };

        d.size = function (x) {
            if (!arguments.length)
                if (d.symbol) {
                    return _size*_size*(SymbolSize[d.symbol] || 1);
                } else
                    return _size;
            else {
                _size = +x;
                return d;
            }
        };

        d.options = function () {
            return opts;
        };

        d.forEach = function (callback) {
            callback(d);
        };

        return d;

        function _set(name, value) {
            if (typeof d[name] === 'function')
                d[name](value);
            else
                d[name] = value;
        }
    }


    function pieData (paper, opts, d) {
        // Default values
        if (_.isArray(d))
            d = {label: d[0], value: d[1]};
        if (!d.fill)
            d.fill = paper.pickColor();
        if (!d.color)
            d.color = d3.rgb(d.fill).darker();

        return paperData(paper, opts, d);
    }

    //
    // A paper component draw an array of paperData into a paper
    function paperComponent (data, component) {
        var opts = data.options ? data.options() : data[0].options();

        component.setOptions = function (name, value) {

            if (pointOptions.indexOf(name) === -1) {
                opts[name] = value;
            } else {
                data.forEach(function (d) {
                    d.set(name, value);
                });
            }
            return component;
        };

        component.data = function () {
            return data;
        };

        return component;
    }


    var SymbolSize = {
            circle: 0.7,
            cross: 0.7,
            diamond: 0.7,
            "triangle-up": 0.6,
            "triangle-down": 0.6
        },

        pointOptions = ['fill', 'color', 'fillOpacity',
                        'colorOpacity', 'lineWidth', 'size', 'symbol'],

        multiplyOptions = ['lineWidth', 'size'];
