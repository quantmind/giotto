    //
    describe("Test svg paper", function() {
        var g = d3.giotto,
            _ = g._;

        it("Check basic properties", function() {
            g.createviz('dummy');

            var v = g.viz.dummy();

            expect(v.alpha()).toBe(0);
            expect(v.vizType()).toBe(g.viz.dummy);
            expect(v.vizName()).toBe('dummy');
        });

    });
