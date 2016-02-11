    //
    //  SVG group
    //  ================
    g.group.svg = function (paper, p) {
        var container = paper.svg(true),
            elem = p.before ? container.insert('g', p.before) : container.append('g'),
            _ = {};

        delete p.before;

        _.resize = function (group) {
            if (p.resize) {
                paper.svg()
                    .attr('width', p.size[0])
                    .attr('height', p.size[1]);
                group.resetAxis().render();
            }
        };

        var group = g.group(paper, elem.node(), p, _),
            render = group.render;

        group.render = function () {
            group.element().attr("transform", "translate(" + group.marginLeft() + "," + group.marginTop() + ")");
            return render();
        };

        group.clear = function () {
            group.element().selectAll('*').remove();
            return group;
        };

        group.draw = function (selection) {
            return selection
                .attr('stroke', function (d) {return d.color;})
                .attr('stroke-opacity', function (d) {return d.colorOpacity;})
                .attr('stroke-width', function (d) {return d.lineWidth;})
                .attr('fill', function (d) {return d.fill;})
                .attr('fill-opacity', function (d) {return d.fill === 'none' ? undefined : d.fillOpacity;});
        };

        group.events = function (selection, uid, callback) {
            return paper.registerEvents(selection, g.constants.pointEvents, uid, callback);
        };

        return group;
    };

    function svg_font (selection, opts) {
        return selection
            .attr('fill', opts.color)
            .style({
                'font-size': opts.size ,
                'font-weight': opts.weight,
                'font-style': opts.style,
                'font-family': opts.family,
                'font-variant': opts.variant
            });
    }

    g.svg.font = function (selection, opts) {
        opts = extend({}, g.defaults.paper.font, opts);
        return svg_font(selection, opts);
    };
