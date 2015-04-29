
    describe("Axis plugin", function() {
        var g = d3.giotto,
            _ = g._;

        it("Check x-axis defaults", function() {
            var axis = g.paper.plugins.axis;
            expect(_.isFunction(axis)).toBe(true);

            expect(_.isFunction(axis.defaults)).toBe(true);
        });

        it("Check axis options", function () {
            var p = g.paper(),
                group = p.group(),
                xaxis = group.xaxis(),
                yaxis = group.yaxis();

            expect(_.isFunction(xaxis)).toBe(true);
            expect(xaxis.options()).toBe(group.options().xaxis);

            expect(_.isFunction(yaxis)).toBe(true);
            expect(yaxis.options()).toBe(group.options().yaxis);

            group = p.group({axis: {colorOpacity: 0.3}});
            xaxis = group.xaxis();
            expect(xaxis.options().colorOpacity).toBe(0.3);

        });

    });