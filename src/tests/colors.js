
    describe("Colors plugin", function() {
        var g = d3.giotto,
            _ = g._;

        it("Check defaults", function() {
            var o = g.options();

            expect(_.isArray(o.colors.scale)).toBe(true);
            expect(o.colors.darkerColor).toBe(0);
            expect(o.colors.darkerColor).toBe(0);
        });

        it("Check scale", function() {
            var o = g.options();
            o.extend({
                colors: {
                    scale: function (d3) {
                        return d3.scale.category20().range();
                    }
                }
            });
            expect(_.isArray(o.colors.scale)).toBe(true);
            expect(o.colors.scale.length).toBe(20);

            o = g.options({
                colors: {
                    scale: function (d3) {
                        return d3.scale.category20().range();
                    }
                }
            });

            expect(_.isArray(o.colors.scale)).toBe(true);
            expect(o.colors.scale.length).toBe(20);
        });

    });