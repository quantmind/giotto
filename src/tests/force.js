
    describe("Test Force", function() {
        var g = d3.giotto;

        it("Check basic properties", function() {
            var force = g.viz.force();

            expect(force.alpha()).toBe(0);
            expect(force.vizType()).toBe(g.viz.force);
            expect(force.vizName()).toBe('force');

            expect(force.gravity()).toBe(0.05);
            expect(force.gravity(0.5).gravity()).toBe(0.5);
            expect(force.nodes().length).toBe(0);

            expect(force.options().nodes).toBe(0);
        });

        it("Check nodes", function(done) {
            var force = g.viz.force({nodes: 10, gravity: '0.5'});

            expect(force.options().nodes).toBe(10);
            expect(force.nodes().length).toBe(10);
            expect(force.gravity()).toBe(0.5);

            force.start();

            force.on('tick.test', function (e) {
                var nodes = force.nodes();
                expect(e.type).toBe('tick');
                expect(nodes.length).toBe(10);
                force.stop();
            }).on('end.test', function (e) {
                expect(e.type).toBe('end');
                done();
            });
        });
    });