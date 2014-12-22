
    gexamples.force1 = {
        margin: {top:0, left:0, right:0, bottom:0},
        nodes: 150,
        minRadius: 0.005,
        maxRadius: 0.02,
        gravity: 0.05,
        charge: -0.02,

        height: '60%',

        model: 'CollisionFormModel',

        point: {
            color: '#555',
            width: 1,
            fillOpacity: 1
        },

        onInit: function (force) {

            var opts = force.options(),
                root = {fixed: true, radius: 0, x: -1, y: -1},
                paper = force.paper(),
                group = force.group(),
                charge = force.charge();

            // Add nodes
            force.nodes(d3.range(+opts.nodes).map(function() {
                var minRadius = +opts.minRadius,
                    maxRadius = +opts.maxRadius,
                    dr = maxRadius > minRadius ? maxRadius - minRadius : 0;
                return {radius: group.dim(Math.random() * dr + minRadius)};
            })).addNode(root);

            if (typeof charge !== 'function')
                force.charge(opts._charge(charge));

            //force.drawQuadTree();
            force.drawPoints();

            paper.on("mousemove", function() {
                var p1 = d3.mouse(this);
                root.x = paper.xfromPX(p1[0]);
                root.y = paper.yfromPX(p1[1]);
                force.resume();
            }).on("touchmove", function() {
                var p1 = d3.touches(this);
                root.x = paper.xfromPX(p1[0][0]);
                root.y = paper.yfromPX(p1[0][1]);
                force.resume();
            });

            force.on("tick", function(e) {
                force.collide();
                paper.render();
            });
        },

        // Callback when angular directive
        angular: function (force, opts) {

            opts.scope.$on('formFieldChange', function (e, model) {
                var value = model.form[model.field];

                if (model.field === 'friction' && value)
                    force.friction(value);
                else if (model.field === 'gravity')
                    force.gravity(value);
                else if (model.field === 'charge')
                    force.charge(opts._charge(value));
                else if (model.field === 'type') {
                    // rebuild paper
                    opts.type = value;
                    force.paper(true);
                    opts.onInit(force);
                }
                force.resume();
            });

        },

        _charge: function (value) {
            return function (d) {
                return d.fixed ? value : 0;
            };
        }
    };