
    gexamples.force1 = {
        nodes: 100,
        maxRadius: 0.04,
        minRadius: 0.01,
        gravity: 0.05,
        charge: -0.005,
        height: '60%',
        onInit: function (force) {

            var opts = force.options(),
                root = {fixed: true, radius: 0},
                paper = force.paper(),
                charge = force.charge();

            force.addNode(root);

            force.charge(function (d) {
                return d.fixed ? charge : 0;
            }).drawCircles();

            paper.current().on("mousemove", function() {
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
                paper.current().selectAll("circle")
                    .attr("cx", function (d) { return paper.scalex(d.x); })
                    .attr("cy", function (d) { return paper.scaley(d.y); });
            });
        }
    };