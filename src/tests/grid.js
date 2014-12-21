
    describe("Grid plugin", function() {
        var g = d3.giotto,
            _ = g._;

        it("Check defaults", function() {
            var defaults = g.defaults.paper.grid;
            expect(_.isObject(defaults)).toBe(true);
            expect(_.isString(defaults.color)).toBe(true);
            expect(_.isString(defaults.zoomx)).toBe(false);
            expect(_.isString(defaults.zoomy)).toBe(false);
        });

        it("Check basic properties", function () {
            var p = g.paper(),
                group = p.group(),
                grid = group.showGrid();

            expect(p.type()).toBe('svg');
            expect(_.isFunction(p.xaxis())).toBe(true);
            expect(_.isFunction(p.xaxis())).toBe(true);
        });
    });