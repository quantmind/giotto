
    describe("Zoom plugin", function() {
        var g = d3.giotto,
            _ = g._;

        it("Check zoom defaults", function() {
            var zoom = g.chart.plugins.zoom;

            expect(_.isFunction(zoom)).toBe(true);
            expect(_.isObject(zoom.defaults)).toBe(true);

            expect(zoom.defaults.x).toBe(false);
            expect(zoom.defaults.y).toBe(false);
            expect(zoom.defaults.scaleExtent.length).toBe(2);
        });

    });