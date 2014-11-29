
    describe("Test Grid plugin", function() {
        var g = d3.giotto,
            _ = g._;

        it("Check defaults", function() {
            var defaults = g.defaults.paper.grid
            expect(_.isObject(defaults)).toBe(true);
            expect(_.isString(defaults.color)).toBe(true);
        });

        it("Check basic properties", function () {
            var p = g.paper();

            expect(p.type()).toBe('svg');
            expect(_.isFunction(p.xGrid())).toBe(true);
            expect(_.isFunction(p.yGrid())).toBe(true);
        });
    });