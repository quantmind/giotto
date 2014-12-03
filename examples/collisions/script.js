
    gexamples.force1 = {
        margin: {top:0, left:0, right:0, bottom:0},
        nodes: 100,
        minRadius: 4,
        maxRadius: 12,
        gravity: 0.05,
        charge: -1000,

        height: '60%',
        point: {
            color: '#555',
            width: 1,
            fillOpacity: 1
        },

        onInit: function (force) {

            var opts = force.options(),
                root = {fixed: true, radius: 0},
                paper = force.paper(),
                charge = force.charge();

            paper.xAxis().scale().domain([0, paper.innerWidth()]);
            paper.yAxis().scale().domain([0, paper.innerHeight()]);

            // Add nodes
            force.nodes(d3.range(+opts.nodes).map(function() {
                var minRadius = +opts.minRadius,
                    maxRadius = +opts.maxRadius,
                    dr = maxRadius > minRadius ? maxRadius - minRadius : 0;
                return {radius: Math.random() * dr + minRadius};
            })).addNode(root).charge(function (d) {
                return d.fixed ? charge : 0;
            });

            //force.drawQuadTree();
            var o = force.drawPoints();

            o.chart.on("mousemove", function() {
                var p1 = d3.mouse(this);
                root.px = paper.xAxis().scale().invert(p1[0]);
                root.py = paper.yAxis().scale().invert(p1[1]);
                force.resume();
            }).on("touchmove", function() {
                var p1 = d3.touches(this);
                root.px = paper.xAxis().scale().invert(p1[0]);
                root.py = paper.yAxis().scale().invert(p1[1]);
                force.resume();
            });

            force.on("tick", function(e) {
                force.collide();
                paper.render();
            });
        }
    };