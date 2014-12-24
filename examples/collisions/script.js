
    gexamples.force1 = {
        margin: {top:0, left:0, right:0, bottom:0},
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

        onInit: function (force, opts) {

            var root = {fixed: true, size: 0, x: -1, y: -1},
                charge = force.charge(),
                paper;

            // Add nodes
            force.nodes(d3.range(+opts.nodes).map(function() {
                var minRadius = +opts.minRadius,
                    maxRadius = +opts.maxRadius,
                    dr = maxRadius > minRadius ? maxRadius - minRadius : 0;
                return {size: Math.random() * dr + minRadius};
            })).addNode(root);

            if (typeof charge !== 'function')
                force.charge(opts._charge(charge));

            function init () {
                paper = force.paper(true);

                var group = paper.group();
                group.points(force.nodes())
                        .x(function (d) {return d.x;})
                        .y(function (d) {return d.y;});

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
            }


            force.on("tick.collide", function(e) {
                if (!paper || opts.type !== paper.type()) init();
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