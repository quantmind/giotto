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

    function pickColor (d) {
        if (d.fill && fillSpecials.indexOf(opts.fill) === -1)
            return d.fill;
        else
            return d.color;
    }

    function chartFormats (group, opts, m) {
        if (!opts.formatX) opts.formatX = formatter(group.xaxis());
        if (!opts.formatY) opts.formatY = formatter(group.yaxis());
    }

    function formatter (axis) {
        var format = axis.tickFormat();
        if (!format) {
            format = axis.scale().tickFormat ? axis.scale().tickFormat(1000) : d3_identity;
        }
        return format;
    }
