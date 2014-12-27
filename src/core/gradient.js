
    g.gradient = function () {
        var colors = [{
                color: '#000',
                opacity: 1,
                offset: 0
            },
            {
                color: '#fff',
                opacity: 1,
                offset: 100
            }],
            x1 = 0,
            x2 = 200,
            y1 = 0,
            y2 = 200,
            direction = 'y',
            type = 'linear';

        function gradient (g) {
            g.each(function () {
                if (this.tagName.toLowerCase() === 'canvas') {
                    var ctx = this.getContext('2d');
                    type === 'linear' ? linear_canvas(ctx) : radial_canvas(ctx);
                } else {
                    var el = d3.select(this),
                        id = giotto_id(el),
                        gid = 'grad-' + id,
                        defs = svg_defs(el);

                    defs.select('#' + gid).remove();
                    var grad = type === 'linear' ? linearsvg(defs) : radialsvg(defs);
                    grad.attr('id', gid);
                    el.attr('fill', 'url(#' + gid + ')');
                }
            });
        }

        function linearsvg (svg) {
            var grad = svg.append('linearGradient')
                            .attr('x1', '0%')
                            .attr('y1', '0%');

            if (direction === 'x')
                grad.attr('x2', '100%')
                    .attr('y2', '0%');
            else
                grad.attr('y2', '100%')
                    .attr('x2', '0%');

            colors.forEach(function (c) {
                grad.append("stop")
                    .attr("offset", c.offset+"%")
                    .attr("stop-color", c.color)
                    .attr("stop-opacity", c.opacity === undefined ? 1 : c.opacity);
            });

            return grad;
        }

        function linear_canvas (ctx) {
            var grad;
            if (direction === 'x')
                grad = ctx.createLinearGradient(x1, y1, x2, y1);
            else
                grad = ctx.createLinearGradient(x1, y1, x1, y2);
            colors.forEach(function (c) {
                grad.addColorStop(0.01*c.offset, c.color);
            });
            ctx.fillStyle = grad;
            ctx.fill();
        }

        gradient.direction = function (_) {
            if (!arguments.length) return direction;
            direction = _;
            return gradient;
        };

        gradient.colors = function (_) {
            if (!arguments.length) return colors;
            colors = _;
            return gradient;
        };

        gradient.y1 = function (_) {
            if (!arguments.length) return y1;
            y1 = _;
            return gradient;
        };

        gradient.y2 = function (_) {
            if (!arguments.length) return y2;
            y2 = _;
            return gradient;
        };



        return gradient;
    };