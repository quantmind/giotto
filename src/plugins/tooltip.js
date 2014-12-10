
    var tooltipDefaults = {
        className: 'd3-tip',
        show: true,
        fill: '#333',
        fillOpacity: 0.8,
        color: '#fff',
        padding: '5px',
        radius: '3px',
        template: function (d) {
            return "<strong>" + d.label + ":</strong><span>" + d.value + "</span>";
        }
    };

    //
    //  Tooltip functionality for SVG paper
    g.paper.svg.plugin('tooltip', tooltipDefaults,

        function (paper, opts) {
            var tip = createTip(paper, opts.tooltip),
                active;

            paper.tooltip = function () {
                return tip;
            };

            function hide (el) {
                if (active)
                    active.reset().draw(el);
                active = null;
                if (tip)
                    tip.hide();
                return el;
            }

            if (tip)
                tip.html(function () {
                    return opts.tooltip.template(active);
                });

            paper.on('activein', function () {
                var el = d3.select(this),
                    a = this.__data__;
                if (_.isArray(a)) a = a[0];

                if (a === active) return;
                hide(el);
                active = a;
                if (!active) return;
                g.log.info('active in');
                //
                // For lines, the data is an array, pick the first element
                active.highLight().draw(el);

                if (tip)
                    tip.bbox(getScreenBBox(this)).show();

            }).on('activeout', function () {
                g.log.info('active out');
                hide(d3.select(this));
            });
        });

    //
    //  Tooltip functionality for CANVAS paper
    g.paper.canvas.plugin('tooltip', tooltipDefaults,

        function (paper, opts) {
            var tip = createTip(paper, opts.tooltip),
                active = [];

            paper.tooltip = function () {
                return tip;
            };

            opts.activeEvents.forEach(function (event) {
                paper.on(event + '.tooltip', function () {
                    var overlay = paper.container().select('.interaction-overlay').node(),
                        point;

                    // Create the overlay if not available
                    if (!overlay) {
                        paper.group({'class': 'interaction-overlay'});
                        overlay = paper.current();
                        paper.parent();
                    } else
                        overlay = overlay.getContext('2d');

                    for (var i=0; i<active.length; ++i)
                        paper.clear(overlay);

                    active = [];
                    if (d3.event.type === 'mouseout')
                        return;
                    else if (d3.event.type === 'mousemove')
                        point = d3.mouse(this);
                    else
                        point = d3.touches(this)[0];
                    active = paper.getDataAtPoint(point);

                    //if (tip)
                    //    tip.show();

                    if (active.length) {
                        paper.render(overlay);
                        for (i=0; i<active.length; ++i)
                            active[i].highLight().draw(overlay);
                    }
                });
            });

            function tooltipEvent (ctx, p) {

            }

            function clearActive () {

            }

        });



    function createTip (paper, opts) {
        if (!opts.show) return;
        var tip = g.tip(paper);
        tip.attr('class', opts.className)
           .style({
                background: opts.fill,
                opacity: opts.fillOpacity,
                color: opts.color,
                padding: opts.padding,
                'border-radius': opts.radius
            });
        if (opts.className === 'd3-tip' && tooltipCss) {
            tooltipCss['d3-tip:after'].color = opts.fill;
            addCss('', tooltipCss);
            tooltipCss = null;
        }
        return tip;
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
            var args = Array.prototype.slice.call(arguments);
            if (args[args.length - 1] instanceof SVGElement) target = args.pop();

            var content = html.apply(this, args),
                poffset = offset.apply(this, args),
                dir = direction.apply(this, args),
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


    var tooltipCss = {
        'd3-tip:after': {
            'box-sizing': 'border-box',
            display: 'inline',
            'font-size': '16px',
            width: '100%',
            'line-height': 1,
            position: 'absolute'
        },
        'd3-tip.n:after': {
            content: '"\\25BC"',
            margin: '-2px 0 0 0',
            top: '100%',
            left: 0,
            'text-align': 'center'
        },
        'd3-tip.e:after': {
            content: '"\\25C0"',
            margin: '-4px 0 0 0',
            top: '50%',
            left: '-8px'
        },
        'd3-tip.s:after': {
            content: '"\\25B2"',
            margin: '0 0 2px 0',
            top: '-8px',
            left: 0,
            'text-align': 'center'
        },
        'd3-tip.w:after': {
            content: '"\\25B6"',
            margin: '-4px 0 0 -1px',
            top: '50%',
            left: '100%'
        }
    };
