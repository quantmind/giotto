    //
    describe("Test canvas paper", function() {
        var g = d3.giotto,
            _ = g._;

        it("Check basic properties", function() {
            var paper = g.paper({type: 'canvas'});
            expect(_.isObject(paper)).toBe(true);
            expect(paper.type()).toBe('canvas');
            var current = paper.current();

            // Default size
            expect(paper.width()).toBe(g.constants.WIDTH);
            expect(paper.height()).toBe(g.constants.HEIGHT);
        });

    });