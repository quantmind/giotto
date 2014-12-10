    //
    // Add mission colors for graph
    function chartColors (paper, opts) {
        if (!opts.color)
            opts.color = paper.pickColor();

        if (opts.fill === true)
            opts.fill = d3.rgb(opts.color).brighter();

        activeColors(opts);
    }

    function activeColors(opts) {
        var a = opts.active;
        if (!a)
            a = opts.active = {};

        if (a.fill === 'darker')
            a.fill = d3.rgb(opts.fill).darker();
        else if (a.fill === 'brighter')
            a.fill = d3.rgb(opts.fill).brighter();

        if (a.color === 'darker')
            a.color = d3.rgb(opts.color).darker();
        else if (a.color === 'brighter')
            a.color = d3.rgb(opts.color).brighter();
    }

    function barWidth (paper, data, opts) {
        if (opts.width === 'auto')
            return d3.round(0.8*(paper.innerWidth() / data.length));
        else
            return opts.width;
    }