
    function testCharts (type) {
        var g = d3.giotto;

        function chart(opts) {
            opts || (opts = {});
            opts.type = type;
            return g.viz.chart(opts);
        }

        it('Test auto axis', function () {
            var c = chart(),
                p = c.paper();

            expect(p.type(), 'type');
            c.addSerie([[1, 1], [2, 3], [3, 0], [4, -5]]);
            expect(p.xAxis().scale().domain()[0]).toBe(1);
            expect(p.xAxis().scale().domain()[1]).toBe(4);
            expect(p.yAxis().scale().domain()[0]).toBe(-5);
            expect(p.yAxis().scale().domain()[1]).toBe(3);
        });

        it('Set axis min max', function () {
            var c = chart({yaxis: {min: -2, max: 2}}),
                p = c.paper();

            expect(p.type(), 'type');
            c.addSerie([[1, 1], [2, 3], [3, 0], [4, -5]]);
            expect(p.yAxis().scale().domain()[0]).toBe(-2);
            expect(p.yAxis().scale().domain()[1]).toBe(2);
        });

        it('Points', function () {
            var norm = d3.random.normal(0.5, 0.1),
                c = chart({
                        point: {show: true},
                        line: {show: false}
                    }),
                count = 0;

            c.addSerie(d3.range(800).map(function () {
                return [Math.random(), norm()];
            }));

            c.each(function (serie) {
                count++;
                expect(serie.point).not.toBe(undefined);
                expect(serie.point.symbol).toBe('circle');
                expect(serie.point.chart).not.toBe(undefined);

                expect(serie.line).not.toBe(undefined);
                expect(serie.line.chart).toBe(undefined);

                expect(serie.bar).not.toBe(undefined);
                expect(serie.bar.chart).toBe(undefined);
            });

            expect(count).toBe(1);
        });

        it('bars', function () {
            var norm = d3.random.normal(0.5, 0.1),
                c = chart({
                        bar: {show: true},
                        line: {show: false}
                    }),
                count = 0;

            c.addSerie(d3.range(30).map(function () {
                return [Math.random(), norm()];
            }));

            c.each(function (serie) {
                count++;
                expect(serie.point).not.toBe(undefined);
                expect(serie.point.chart).toBe(undefined);

                expect(serie.line).not.toBe(undefined);
                expect(serie.line.chart).toBe(undefined);

                expect(serie.bar).not.toBe(undefined);
                expect(serie.bar.radius).toBe(4);
                expect(serie.bar.chart).not.toBe(undefined);
            });

            expect(count).toBe(1);
        });
    }


    describe("SVG charts", function() {
        testCharts('svg');
    });