
    g.viz.force.plugin(function (force, opts) {
        var xc = 0,
            yc = 1;

        if (opts.velocity === undefined)
            opts.velocity = 0;

        force.velocity = function (x) {
            if (!arguments.length) return typeof opts.velocity === "function" ? opts.velocity : +opts.velocity;
            opts.velocity = x;
            return force;
        };

        force.velocity_x = function (x) {
            if (!arguments.length) return xc;
            xc = x;
            return force;
        };

        force.velocity_y = function (y) {
            if (!arguments.length) return yc;
            yc = y;
            return force;
        };

        force.addForce(function () {
            var velocity = force.velocity();
            if (!velocity) return;
            var nodes = force.nodes(),
                node, v;

            if (typeof opts.velocity !== "function")
                velocity = asFunction(velocity);

            for (var i=0; i<nodes.length; ++i) {
                node = nodes[i];
                if (!node.fixed) {
                    v = velocity(node);
                    node.x += v[xc];
                    node.y += v[yc];
                }
            }
        });

        function asFunction (value) {
            return function (d) {return value;};
        }
    });