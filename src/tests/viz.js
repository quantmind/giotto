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

        it("Check element", function() {
            var v = g.viz.dummy(),
                paper = v.paper();
                element = paper.element();

            expect(element.node().tagName).toBe('DIV');
            //expect(element.style('position')).toBe('relative');
        });


    });
