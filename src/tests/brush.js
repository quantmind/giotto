
    describe("Brush plugin", function() {
        var g = d3.giotto,
            _ = g._;

        it("Check defaults", function() {
            var defaults = g.defaults.paper.brush;
            expect(_.isObject(defaults)).toBe(true);
            expect(defaults.axis).toBe(null);
            expect(defaults.fiilOpacity).toBe(0.125);
        });

        it("Check basic properties", function () {
            var p = g.paper(),
                group = p.group();

            expect(p.type()).toBe('svg');
            var brush = p.addBrush();
            expect(_.isFunction(brush)).toBe(true);

            var gr = p.current().select('g.brush'),
                node = gr.node();
            expect(node.tagName).toBe('g');
            expect(node).toBe(p.current().select('g.x-brush').node());
        });

        it("Test extent", function () {
            var p = g.paper();

            var brush = p.addBrush({extent: [0.45, 0.62]});
            expect(_.isFunction(brush)).toBe(true);
            var extent = brush.extent();
            expect(_.isArray(extent)).toBe(true);
            expect(extent.length).toBe(2);
            expect(extent[0]).toBe(0.45);
            expect(extent[1]).toBe(0.62);
            expect(p.brush()).toBe(brush);

            p.removeBrush();
            expect(p.brush()).toBe(null);
        });
    });