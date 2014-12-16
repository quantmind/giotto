    var quadDefaults = {
        color: '#ccc',
        opacity: 1,
        width: 1,
        fill: 'none',
        fillOpacity: 0.5,
    };


    g.paper.plugin("quadtree", {
        defaults: {
            color: '#ccc',
            opacity: 1,
            width: 1,
            fill: 'none',
            fillOpacity: 0.5,
        },

        svg: function (paper, opts) {

            paper.quadtree = function () {
                //var sx = paper.xAxis().scale(),
                //    sy = paper.yAxis().scale(),
                //    x0 = sx.invert(-1),
                //    y1 = sy.invert(-1),
                //    x1 = sx.invert(paper.innerWidth()+1),
                //    y0 = sy.invert(paper.innerHeight()+1);
                //return d3.geom.quadtree().extent([[x0, y0], [x1, y1]]);
                return d3.geom.quadtree;
            };

            // Draw a quad tree on the paper
            paper.drawQuadTree = function (factory, options) {
                g.extend(opts.quadtree, options);

                var container = paper.current(),
                    o = opts.quadtree;

                return paper.addComponent(function () {
                    var gc = container.select('g.quadtree'),
                        quadtree = factory();

                    if (!gc.node())
                        gc = container.append('g')
                                        .attr('class', 'quadtree')
                                        .attr('stroke', o.color)
                                        .attr('stroke-width', o.width)
                                        .attr('stroke-opacity', o.opacity)
                                        .attr('fill', o.fill)
                                        .attr('fill-opacity', o.fillOpacity)
                                        .style('shape-rendering', 'crispEdges');
                    else
                        gc.selectAll(".quad-node").remove();

                    gc.selectAll(".quad-node")
                        .data(qnodes(quadtree))
                        .enter().append("rect")
                        .attr("class", "quad-node")
                        .attr("x", function(d) { return d.x1; })
                        .attr("y", function(d) { return d.y1; })
                        .attr("width", function(d) { return d.x2 - d.x1; })
                        .attr("height", function(d) { return d.y2 - d.y1; });

                    return {chart: gc};
                });
            };

            function nice (s, maxs) {
                return s <= 0 ? 0 : s >= maxs ? maxs : s;
            }

            function qnodes (quadtree) {
                var nodes = [],
                    scalex = paper.scalex,
                    scaley = paper.scaley,
                    width = paper.innerWidth(),
                    height = paper.innerHeight();

                quadtree.depth = 0; // root
                quadtree.visit(function(node, x1, y1, x2, y2) {
                    node.x1 = nice(scalex(x1), width);
                    node.y1 = nice(scaley(y2), height);
                    node.x2 = nice(scalex(x2), width);
                    node.y2 = nice(scaley(y1), height);
                    nodes.push(node);
                    for (var i=0; i<4; i++) {
                        if (node.nodes[i]) node.nodes[i].depth = node.depth+1;
                    }
                });
                return nodes;
            }
        },

        canvas: function (paper, opts) {

        }
    });
