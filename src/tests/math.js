
    //
    describe("Math utilities", function() {
        var m = d3.giotto.math,
            _ = d3.giotto._;

        it("Check Euclidean distance", function () {
            var euclidean = m.distances.euclidean;
            expect(euclidean([0], [0])).toBe(0);
            expect(euclidean([0, 0], [0, 1])).toBe(1);
            expect(euclidean([0, -1], [0, 1])).toBe(2);
        });


        it("Mean of array", function () {
            var mean = m.mean,
                input = [[1, 2], [3, 1], [2, 1.5]],
                a = mean(input);

            expect(a.length).toBe(2);
            expect(a[0]).toBe(2);
            expect(a[1]).toBe(1.5);
            // Make sure the input didn't change
            expect(input.length).toBe(3);
            expect(input[0].length).toBe(2);
            expect(input[1].length).toBe(2);
            expect(input[2].length).toBe(2);
        });

        it("xyfunction", function () {
            var xy = m.xyfunction(d3.range(10), function (x) {
                return x*x;
            });

            expect(_.isArray(xy)).toBe(true);
            expect(xy.length).toBe(10);
            expect(xy[0].length).toBe(2);
            xy.forEach(function (p) {
                expect(p[1]).toBe(p[0]*p[0]);
            });
        });
    });