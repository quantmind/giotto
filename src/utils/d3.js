
    function d3_identity(d) {
        return d;
    }

    function d3_functor (v) {
        return typeof v === "function" ? v : function() {
            return v;
        };
    }

    function d3_scaleExtent(domain) {
        var start = domain[0], stop = domain[domain.length - 1];
        return start < stop ? [ start, stop ] : [ stop, start ];
    }

    function d3_scaleRange(scale) {
        return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());
    }

    function d3_geom_pointX(d) {
        return d[0];
    }

    function d3_geom_pointY(d) {
        return d[1];
    }

    function d3_true() {
        return true;
    }