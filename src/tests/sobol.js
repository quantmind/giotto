    //
    describe("Test sobol", function() {
        var g = d3.giotto;

        it("Check sobol2 init", function() {
            var sobol = g.math.sobol(2);

            expect(sobol.dimension()).toBe(2);
            expect(sobol.count()).toBe(0);
        });

        it("Check sobol2", function() {
            var sobol = g.math.sobol(2),
                v = sobol.next();

            expect(v.length).toBe(2);
            expect(sobol.next().length).toBe(2);
            expect(sobol.count()).toBe(2);
        });
    });