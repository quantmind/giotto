    //
    // Add mission colors for graph
    function chartColors (paper, opts) {
        if (!opts.color)
            opts.color = paper.pickColor();

        if (opts.fill === true)
            opts.fill = d3.rgb(opts.color).brighter().toString();

        activeColors(opts);
    }

    function activeColors(opts) {
        var a = opts.active;
        if (!a)
            a = opts.active = {};

        if (a.fill === 'darker')
            a.fill = d3.rgb(opts.fill).darker().toString();
        else if (a.fill === 'brighter')
            a.fill = d3.rgb(opts.fill).brighter().toString();

        if (a.color === 'darker')
            a.color = d3.rgb(opts.color).darker().toString();
        else if (a.color === 'brighter')
            a.color = d3.rgb(opts.color).brighter().toString();
    }
