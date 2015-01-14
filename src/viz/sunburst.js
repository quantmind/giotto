    //
    //  Sunburst visualization
    //
    g.createviz('sunburst', {
        // Show labels
        labels: true,
        // Add the order of labels if available in the data
        addorder: false,
        // speed in transitions
        transition: 750,
        //
        scale: 'sqrt',
        //
        initNode: null
    },

    function (self, opts) {

        var namecolors = {},
            current,
            paper,
            group,
            textSize,
            radius,
            textContainer,
            dummyPath,
            text,
            positions,
            path, x, y, arc;


        self.on('tick.main', function (e) {
            self.stop();
            self.draw();
        });

        // API
        //
        // Select a path
        self.select = function (node, transition) {
            if (!current) return;

            if (isArray(node)) {
                var path = node;
                node = current;
                for (var n=0; n<path.length; ++n) {
                    var name = path[n];
                    if (node.children) {
                        for (var i=0; i<=node.children.length; ++i) {
                            if (node.children[i] && node.children[i].name === name) {
                                node = node.children[i];
                                break;
                            }
                        }
                    } else {
                        break;
                    }
                }
            }
            return select(node, transition);
        };

        // Return the current selected node
        self.current = function () {
            return current;
        };

        // Set the scale or returns it
        self.scale = function (scale) {
            if (!arguments.length) return opts.scale;
            opts.scale = scale;
            return self;
        };

        // draw
        self.draw = function () {
            var data = self.data();

            if (!paper || opts.type !== group.type()) {
                paper = self.paper(true);
                group = paper.group();
                group.element().classed('sunburst', true);
            }

            if (data) {
                data = d3.layout.partition()
                    .value(function(d) { return d.size; })
                    .sort(function (d) { return d.order === undefined ? d.size : d.order;})
                    .nodes(data);
                current = (isFunction(opts.initNode) ? opts.initNode() : opts.initNode) || data[0];

                group.add(function () {
                    build(data, current);
                });
            }

            self.render();
        };

        // Private methods
        //
        function build (data, initNode) {

            var width = 0.5*group.innerWidth(),
                height = 0.5*group.innerHeight(),
                xs = group.marginLeft() + width,
                ys = group.marginTop() + height,
                sunburst = group.element().attr("transform", "translate(" + xs + "," + ys + ")");

            current = data[0];
            radius = Math.min(width, height);
            textSize = calcTextSize();
            x = d3.scale.linear().range([0, 2 * Math.PI]);  // angular position
            y = scale(radius);  // radial position
            arc = d3[group.type()].arc()
                    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
                    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
                    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
                    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

            sunburst.selectAll('*').remove();

            path = sunburst.selectAll("path")
                    .data(data)
                    .enter()
                    .append('path')
                    .attr("d", arc)
                    .style("fill", function(d) {
                        var name = (d.children ? d : d.parent).name;
                        if (!namecolors[name])
                            namecolors[name] = paper.pickColor();
                        return namecolors[name];
                    });

            if (opts.labels) {
                positions = [];
                textContainer = sunburst.append('g')
                                .attr('class', 'text')
                                .selectAll('g')
                                .data(path.data())
                                .enter().append('g');
                dummyPath = textContainer.append('path')
                        .attr("d", arc)
                        .attr("opacity", 0)
                        .on("click", function (d) {select(d);});
                text = textContainer.append('text')
                        .text(function(d) {
                            if (opts.addorder !== undefined && d.order !== undefined)
                                return d.order + ' - ' + d.name;
                            else
                                return d.name;
                        });
                alignText(text);
            }

            //
            if (!self.select(initNode, 0))
                self.event('change').call(self, {type: 'change'});
        }

        function scale (radius) {
            //if (opts.scale === 'log')
            //    return d3.scale.log().range([1, radius]);
            if (opts.scale === 'linear')
                return d3.scale.linear().range([0, radius]);
            else
                return d3.scale.sqrt().range([0, radius]);
        }

        // Calculate the text size to use from dimensions
        function calcTextSize () {
            var dim = Math.min(group.innerWidth(), group.innerHeight());
            if (dim < 400)
                return Math.round(100 - 0.15*(500-dim));
            else
                return 100;
        }

        function select (node, transition) {
            if (!node || node === current) return;
            if (transition === undefined) transition = +opts.transition;

            if (text) text.transition().attr("opacity", 0);
            //
            function visible (e) {
                return e.x >= node.x && e.x < (node.x + node.dx);
            }

            var arct = arcTween(node);

            path.transition()
                .duration(transition)
                .attrTween("d", arct)
                .each('end', function (e, i) {
                    if (node === e) {
                        current = e;
                        self.event('change').call(self, {type: 'change'});
                    }
                });

            if (text) {
                positions = [];
                dummyPath.transition()
                    .duration(transition)
                    .attrTween("d", arct)
                    .each('end', function (e, i) {
                        // check if the animated element's data lies within the visible angle span given in d
                        if (e.depth >= current.depth && visible(e)) {
                            // fade in the text element and recalculate positions
                            alignText(d3.select(this.parentNode)
                                        .select("text")
                                        .transition().duration(transition)
                                        .attr("opacity", 1));
                        }
                    });
            }
            return true;
        }

        function calculateAngle (d) {
            var a = x(d.x + d.dx / 2),
                changed = true,
                tole=Math.PI/40;

            function tween (angle) {
                var da = a - angle;
                if (da >= 0 && da < tole) {
                    a += tole;
                    changed = true;
                }
                else if (da < 0 && da > -tole) {
                    a -= tole - da;
                    changed = true;
                }
            }

            while (changed) {
                changed = false;
                positions.forEach(tween);
            }
            positions.push(a);
            return a;
        }

        // Align text when labels are displaid
        function alignText (text) {
            var depth = current.depth,
                a;
            return text.attr("x", function(d, i) {
                // Set the Radial position
                if (d.depth === depth)
                    return 0;
                else {
                    a = calculateAngle(d, x, y);
                    this.__data__.angle = a;
                    return a > Math.PI ? -y(d.y) : y(d.y);
                }
            }).attr("dx", function(d) {
                // Set the margin
                return d.depth === depth ? 0 : (d.angle > Math.PI ? -6 : 6);
            }).attr("dy", function(d) {
                // Set the Radial position
                if (d.depth === depth)
                    return d.depth ? 40 : 0;
                else
                    return ".35em";
            }).attr("transform", function(d) {
                // Set the Angular position
                a = 0;
                if (d.depth > depth) {
                    a = d.angle;
                    if (a > Math.PI)
                        a -= Math.PI;
                    a -= Math.PI / 2;
                }
                return "rotate(" + (a / Math.PI * 180) + ")";
            }).attr("text-anchor", function (d) {
                // Make sure text is never oriented downwards
                a = d.angle;
                if (d.depth === depth)
                    return "middle";
                else if (a && a > Math.PI)
                    return "end";
                else
                    return "start";
            }).style("font-size", function(d) {
                var g = d.depth - depth,
                    pc = textSize;
                if (!g) pc *= 1.2;
                else if (g > 0)
                    pc = Math.max((1.2*pc - 20*g), 30);
                return Math.round(pc) + '%';
            });
        }

        // Interpolate the scales!
        function arcTween(d) {
            var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                yd = d3.interpolate(y.domain(), [d.y, 1]),
                yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
            return function(d, i) {
                return i ? function(t) {
                    return arc(d);
                } : function(t) {
                    x.domain(xd(t));
                    y.domain(yd(t)).range(yr(t));
                    return arc(d);
                };
            };
        }
    });
