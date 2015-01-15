    //
    //  SVG group
    //  ================
    g.group.svg = function (paper, p) {
        var container = paper.svg(true),
            elem = p.before ? container.insert('g', p.before) : container.append('g'),
            _ = {};

        delete p.before;
        // translate the group element by the required margins
        elem.attr("transform", "translate(" + p.margin.left + "," + p.margin.top + ")");

        _.resize = function (group) {
            if (p.resize) {
                paper.svg()
                    .attr('width', p.size[0])
                    .attr('height', p.size[1]);
                group.resetAxis().render();
            }
        };

        var group = g.group(paper, elem.node(), p, _);

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
                        paper.event(d3.event.type).call(target);
                    }
                });
            });

            return selection;
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
