    //
    // Manage attributes for data to be drawn on papers
    function paperData (paper, opts, d) {
        // Default values
        var _fill = d.fill || opts.fill,
            _fillOpacity = d.fillOpacity || opts.fillOpacity,
            _stroke = d.color || opts.color,
            _strokeOpacity = d.colorOpacity || opts.colorOpacity,
            _lineWidth = d.lineWidth || opts.lineWidth,
            _symbol = d.symbol || opts.symbol,
            _size;

        if (!d.active)
            d.active = {};
        copyMissing(opts.active, d.active);
        activeColors(d);

        d.reset = function () {
            d.fill = _fill;
            d.fillOpacity = _fillOpacity;
            d.color = _stroke;
            d.colorOpacity = _strokeOpacity;
            d.lineWidth = _lineWidth;
            d.symbol = _symbol;
            d.size(_size);
            return d;
        };

        d.highLight = function () {
            var a = d.active;
            _replace('fill', a);
            _replace('fillOpacity', a);
            _replace('color', a);
            _replace('colorOpacity', a);
            _replace('symbol', a);
            if (a.lineWidth)
                d.lineWidth *= a.lineWidth;
            if (a.size)
                d._size *= a.size;
            return d;
        };

        d.size = function (x) {
            if (!arguments.length)
                if (d.symbol) {
                    return d._size*d._size*(SymbolSize[d.symbol] || 1);
                } else
                    return d._size;
            else {
                _size = +x;
                d._size = _size;
                return d;
            }
        };

        return d;

        function _replace(name, o) {
            if (o[name])
                d[name] = o[name];
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


    var SymbolSize = {
        circle: 0.7,
        cross: 0.7,
        diamond: 0.7,
        "triangle-up": 0.6,
        "triangle-down": 0.6
    };
