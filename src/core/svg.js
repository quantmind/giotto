    //
    //  SVG group
    //  ================
    g.group.svg = function (paper, p) {
        var container = paper.svg(true),
            elem = p.before ? container.insert('g', p.before) : container.append('g'),
            _ = svg_implementation(paper, p);

        delete p.before;
        // translate the group element by the required margins
        elem.attr("transform", "translate(" + p.margin.left + "," + p.margin.top + ")");
        var group = g.group(paper, elem.node(), p, _);

        group.clear = function () {
            group.element().selectAll('*').remove();
            return group;
        };

        group.setBackground = function (b, o) {
            if (!o) return;

            if (isObject(b)) {
                if (b.fillOpacity !== undefined)
                    o.attr('fill-opacity', b.fillOpacity);
                b = b.fill;
            }
            if (isString(b))
                o.attr('fill', b);
            return group;
        };

        return group;
    };
