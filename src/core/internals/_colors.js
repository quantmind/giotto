
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
