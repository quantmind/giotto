    //
    describe("Test visualization base class", function() {
        var g = d3.giotto,
            _ = g._;

        g.createviz('dummy');

        it("Check basic properties", function() {
            var v = g.viz.dummy();

            expect(v.alpha()).toBe(0);
            expect(v.vizType()).toBe(g.viz.dummy);
            expect(v.vizName()).toBe('dummy');
            expect(v.paper().element().node()).toBe(v.element().node());
        });

        it("Check axis properties", function() {
            var v = g.viz.dummy(),
                paper = v.paper();
                d = paper.xAxis().scale().domain();

            expect(d.length).toBe(2);
            expect(d[0]).toBe(0);
            expect(d[1]).toBe(1);
        });


    });
