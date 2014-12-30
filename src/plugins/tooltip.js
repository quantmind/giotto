    var tooltip;
    //
    //  Tooltip functionality for SVG paper
    g.paper.plugin('tooltip', {

        defaults: {
            className: 'd3-tip',
            show: false,
            interact: true,
            fill: '#333',
            fillOpacity: 0.8,
            color: '#fff',
            padding: '5px',
            radius: '3px',
            offset: [20, 20],
            template: function (d) {
                return "<p><span style='color:"+d.c+"'>" + d.l + "</span>  <strong>" + d.x + ": </strong><span>" + d.y + "</span></p>";
            },
            font: {
                size: '14px'
            }
        },

        svg: tooltip_plugin,
        canvas: tooltip_plugin,
    });


    function tooltip_plugin (group, opts) {
        var paper = group.paper();

        if (opts.tooltip.show) opts.tooltip.interact = true;

        if (paper.tooltip || !opts.tooltip.interact) return;

        if (!tooltip && opts.tooltip.show) tooltip = gitto_tip(opts).offset(opts.tooltip.offset);

        paper.tooltip = tooltip;

        var data, draw;

        if (paper.type() === 'svg') {

            opts.activeEvents.forEach(function (event) {
                paper.on(event + '.tooltip', function () {
                    var el = d3.select(this);
                    data = el.size() ? el.datum() : null;

                    if (!data || d3.event.type === 'mouseout') {
                        if (tooltip) tooltip.hide(true);
                    } else if (data && data.reset) {
                        if (d3.event.active === undefined && tooltip) {
                            tooltip.hide(true);
                            d3.event.active = tooltip.active;
                        }
                        if (tooltip) tooltip.active.push(el);
                        data.highLight().render(el);
                    }
                }).on(event + '.tooltip-show', function () {
                    if (tooltip && tooltip.active.length) {
                        var bbox = getScreenBBox(tooltip.active[0].node()),
                            direction = 'n';
                        if (tooltip.active.length > 1) {
                            direction = 'e';
                            for (var i=1; i<tooltip.active.length; ++i) {
                                var bbox2 = getScreenBBox(tooltip.active[i].node());
                                bbox[direction].y += bbox2[direction].y;
                            }
                            bbox[direction].y /= tooltip.active.length;
                        }
                        tooltip.bbox(bbox).direction(direction).show();
                    }
                });
            });
        } else {

            var overlay = paper.canvasOverlay();

            opts.activeEvents.forEach(function (event) {

                overlay.on(event + '.tooltip', function () {
                    var ctx = this.getContext('2d'),
                        point, a;

                    d3.canvas.clear(ctx);

                    if (tooltip) tooltip.hide();

                    if (d3.event.type === 'mouseout')
                        return;

                    point = d3.canvas.mouse(this);
                    tooltip.active = paper.canvasDataAtPoint(point);

                    if (tooltip.active.length) {
                        var direction = 'n', bbox, bbox2;

                        for (var i=0; i<tooltip.active.length; ++i) {
                            a = tooltip.active[i];
                            a.group().transform(ctx);
                            a.highLight().render(ctx);
                            if (i && bbox) {
                                bbox2 = a.bbox();
                                direction = 'e';
                                bbox[direction].y += bbox2[direction].y;
                            } else if (!i)
                                bbox = a.bbox();
                        }
                        if (bbox) {
                            bbox[direction].y /= tooltip.active.length;
                            tooltip.bbox(bbox).direction(direction).show();
                        }
                    }
                });
            });
        }
    }


    function gitto_tip (options) {
        var opts = options.tooltip,
            font = extend({}, options.font, opts.font),
            tip = g.tip(),
            hide = tip.hide;

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
                data, draw;
            for (var i=0; i<tip.active.length; ++i) {
                data = tip.active[i];
                if (data.datum) data = data.datum();
                draw = data.draw();

                html += opts.template({
                    c: data.color,
                    l: draw.label() || 'serie',
                    x: draw.formatX(draw.x()(data.data)),
                    y: draw.formatY(draw.y()(data.data))
                });
            }
            return html;
        });

        tip.hide = function (render) {
            for (var i=0; i<tip.active.length; ++i) {
                var data = tip.active[i];
                if (data.datum) data = data.datum();
                data.reset();
                if (render) data.render(tip.active[i]);
            }
            tip.active = [];
            hide();
        };

        return tip;
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
            se: direction_se
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
