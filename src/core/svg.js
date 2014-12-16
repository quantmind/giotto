    //
    //  SVG group
    //  ================
    g.group.svg = function (paper, p) {
        var container = paper.svg(true),
            elem = p.before ? container.insert('g', p.before) : container.append('g'),
            _ = svg_implementation(paper, p);

        // translate the group element by the required margins
        elem.attr("transform", "translate(" + p.margin.left + "," + p.margin.top + ")");
        return g.group(paper, elem.node(), p, _);
    };
