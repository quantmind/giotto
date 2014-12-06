
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
