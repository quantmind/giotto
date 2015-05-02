    var tooltip;
    //
    //  Tooltip functionality
    g.paper.plugin('tooltip', {
        deep: ['font'],

        defaults: {
            className: 'd3-tip',
            fill: '#deebf7',
            fillOpacity: 0.8,
            color: '#222',
            padding: '8px',
            radius: '3px',
            offset: [20, 20],
            template: function (d) {
                return "<p><span style='color:"+d.c+"'>" + d.l + "</span>  <strong>" +
                        d.x + ": </strong><span>" + d.y + "</span></p>";
            },
            font: {
                size: '14px'
            }
        },

        init: function (group) {
            var paper = group.paper();
            if (!paper.showTooltip) activateTooltip(paper);
        }
    });


    function activateTooltip (paper) {
        var opts = paper.options(),
            tooltip;

        paper.showTooltip = function () {
            if (!tooltip) tooltip = gitto_tip(opts).offset(opts.tooltip.offset);
            show();
            return paper;
        };

        paper.hideTooltip = function () {
            if (tooltip) tooltip.hide();
            return paper;
        };

        paper.removeTooltip = function () {
            if (tooltip) tooltip.hide();
            opts.tooltip.show = false;
            tooltip = null;
            return paper;
        };

        paper.on('active.tooltip', function () {
            if (tooltip) {
                tooltip.active = this;
                show();
            }
        }).on('activeout.tooltip', function () {
            if (tooltip) {
                tooltip.active.splice(0);
                tooltip.hide();
            }
        });

        paper.task(function () {
            if (opts.tooltip.show) show();
        });

        if (opts.tooltip.show) paper.showTooltip();

        function show () {
            var active = tooltip.active;
            if (!active.length) return tooltip.hide();

            var bbox = getBbox(active[0]),
                direction = bbox.tooltip || 'n';
            if (active.length > 1) {
                direction = 'e';
                for (var i=1; i<active.length; ++i) {
                    var bbox2 = getBbox(active[i]);
                    bbox[direction].y += bbox2[direction].y;
                }
                bbox[direction].y /= active.length;
            }
            tooltip.bbox(bbox).direction(direction).show();
        }

        function getBbox (node) {
            if (isFunction(node.bbox)) return node.bbox();
            else return getScreenBBox(node);
        }
    }


    function gitto_tip (options) {
        var opts = options.tooltip,
            font = extend({}, options.font, opts.font),
            tip = g.tip();

        tip.active = [];

        tip.attr('class', opts.className)
           .style({
                background: opts.fill,
                opacity: opts.fillOpacity,
                color: opts.color,
                padding: opts.padding,
                'border-radius': opts.radius,
                font: fontString(font)
            });

        if (opts.className === 'd3-tip' && tooltipCss) {
            tooltipCss['d3-tip:after'].color = opts.fill;
            addCss('', tooltipCss);
            tooltipCss = null;
        }

        tip.html(function () {
            var html = '',
                data, draw, template;

            for (var i=0; i<tip.active.length; ++i) {
                data = tip.active[i];
                if (!data.draw) data = d3.select(data).datum();
                draw = data.draw();
                template = tooltip_template(draw);

                html += template({
                    c: data.color,
                    l: draw.label() || 'serie',
                    x: draw.formatX(draw.x()(data.data)),
                    y: draw.formatY(draw.y()(data.data))
                });
            }
            return html;
        });

        return tip;

        function tooltip_template (draw) {
            var o = draw.options();
            return o.tooltip ? o.tooltip.template || opts.template : opts.template;
        }
    }

    //
    // Returns a tip handle
    g.tip = function () {

        var direction = d3_tip_direction,
            offset = [0, 0],
            html = d3_tip_html,
            node = initNode(),
            tip = {},
            bbox;

        document.body.appendChild(node);

        // Public - show the tooltip on the screen
        //
        // Returns a tip
        tip.show = function () {
            var content = html.call(tip),
                dir = direction.call(tip),
                nodel = d3.select(node),
                i = directions.length,
                coords,
                scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
                scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;

            nodel.html(content)
                .style({
                opacity: 1,
                'pointer-events': 'all'
            });

            while (i--)
                nodel.classed(directions[i], false);

            coords = direction_callbacks.get(dir).apply(this);
            nodel.classed(dir, true).style({
                top: coords.top + scrollTop + 'px',
                left: coords.left + scrollLeft + 'px'
            });
            return tip;
        };

        // Public - hide the tooltip
        //
        // Returns a tip
        tip.hide = function() {
            d3.select(node).style({
                opacity: 0,
                'pointer-events': 'none'
            });
            return tip;
        };

        // Public: Proxy attr calls to the d3 tip container.  Sets or gets attribute value.
        //
        // n - name of the attribute
        // v - value of the attribute
        //
        // Returns tip or attribute value
        tip.attr = function(n, v) {
            if (arguments.length < 2 && typeof n === 'string') {
                return d3.select(node).attr(n);
            } else {
                var args = Array.prototype.slice.call(arguments);
                d3.selection.prototype.attr.apply(d3.select(node), args);
            }
            return tip;
        };

        // Public: Proxy style calls to the d3 tip container.  Sets or gets a style value.
        //
        // n - name of the property
        // v - value of the property
        //
        // Returns tip or style property value
        tip.style = function(n, v) {
            if (arguments.length < 2 && typeof n === 'string') {
                return d3.select(node).style(n);
            } else {
                var args = Array.prototype.slice.call(arguments);
                d3.selection.prototype.style.apply(d3.select(node), args);
            }
            return tip;
        };

        tip.bbox = function (x) {
            if (!arguments.length) return bbox;
            bbox = x;
            return tip;
        };

        // Public: Set or get the direction of the tooltip
        //
        // v - One of n(north), s(south), e(east), or w(west), nw(northwest),
        //     sw(southwest), ne(northeast) or se(southeast)
        //
        // Returns tip or direction
        tip.direction = function (v) {
            if (!arguments.length) return direction;
            direction = v === null ? v : d3.functor(v);
            return tip;
        };

        // Public: Sets or gets the offset of the tip
        //
        // v - Array of [x, y] offset
        //
        tip.offset = function (v) {
            if (!arguments.length) return offset;
            offset = v;
            return tip;
        };

        // Public: sets or gets the html value of the tooltip
        //
        // v - String value of the tip
        //
        // Returns html value or tip
        tip.html = function (v) {
            if (!arguments.length) return html;
            html = v === null ? v : d3.functor(v);
            return tip;
        };

        function d3_tip_direction () {
            return 'n';
        }

        function d3_tip_html() {
            return ' ';
        }

        var direction_callbacks = d3.map({
            n: direction_n,
            s: direction_s,
            e: direction_e,
            w: direction_w,
            nw: direction_nw,
            ne: direction_ne,
            sw: direction_sw,
            se: direction_se,
            c: direction_c
        }),

        directions = direction_callbacks.keys();

        function direction_n () {
            return {
                top: bbox.n.y - node.offsetHeight - offset[1],
                left: bbox.n.x - node.offsetWidth / 2
            };
        }

        function direction_s () {
            return {
                top: bbox.s.y + offset[1],
                left: bbox.s.x - node.offsetWidth / 2
            };
        }

        function direction_e () {
            return {
                top: bbox.e.y - node.offsetHeight / 2,
                left: bbox.e.x + offset[0]
            };
        }

        function direction_w () {
            return {
                top: bbox.w.y - node.offsetHeight / 2,
                left: bbox.w.x - node.offsetWidth - offset[0]
            };
        }

        function direction_nw () {
            return {
                top: bbox.nw.y - node.offsetHeight - offset[1],
                left: bbox.nw.x - node.offsetWidth - offset[0]
            };
        }

        function direction_ne () {
            return {
                top: bbox.ne.y - node.offsetHeight - offset[1],
                left: bbox.ne.x + offset[0]
            };
        }

        function direction_sw () {
            return {
                top: bbox.sw.y + offset[1],
                left: bbox.sw.x - node.offsetWidth - offset[0]
            };
        }

        function direction_se () {
            return {
                top: bbox.se.y + offset[1],
                left: bbox.e.x + offset[0]
            };
        }

        function direction_c () {
            return {
                top: bbox.c.y + offset[1],
                left: bbox.c.x + offset[0]
            };
        }

        function initNode() {
            var node = d3.select(document.createElement('div'));
            node.style({
                position: 'absolute',
                top: 0,
                opacity: 0,
                'pointer-events': 'none',
                'box-sizing': 'border-box'
            });
            return node.node();
        }

        return tip;
    };


    var tooltipCss = {'d3-tip:after': {}};
