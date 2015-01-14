
    gexamples.force1 = {
        margin: 0,
        nodes: 150,
        minRadius: 0.005,
        maxRadius: 0.02,
        gravity: 0.05,
        charge: -0.02,

        height: '60%',

        point: {
            color: '#555',
            width: 1,
            fillOpacity: 1
        },

        onInit: function (viz, opts) {

            var root = {fixed: true, size: 0, x: -1, y: -1},
                force = d3.layout.force(),
                nodes = d3.range(+opts.nodes).map(function() {
                    var minRadius = +opts.minRadius,
                        maxRadius = +opts.maxRadius,
                        dr = maxRadius > minRadius ? maxRadius - minRadius : 0;
                    return {
                        size: Math.random() * dr + minRadius,
                        x: Math.random(),
                        y: Math.random()
                    };
                }),
                group;

            // Add the dummy node for the mouse
            //nodes.push({fixed: true, size: 0, x: -1, y: -1});

            force.nodes(nodes).charge(opts._charge(opts.charge));

            viz.force = force;

            function init () {
                group = viz.paper(true).group();

                // rescale
                group.add(function () {
                    group.yaxis().scale().domain([0, group.aspectRatio()]);
                    force.size([1, group.aspectRatio()]);
                });
                group.points(force.nodes())
                        .size(function (d) {
                            return group.scale(d.size);
                        })
                        .x(function (d) {return d.x;})
                        .y(function (d) {return d.y;});

                viz.paper().on("mousemove.collide", function() {
                    var p1 = d3.mouse(this);
                    root.x = group.xfromPX(p1[0]);
                    root.y = group.yfromPX(p1[1]);
                    force.resume();
                }).on("touchmove.collide", function() {
                    var p1 = d3.touches(this);
                    root.x = group.xfromPX(p1[0][0]);
                    root.y = group.yfromPX(p1[0][1]);
                    force.resume();
                });
            }

            force.on("tick.collide", function(e) {
                if (!group || opts.type !== group.type()) init();
                //collide(group, force);
                group.render();
            });

            force.start();
        },

        _charge: function (charge) {
            return function (d) {
                return charge; //d.fixed ? opts.charge : 0;
            };
        },

        // Callback when angular directive
        angular: function (viz, opts) {

            opts.scope.$on('formFieldChange', function (e, model, field) {
                var force = viz.force;

                if (field === 'friction' && model.friction)
                    force.friction(model.friction);
                else if (field === 'gravity')
                    force.gravity(model.gravity);
                else if (field === 'charge')
                    force.charge(opts._charge(model.charge)).start();
                else if (field === 'type')
                    opts.type = model.type;

                force.resume();
            });

        }
    };

    function collide (group, force) {
        var collidePadding = 0.002,
            collideBuffer = 0.02,
            nodes = force.nodes(),
            scalex = group.xaxis().scale(),
            scaley = group.yaxis().scale(),
            buffer = scalex(collideBuffer),
            padding = scalex(collidePadding),
            q = d3.geom.quadtree(nodes),
            node;

            for (var i=0; i<nodes.length; ++i)
                q.visit(circleCollide(nodes[i], buffer));

        function circleCollide (node, buffer) {

            var r = node.size + buffer,
                nx1 = node.x - r,
                nx2 = node.x + r,
                ny1 = node.y - r,
                ny2 = node.y + r,
                dx, dy, d;

            return function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== node)) {
                    dx = node.x - quad.point.x;
                    dy = node.y - quad.point.y;
                    d = Math.sqrt(dx * dx + dy * dy);
                    r = node.size + quad.point.size;
                    if (d < r) {
                        d = 0.5 * (r - d) / d;
                        dx *= d;
                        dy *= d;
                        if (node.fixed || quad.point.fixed) {
                            if (node.fixed) {
                                quad.point.x -= 2*dx;
                                quad.point.y -= 2*dy;
                            } else {
                                node.x += 2*dx;
                                node.y += 2*dy;
                            }
                        } else {
                            node.x += dx;
                            node.y += dy;
                            quad.point.x -= dx;
                            quad.point.y -= dy;
                        }
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            };
        }

    }
