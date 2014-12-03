
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
            var force = g.viz.force({gravity: '0.5'});

            expect(force.nodes().length).toBe(0);
            expect(force.gravity()).toBe(0.5);
            expect(force.charge()).toBe(-30);
            expect(force.charge(-20).charge()).toBe(-20);

            force.nodes(d3.range(10).map(function() {
                return {radius: Math.random() * 10 + 4};
            }));

            expect(force.nodes().length).toBe(10);

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