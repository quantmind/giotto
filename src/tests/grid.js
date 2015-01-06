
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

            expect(grid.type()).toBe('svg');
            expect(_.isFunction(grid.xaxis())).toBe(true);
            expect(_.isFunction(grid.xaxis())).toBe(true);
        });

        it("Check zoom defaults", function() {
            var defaults = g.defaults.paper.grid;
            expect(defaults.zoomx).toBe(false);
            expect(defaults.zoomx).toBe(false);
            expect(defaults.scaleExtent.length).toBe(2);
        });
    });