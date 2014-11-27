
    examples.sunburst = function (viz) {
        var scope = viz.options().scope;
        scope.$on('formFieldChange', function (e, o, value) {
            if (o && o.field === 'scale')
                viz.scale(o.form.scale);
        });
    };

    examples.force1 = function (force) {
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
    };

    examples.sigmoid = function () {

        var X = d3.range(-2, 2, 0.1);

        return {
            data: [
                d3.giotto.xyfunction(X, function (x) {
                    return 1/(1+Math.exp(-x));
                }),
                d3.giotto.xyfunction(X, function (x) {
                    return x*x;
                })
            ]
        };
    };
