
    describe("Brush plugin", function() {
        var g = d3.giotto,
            _ = g._;

        it("Check defaults", function() {
            var defaults = g.defaults.paper.brush
            expect(_.isObject(defaults)).toBe(true);
            expect(defaults.axis).toBe('x');
            expect(defaults.opacity).toBe(0.125);
        });

        it("Check basic properties", function () {
            var p = g.paper();

            expect(p.type()).toBe('svg');
            var brush = p.addBrush();
            expect(_.isFunction(brush)).toBe(true);

            var gr = p.current().select('g.brush'),
                node = gr.node();
            expect(node.tagName).toBe('g');
            expect(node).toBe(p.current().select('g.x-brush').node());
        });
    });