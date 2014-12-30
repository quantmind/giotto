    //
    // Add mission colors for graph
    function chartColors (paper, opts) {
        chartColor(paper, opts);
        activeColors(opts);
    }

    var fillSpecials = [true, 'none', 'color'];

    function chartColor(paper, opts) {
        if (!opts.color)
            if (opts.fill && fillSpecials.indexOf(opts.fill) === -1)
                opts.color = d3.rgb(opts.fill).darker().toString();
            else
                opts.color = paper.pickColor();

        if (opts.fill === true)
            opts.fill = d3.rgb(opts.color).brighter().toString();
        else if (opts.fill === 'color')
            opts.fill = opts.color;

        return opts.color;
    }

    function chartFormats (group, opts, m) {
        var xaxis = group.xaxis(),
            yaxis = group.yaxis();
        m = m || 1000;
        if (!opts.formatX) opts.formatX = xaxis.tickFormat() || xaxis.scale().tickFormat(m);
        if (!opts.formatY) opts.formatY = yaxis.tickFormat() || yaxis.scale().tickFormat(m);
    }

    function activeColors(opts) {
        var a = opts.active = extend({}, opts.active);

        if (a.fill === 'darker')
            a.fill = d3.rgb(opts.fill).darker().toString();
        else if (a.fill === 'brighter')
            a.fill = d3.rgb(opts.fill).brighter().toString();

        if (a.color === 'darker')
            a.color = d3.rgb(opts.color).darker().toString();
        else if (a.color === 'brighter')
            a.color = d3.rgb(opts.color).brighter().toString();
    }
