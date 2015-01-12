
    describe("Paper", function () {
        var g = d3.giotto,
            _ = g._;

        it("Check basic properties", function() {
            var paper = g.paper();

            expect(_.isObject(paper)).toBe(true);
            expect(paper.type()).toBe('svg');
            expect(paper.element().node().tagName.toLowerCase()).toBe('div');

            // Default size
            expect(paper.size()[0]).toBe(g.constants.WIDTH);
            expect(paper.size()[1]).toBe(g.constants.HEIGHT);
            var bbox = paper.boundingBox();
            expect(bbox[0]).toBe(g.constants.WIDTH);
            expect(bbox[1]).toBe(g.constants.HEIGHT);
        });

        it("Check axis linear scale", function () {
            var paper = g.paper({width: 600, height: 500});

            expect(paper.size()[0]).toBe(600);
            expect(paper.size()[1]).toBe(500);
        });


        it("Clear", function () {
            var p = g.paper();

            expect(p.clear()).toBe(p);
        });
    });