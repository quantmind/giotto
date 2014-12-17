    var tooltip;
    //
    //  Tooltip functionality for SVG paper
    g.paper.plugin('tooltip', {
        defaults: {
            className: 'd3-tip',
            show: true,
            fill: '#333',
            fillOpacity: 0.8,
            color: '#fff',
            padding: '5px',
            radius: '3px',
            template: function (d) {
                return "<strong>" + d.x + ": </strong><span>" + d.y + "</span>";
            }
        },

        svg: function (group, opts) {
            var paper = group.paper();

            if (paper.tip || !opts.tooltip.show) return;

            paper.tip = tooltip || createTip(opts);

            var active, draw;

            function hide (el) {
                if (active)
                    active.reset().render(el);
                active = null;
                paper.tip.hide();
                return el;
            }

            paper.tip.html(function () {
                draw = active.draw();
                return opts.tooltip.template({
                    x: draw.x()(active.data),
                    y: draw.y()(active.data)
                });
            });

            opts.activeEvents.forEach(function (event) {
                paper.on(event + '.tooltip', function () {
                    var el = d3.select(this),
                        a = this.__data__;
                    if (_.isArray(a)) a = a.paper;

                    if (d3.event.type === 'mouseout')
                        hide(el);
                    else if (a !== active) {
                        hide(el);
                        active = a;
                        if (!active) return;
                        //
                        active.highLight().render(el);
                        paper.tip.bbox(getScreenBBox(this)).show();
                    }
                });
            });
        },

        canvas: function (group, opts) {
            var paper = group.paper();

            if (paper.tip || !opts.tooltip.show) return;

            paper.tip = tooltip || createTip(opts);

            var active = [];

            opts.activeEvents.forEach(function (event) {
                paper.canvas().on(event + '.tooltip', function () {
                    var overlay = paper.select('.canvas-interaction-overlay'),
                        point, a;

                    // Create the overlay if not available
                    if (!overlay) {
                        overlay = paper.group(opts);
                        overlay.element().classed('canvas-interaction-overlay', true);
                    }
                    overlay.remove();
                    for (var i=0; i<active.length; ++i)
                        active[i].reset();
                    active = [];

                    if (d3.event.type === 'mouseout')
                        return;
                    else if (d3.event.type === 'mousemove')
                        point = d3.mouse(this);
                    else
                        point = d3.touches(this)[0];
                    active = paper.canvasDataAtPoint(point);

                    //if (tip)
                    //    tip.show();

                    if (active.length) {
                        var ctx = overlay.clear().context();
                        for (i=0; i<active.length; ++i) {
                            a = active[i];
                            a.group().transform(ctx);
                            a.highLight().render(ctx);
                        }
                    }
                });
            });

            function tooltipEvent (ctx, p) {

            }

            function clearActive () {

            }

        }
    });


    function createTip (options) {
        var opts = options.tooltip,
            font = extend({}, options.font, opts.font);
        tooltip = g.tip();
        tooltip.attr('class', opts.className)
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
        return tooltip;
    }
    //
    // Returns a tip handle
    g.tip = function () {
        var direction = d3_tip_direction,
            offset = d3_tip_offset,
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
                poffset = offset.call(tip),
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
                top: (coords.top + poffset[0]) + scrollTop + 'px',
                left: (coords.left + poffset[1]) + scrollLeft + 'px'
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
        // Returns offset or
        tip.offset = function (v) {
            if (!arguments.length) return offset;
            offset = v === null ? v : d3.functor(v);
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

        function d3_tip_direction() {
            return 'n';
        }

        function d3_tip_offset() {
            return [0, 0];
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

        function direction_n() {
            return {
                top: bbox.n.y - node.offsetHeight,
                left: bbox.n.x - node.offsetWidth / 2
            };
        }

        function direction_s() {
            return {
                top: bbox.s.y,
                left: bbox.s.x - node.offsetWidth / 2
            };
        }

        function direction_e() {
            return {
                top: bbox.e.y - node.offsetHeight / 2,
                left: bbox.e.x
            };
        }

        function direction_w() {
            return {
                top: bbox.w.y - node.offsetHeight / 2,
                left: bbox.w.x - node.offsetWidth
            };
        }

        function direction_nw() {
            return {
                top: bbox.nw.y - node.offsetHeight,
                left: bbox.nw.x - node.offsetWidth
            };
        }

        function direction_ne() {
            return {
                top: bbox.ne.y - node.offsetHeight,
                left: bbox.ne.x
            };
        }

        function direction_sw() {
            return {
                top: bbox.sw.y,
                left: bbox.sw.x - node.offsetWidth
            };
        }

        function direction_se() {
            return {
                top: bbox.se.y,
                left: bbox.e.x
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
