    //
    //  VELOCITY FIELD
    //  -------------------

    //  Add e velocity field to ther world
    //
    //  A velocity field can be a twe element array or afunction accepting
    //  the world and a node as input parameter and returning a two-element
    //  array
    d3physics.velocityField = function (world, velocity) {

        world.onstart.push(function (e) {
            var nodes = world.nodes(),
                n = nodes.length,
                i;

            if (typeof velocity === 'function') {
                var vel;
                for (i = 0; i < n; ++i) {
                    vel = velocity.call(world, nodes[i]);
                    nodes[i].vx += vel[0];
                    nodes[i].vy += vel[1];
                }
            } else (velocity) {
                for (i = 0; i < n; ++i) {
                    nodes[i].vx += velocity[0];
                    nodes[i].vy += velocity[1];
                }
            }
        });

        world.ontick.push(function (e) {
            if (velocity) {
                var nodes = physics.nodes(),
                    n = nodes.length,
                    i;
                if (typeof velocity === 'function') {
                    var vel;
                    for (i = 0; i < n; ++i) {
                        vel = velocity.call(physics, nodes[i]);
                        nodes[i].px += vel[0]*dt;
                        nodes[i].py += vel[1]*dt;
                    }
                } else
                    for (i = 0; i < n; ++i) {
                        nodes[i].px += velocity[0]*dt;
                        nodes[i].px += velocity[1]*dt;
                    }
            }
        });

    };
