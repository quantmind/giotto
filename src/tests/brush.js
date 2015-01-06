
    describe("Brush plugin", function() {
        var g = d3.giotto,
            _ = g._;

        it("Check defaults", function() {
            var defaults = g.defaults.paper.brush;
            expect(_.isObject(defaults)).toBe(true);
            expect(defaults.axis).toBe(null);
            expect(defaults.fillOpacity).toBe(0.125);
        });

        it("Check basic properties", function () {
            var p = g.paper(),
                group = p.group();

            expect(p.type()).toBe('svg');
            var brush = group.addBrush();
                options = brush.options();

            expect(options.axis).toBe(null);
        });

        it("Test extent", function () {
            var p = g.paper(),
                group = p.group();

            var brush = group.addBrush({
                axis: 'x',
                extent: [0.45, 0.62]
            });
            //var extent = brush.extent();
            //expect(_.isArray(extent)).toBe(true);
            //expect(extent.length).toBe(2);
            //expect(extent[0]).toBe(0.45);
            //expect(extent[1]).toBe(0.62);
            //expect(p.brush()).toBe(brush);

            //p.removeBrush();
            //expect(p.brush()).toBe(null);
        });
    });