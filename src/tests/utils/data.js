
    describe("Test data utilities", function() {
        var g = d3.giotto,
            _ = g._;

        it("test multi", function () {

            var multi = g.data.multi();

            expect(_.isObject(multi)).toBe(true);
        });

    });
