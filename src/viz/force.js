    //
    //
    // Force layout example
    g.Force = Viz.extend({
        //
        d3build: function () {
            var d2 = this.d3,
                svg = this.svg(),
                attrs = this.attrs,
                nNodes = attrs.nodes || 100,
                minRadius = attrs.minRadius || 4,
                maxRadius = attrs.maxRadius || 16,
                gravity = attrs.gravity || 0.05,
                charge = attrs.charge || -2000,
                dr = maxRadius > minRadius ? maxRadius - minRadius : 0,
                nodes = d3.range(nNodes).map(function() { return {radius: Math.random() * dr + minRadius}; }),
                color = d3.scale.category10();

            var force = d3.layout.force()
                .gravity(gravity)
                .charge(function(d, i) {
                    return i ? 0 : charge;
                })
                .nodes(nodes)
                .size(this.size());

            var root = nodes[0];
            root.radius = 0;
            root.fixed = true;

            force.start();

            svg.selectAll("circle")
                .data(nodes.slice(1))
                .enter().append("svg:circle")
                .attr("r", function(d) { return d.radius - 2; })
                .style("fill", function(d, i) { return color(i % 3); });

            force.on("tick", function(e) {
                var q = d3.geom.quadtree(nodes),
                    i = 0,
                    n = nodes.length;

                while (++i < n) {
                    q.visit(collide(nodes[i]));
                }

                svg.selectAll("circle")
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
            });

            svg.on("mousemove", function() {
                var p1 = d3.mouse(this);
                root.px = p1[0];
                root.py = p1[1];
                force.resume();
            }).on("touchmove", function() {
                var p1 = d3.touches(this);
                root.px = p1[0];
                root.py = p1[1];
                force.resume();
            });

            function collide (node) {
                var r = node.radius + 16,
                    nx1 = node.x - r,
                    nx2 = node.x + r,
                    ny1 = node.y - r,
                    ny2 = node.y + r;

                return function(quad, x1, y1, x2, y2) {
                    if (quad.point && (quad.point !== node)) {
                        var x = node.x - quad.point.x,
                            y = node.y - quad.point.y,
                            l = Math.sqrt(x * x + y * y),
                            r = node.radius + quad.point.radius;
                        if (l < r) {
                            l = (l - r) / l * 0.5;
                            node.x -= x *= l;
                            node.y -= y *= l;
                            quad.point.x += x;
                            quad.point.y += y;
                        }
                    }
                    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                };
            }
        },
        //
        //  handle node charge

    });