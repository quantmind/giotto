    //
    //
    // Force layout example
    g.createviz('force', {
        nodes: 0,
        minRadius: 0.02,
        maxRadius: 0.08,
        theta: 0.8
    }, function (force, opts) {
        var nodes = [],
            neighbors,
            q, i, j, o, l, s, t, x, y, k;

        force.nodes = function(x) {
            if (!arguments.length) return nodes;
            neighbors = null;
            nodes = x;
            for (i = 0; i < nodes.length; ++i) {
                (o = nodes[i]).index = i;
                o.weight = 0;
                if (isNaN(o.x)) o.x = Math.random();
                if (isNaN(o.y)) o.y = Math.random();
                if (isNaN(o.px)) o.px = o.x;
                if (isNaN(o.py)) o.py = o.y;
            }
            return force;
        };

        force.theta = function(x) {
            if (!arguments.length) return +opts.theta;
            opts.theta = x;
            return force;
        };

        force.quadtree = function () {
            if (!q)
                q = d3.geom.quadtree(nodes);
            return q;
        };

        // Create a node with random radius
        force.randomNode = function () {
            var minRadius = +opts.minRadius,
                maxRadius = +opts.maxRadius,
                dr = maxRadius > minRadius ? maxRadius - minRadius : 0;
            return {radius: Math.random() * dr + minRadius};
        };

        force.drawCircles = function (color) {
            if (!color)
                color = d3.scale.category10();
            var paper = force.paper(),
                N = color.range().length;

            if (paper.type() === 'svg') {
                var svg = paper.clear().current();
                return svg.selectAll("circle")
                            .data(nodes)
                            .enter().append("svg:circle")
                            .attr("r", function (d) {
                                var r = paper.scale(d.radius);
                                return r > 2 ? r - 2 : 0;
                            })
                            .attr("cx", function (d) {
                                return paper.scalex(d.x);
                            })
                            .attr("cy", function (d) {
                                return paper.scaley(d.y);
                            })
                            .style("fill", function(d, i) { return color(i % N); });
            }
        };

        force.on("tick.main", function(e) {
            q = null;
            //while (++i < n) {
            //    q.visit(collide(nodes[i]));
            //}
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

        // INTERNALS
        if (+opts.nodes) {
            // Add a set of random nodes if required
            force.nodes(d3.range(+opts.nodes).map(function() {
                return force.randomNode();
            }));
        }
    });

    // gauss-seidel relaxation for links
    g.viz.force.plugin(function (force, opts) {
        var links = [],
            distances, strengths,
            nodes, i, o, s, t, x, y, l;

        g._.copyMissing({linkStrength: 1, linkDistance: 20}, opts);


        force.linkStrength = function(x) {
            if (!arguments.length) return opts.linkStrength;
            opts.linkStrength = typeof x === "function" ? x : +x;
            return force;
        };

        force.linkDistance = function(x) {
            if (!arguments.length) return opts.linkDistance;
            opts.linkDistance = typeof x === "function" ? x : +x;
            return force;
        };

        force.on('tick.links', function () {
            if (!distances)
                _init();

            for (i = 0; i < links.length; ++i) {
                o = links[i];
                s = o.source;
                t = o.target;
                x = t.x - s.x;
                y = t.y - s.y;
                l = (x * x + y * y);
                if (l) {
                    l = opts.alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l;
                    x *= l;
                    y *= l;
                    t.x -= x * (k = s.weight / (t.weight + s.weight));
                    t.y -= y * k;
                    s.x += x * (k = 1 - k);
                    s.y += y * k;
                }
            }
        });

        function _init () {
            var linkDistance = opts.linkDistance,
                linkStrength = opts.linkStrength,
                nodes = force.nodes();
            distances = [];
            strengths = [];

            if (links.length) {

                for (i = 0; i < links.length; ++i) {
                    o = links[i];
                    if (typeof o.source == "number") o.source = nodes[o.source];
                    if (typeof o.target == "number") o.target = nodes[o.target];
                    ++o.source.weight;
                    ++o.target.weight;
                }

                if (typeof linkDistance === "function")
                    for (i = 0; i < links.length; ++i)
                        distances[i] = +linkDistance.call(force, links[i], i);
                else
                    for (i = 0; i < links.length; ++i)
                        distances[i] = linkDistance;

                if (typeof linkStrength === "function")
                    for (i = 0; i < links.length; ++i)
                        strengths[i] = +linkStrength.call(force, links[i], i);
                else
                    for (i = 0; i < links.length; ++i)
                        strengths[i] = linkStrength;
            }
        }
    });

    //
    // Gravity plugin
    g.viz.force.plugin(function (force, opts) {
        var i, k, o, nodes;

        if (opts.gravity === undefined)
            opts.gravity = 0.05;

        force.gravity = function (x) {
            if (!arguments.length) return +opts.gravity;
            opts.gravity = x;
            return force;
        };

        force.on('tick.gravity', function () {
            k = force.alpha() * opts.gravity;
            nodes = force.nodes();

            if (k) {
                for (i = 0; i < nodes.length; ++i) {
                    o = nodes[i];
                    o.x += (0.5 - o.x) * k;
                    o.y += (0.5 - o.y) * k;
                }
            }
        });
    });

    //
    // Charge plugin
    g.viz.force.plugin(function (force, opts) {
        var charges,
            charge, nodes, q, i, k, o;

        g._.copyMissing({charge: -30, chargeDistance2: Infinity}, opts);

        force.charge = function (x) {
            if (!arguments.length) return typeof opts.charge === "function" ? opts.charge : +opts.charge;
            opts.charge = x;
            return force;
        };

        force.chargeDistance = function(x) {
            if (!arguments.length) return Math.sqrt(opts.chargeDistance2);
            opts.chargeDistance2 = x * x;
            return force;
        };

        force.on('tick.charge', function () {
            // compute quadtree center of mass and apply charge forces
            nodes = force.nodes();
            charge = force.charge();
            if (charge && nodes.length) {
                if (!charges)
                    _init();

                d3_layout_forceAccumulate(q = force.quadtree(), force.alpha(), charges);
                i = -1; while (++i < nodes.length) {
                    if (!(o = nodes[i]).fixed) {
                        q.visit(repulse(o));
                    }
                }
            }
        });

        function _init () {
            charge = force.charge();
            nodes = force.nodes();
            charges = [];
            if (typeof charge === "function")
                for (i = 0; i < nodes.length; ++i)
                    charges[i] = +charge.call(force, nodes[i], i);
            else
                for (i = 0; i < nodes.length; ++i)
                    charges[i] = charge;
        }

        function repulse(node) {
            var theta = force.theta(),
                theta2 = theta*theta,
                chargeDistance2 = +opts.chargeDistance2;

            return function(quad, x1, _, x2) {
              if (quad.point !== node) {
                var dx = quad.cx - node.x,
                    dy = quad.cy - node.y,
                    dw = x2 - x1,
                    dn = dx * dx + dy * dy;

                /* Barnes-Hut criterion. */
                if (dw * dw / theta2 < dn) {
                  if (dn < chargeDistance2) {
                    k = quad.charge / dn;
                    node.px -= dx * k;
                    node.py -= dy * k;
                  }
                  return true;
                }

                if (quad.point && dn && dn < chargeDistance2) {
                  k = quad.pointCharge / dn;
                  node.px -= dx * k;
                  node.py -= dy * k;
                }
              }
              return !quad.charge;
            };
        }

        function d3_layout_forceAccumulate(quad, alpha, charges) {
            var cx = 0,
                cy = 0;
            quad.charge = 0;
            if (!quad.leaf) {
                var nodes = quad.nodes,
                    n = nodes.length,
                    i = -1,
                    c;
                while (++i < n) {
                    c = nodes[i];
                    if (!c) continue;
                    d3_layout_forceAccumulate(c, alpha, charges);
                    quad.charge += c.charge;
                    cx += c.charge * c.cx;
                    cy += c.charge * c.cy;
                }
            }
            if (quad.point) {
                // jitter internal nodes that are coincident
                if (!quad.leaf) {
                  quad.point.x += Math.random() - 0.5;
                  quad.point.y += Math.random() - 0.5;
                }
                var k = alpha * charges[quad.point.index];
                quad.charge += quad.pointCharge = k;
                cx += k * quad.point.x;
                cy += k * quad.point.y;
            }
            quad.cx = cx / quad.charge;
            quad.cy = cy / quad.charge;
        }
    });

    // Friction plugin
    //
    g.viz.force.plugin(function (force, opts) {
        var nodes, friction, i, o;

        if (opts.friction === undefined)
            opts.friction = 0.9;

        force.friction = function(x) {
            if (!arguments.length) return +opts.friction;
            opts.friction = x;
            return force;
        };

        force.on('tick.friction', function () {
            // position verlet integration
            nodes = force.nodes();
            friction = force.friction();
            if (nodes.length && friction) {
                i = -1; while (++i < nodes.length) {
                    o = nodes[i];
                    if (o.fixed) {
                        o.x = o.px;
                        o.y = o.py;
                    } else {
                        o.x -= (o.px - (o.px = o.x)) * friction;
                        o.y -= (o.py - (o.py = o.y)) * friction;
                    }
                }
            }
        });
    });
