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

        group.draw = function (selection) {
            return selection
                .attr('stroke', function (d) {return d.color;})
                .attr('stroke-opacity', function (d) {return d.colorOpacity;})
                .attr('stroke-width', function (d) {return d.lineWidth;})
                .attr('fill', function (d) {return d.fill;})
                .attr('fill-opacity', function (d) {return d.fillOpacity;});
        };

        group.events = function (selection, uid, callback) {
            var name = uid || p.giotto,
                target;

            p.activeEvents.forEach(function (event) {
                selection.on(event + '.' + name, function () {
                    if (uid && !paper.element().select('#' + uid).size())
                        selection.on(event + '.' + uid, null);
                    else {
                        target = callback ? callback.call(this) : this;
                        paper[d3.event.type].call(target);
                    }
                });
            });
            return selection;
        };

        return group;
    };

    function svg_font (selection, opts) {
        return selection.style({
            'fill': opts.color,
            'font-size': opts.size ,
            'font-weight': opts.weight,
            'font-style': opts.style,
            'font-family': opts.family,
            'font-variant': opts.variant
        });
    }
