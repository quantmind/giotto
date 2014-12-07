
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
