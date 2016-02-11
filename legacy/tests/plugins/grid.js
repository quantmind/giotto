
    describe("Grid plugin", function() {
        var g = d3.giotto,
            _ = g._;

        it("Check defaults", function() {
            var grid = g.paper.plugins.grid;
            expect(_.isObject(grid)).toBe(true);

            expect(_.isObject(grid.defaults)).toBe(true);
            expect(_.isString(grid.defaults.color)).toBe(true);
            expect(grid.defaults.colorOpacity).toBe(0.3);
            expect(grid.defaults.xaxis).toBe(true);
            expect(grid.defaults.yaxis).toBe(true);
        });

        it("Check group showGrid", function () {
            var p = g.paper(),
                group = p.group();

            expect(group.showGrid()).toBe(group);

            expect(group.type()).toBe('svg');

            var grid = group.grid();

            expect(_.isFunction(grid.xaxis())).toBe(true);
            expect(_.isFunction(grid.xaxis())).toBe(true);
        });

    });