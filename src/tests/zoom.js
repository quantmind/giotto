
    describe("Test Zoom plugin", function() {
        var g = d3.giotto,
            _ = g._;

        it("Check defaults", function() {
            var defaults = g.defaults.paper.zoom;
            expect(_.isObject(defaults)).toBe(true);
            expect(defaults.x).toBe(true);
            expect(defaults.y).toBe(true);
            expect(defaults.extent.length).toBe(2);
        });

        it("Check basic properties", function () {
            var p = g.paper();

            expect(p.type()).toBe('svg');
            expect(_.isFunction(p.zoom)).toBe(true);
        });
    });