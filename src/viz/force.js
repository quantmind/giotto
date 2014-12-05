    //
    //
    // Force layout example
    g.createviz('force', {
        theta: 0.8,
        friction: 0.9,
    }, function (force, opts) {

        var nodes = [],
            forces = [],
            neighbors, friction,
            q, i, j, o, l, s, t, x, y, k;

        force.nodes = function(x) {
            if (!arguments.length) return nodes;
            neighbors = null;
            nodes = x;
            for (i = 0; i < nodes.length; ++i)
                initNode(nodes[i]).index = i;
            return force;
        };

        // Add a new node to the force layout and return the force object
        force.addNode = function (o) {
            o.index = nodes.length;
            nodes.push(initNode(o));
            return force;
        };

        force.theta = function(x) {
            if (!arguments.length) return +opts.theta;
            opts.theta = x;
            return force;
        };

        force.friction = function(x) {
            if (!arguments.length) return +opts.friction;
            opts.friction = x;
            return force;
        };

        force.quadtree = function (createNew) {
            if (!q || createNew)
                q = force.paper().quadtree()(nodes);
                //q = paper.quadtree().x(function (d) {return d.x;})
                //                    .y(function (d) {return d.y;})
                //                    (nodes);
            return q;
        };

        force.addForce = function (callback) {
            forces.push(callback);
        };

        // Draw points in the paper
        force.drawPoints = function () {
            var colors = force.paper().options().colors,
                j = 0;

            for (i=0; i<nodes.length; i++) {
                if (!nodes[i].fill) {
                    nodes[i].fill = colors[j % colors.length];
                    j++;
                }
            }

            return force.paper().points(nodes);
        };

        force.drawQuadTree = function (options) {
            return force.paper().drawQuadTree(force.quadtree, options);
        };

        force.on('tick.main', function() {
            q = null;
            i = -1; while (++i < nodes.length) {
                o = nodes[i];
                o.px = o.x;
                o.py = o.y;
            }

            for (i=0; i<forces.length; ++i)
                forces[i]();

            friction = force.friction();
            i = -1; while (++i < nodes.length) {
                o = nodes[i];
                if (o.fixed) {
                    o.x = o.px;
                    o.y = o.py;
                } else  {
                    o.x -= (o.px - o.x) * friction;
                    o.y -= (o.py - o.y) * friction;
                }
            }
        });

        function initNode (o) {
            var paper = force.paper();
            o.weight = 0;
            if (isNaN(o.x)) o.x = paper.x(Math.random());
            if (isNaN(o.y)) o.y = paper.y(Math.random());
            return o;
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

        force.addForce(function () {
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

        force.addForce(function () {
            k = force.alpha() * opts.gravity;
            nodes = force.nodes();

            var xc = force.paper().x(0.5),
                yc = force.paper().y(0.5);
            for (i = 0; i < nodes.length; ++i) {
                o = nodes[i];
                if (!o.fixed) {
                    o.x += (xc - o.x) * k;
                    o.y += (yc - o.y) * k;
                }
            }
        });
    });

    //
    // Charge plugin
    g.viz.force.plugin(function (force, opts) {
        var paper = force.paper(),
            charges,
            charge, nodes, q, i, k, o,
            chargeDistance2;

        g._.copyMissing({charge: -30, chargeDistance: Infinity}, opts);

        force.charge = function (x) {
            if (!arguments.length) return typeof opts.charge === "function" ? opts.charge : +opts.charge;
            opts.charge = x;
            if (charges)
                _init();
            return force;
        };

        force.chargeDistance = function(x) {
            if (!arguments.length) return +opts.chargeDistance;
            opts.chargeDistance2 = +x;
            chargeDistance2 = x * x;
            return force;
        };

        force.addForce(function () {
            // compute quadtree center of mass and apply charge forces
            nodes = force.nodes();
            charge = force.charge();
            if (charge && nodes.length) {
                if (!charges)
                    _init();

                d3_layout_forceAccumulate(q = force.quadtree(), force.alpha(), charges);
                i = -1; while (++i < nodes.length) {
                    o = nodes[i];
                    if (!o.fixed) q.visit(repulse(o));
                }
            }
        });

        function _init () {
            force.chargeDistance(opts.chargeDistance);
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
                theta2 = theta*theta;

            return function(quad, x1, _, x2) {
                if (quad.point !== node && quad.charge) {
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
                    var paper = force.paper();
                    quad.point.x += paper.x(Math.random()) - paper.x(0.5);
                    quad.point.y += paper.y(Math.random()) - paper.y(0.5);
                }
                var k = alpha * charges[quad.point.index];
                quad.charge += quad.pointCharge = k;
                cx += k * quad.point.x;
                cy += k * quad.point.y;
            }
            quad.cx = quad.charge ? cx / quad.charge : 0;
            quad.cy = quad.charge ? cy / quad.charge : 0;
        }
    });
