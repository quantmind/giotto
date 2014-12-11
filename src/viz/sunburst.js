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
    }, function (self, opts) {

        var current,
            loading = false,
            paper = self.paper(),
            textSize = calcTextSize(),
            color = d3.scale.category20c(),
            transition = +opts.transition,
            x = d3.scale.linear().range([0, 2 * Math.PI]),  // angular position
            y,
            arc = d3.svg.arc()
                    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
                    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
                    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
                    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); }),
            radius,
            textContainer,
            dummyPath,
            text,
            positions,
            depth,
            path;

        self.on('tick.main', function (e) {
            // Load data if not already available
            if (!opts.data)
                return self.loadData();
            else {
                self.stop();
                build();
            }
        });

        // API
        //
        // Select a path
        self.select = function (path) {
            if (!current) return;
            var node = opts.data;
            if (path && path.length) {
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
            return select(node);
        };

        // Set the scale or returns it
        self.scale = function (scale) {
            if (!arguments.length) return opts.scale;
            if (opts.scale !== scale) {
                opts.scale = scale;
                self.resume();
            }
            return self;
        };

        // Private methods

        // Calculate the text size to use from dimensions
        function calcTextSize () {
            var dim = Math.min(paper.innerWidth(), paper.innerHeight());
            if (dim < 400)
                return Math.round(100 - 0.15*(500-dim));
            else
                return 100;
        }

        function select (node) {
            if (node === current) return;

            if (text) text.transition().attr("opacity", 0);
            //
            function visible (e) {
                return e.x >= node.x && e.x < (node.x + node.dx);
            }

            var arct = arcTween(node);
            depth = node.depth;

            path.transition()
                .duration(transition)
                .attrTween("d", arct)
                .each('end', function (e, i) {
                    if (node === e) {
                        self.current = e;
                        self.fire('change');
                    }
                });

            if (text) {
                positions = [];
                dummyPath.transition()
                    .duration(transition)
                    .attrTween("d", arct)
                    .each('end', function (e, i) {
                        // check if the animated element's data lies within the visible angle span given in d
                        if (e.depth >= depth && visible(e)) {
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

        //
        function build () {

            var width = 0.5*paper.innerWidth(),
                height = 0.5*paper.innerHeight(),
                // Create the partition layout
                partition = d3.layout.partition()
                    .value(function(d) { return d.size; })
                    .sort(function (d) { return d.order === undefined ? d.size : d.order;}),
                svg = paper.group()
                          .attr("transform", "translate(" + width + "," + height + ")"),
                sunburst = svg.append('g').attr('class', 'sunburst');

            radius = Math.min(width, height);
            y = scale(radius);  // radial position
            depth = 0;
            current = opts.data;

            var y0 = y(0),
                yr = y(radius);

            path = sunburst.selectAll("path")
                    .data(partition.nodes(current))
                    .enter()
                    .append('path')
                    .attr("d", arc)
                    .style("fill", function(d) { return color((d.children ? d : d.parent).name); });

            if (opts.labels) {
                var data = path.data();
                positions = [];
                textContainer = svg.append('g')
                                .attr('class', 'text')
                                .selectAll('g')
                                .data(data)
                                .enter().append('g');
                dummyPath = textContainer.append('path')
                        .attr("d", arc)
                        .attr("opacity", 0)
                        .on("click", click);
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
            if (!self.select(opts.initNode))
                opts.event.change({type: 'change', viz: self});
        }

        function scale (radius) {
            //if (opts.scale === 'log')
            //    return d3.scale.log().range([1, radius]);
            if (opts.scale === 'linear')
                return d3.scale.linear().range([0, radius]);
            else
                return d3.scale.sqrt().range([0, radius]);
        }

        function click (d) {
            // Fade out all text elements
            if (depth === d.depth) return;
            if (text) text.transition().attr("opacity", 0);
            depth = d.depth;
            //
            function visible (e) {
                return e.x >= d.x && e.x < (d.x + d.dx);
            }
            //
            path.transition()
                .duration(transition)
                .attrTween("d", arcTween(d))
                .each('end', function (e, i) {
                    if (e.depth === depth && visible(e)) {
                        self.current = e;
                        opts.event.change({type: 'change', viz: self});
                    }
                });

            if (text) {
                positions = [];
                dummyPath.transition()
                    .duration(transition)
                    .attrTween("d", arcTween(d))
                    .each('end', function (e, i) {
                        // check if the animated element's data lies within the visible angle span given in d
                        if (e.depth >= depth && visible(e)) {
                            // fade in the text element and recalculate positions
                            alignText(d3.select(this.parentNode)
                                        .select("text")
                                        .transition().duration(transition)
                                        .attr("opacity", 1));
                        }
                    });
            }
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
            var a;
            return text.attr("x", function(d, i) {
                // Set the Radial position
                if (d.depth === depth)
                    return 0;
                else {
                    a = calculateAngle(d);
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
