
    function testCharts (type) {
        var g = d3.giotto;

        function chart(opts) {
            opts || (opts = {});
            opts.type = type;
            return g.viz.chart(opts);
        }

        it('Test auto axis', function (done) {
            var c = chart(),
                p = c.paper();

            expect(p.type()).toBe(type);
            c.addSerie([[1, 1], [2, 3], [3, 0], [4, -5]]);
            expect(c.numSeries()).toBe(1);

            c.resume().on('tick.test', function () {
                c.each(function (serie) {
                    var group = serie.group();
                    expect(group.paper()).toBe(p);
                    expect(group.xaxis().scale().domain()[0]).toBe(1);
                    expect(group.xaxis().scale().domain()[1]).toBe(4);
                    expect(group.yaxis().scale().domain()[0]).toBe(-5);
                    expect(group.yaxis().scale().domain()[1]).toBe(3);
                });
                done();
            });
        });

        it('Set axis min max', function (done) {
            var c = chart({yaxis: {min: -2, max: 2}}),
                p = c.paper();

            expect(p.type()).toBe(type);
            c.addSerie([[1, 1], [2, 3], [3, 0], [4, -5]]);
            expect(c.numSeries()).toBe(1);

            c.resume().on('tick.test', function () {
                c.each(function (serie) {
                    var group = serie.group();
                    expect(group.yaxis().scale().domain()[0]).toBe(-2);
                    expect(group.yaxis().scale().domain()[1]).toBe(2);
                });
                done();
            });
        });

        it('Points', function () {
            var norm = d3.random.normal(0.5, 0.1),
                c = chart({
                        point: {show: true}
                    }),
                count = 0;

            c.addSerie(d3.range(800).map(function () {
                return [Math.random(), norm()];
            }));

            c.each(function (serie) {
                count++;
                expect(serie.point).not.toBe(undefined);
                expect(serie.point.symbol).toBe('circle');

                expect(serie.line).toBe(undefined);
                expect(serie.bar).toBe(undefined);
            });

            expect(count).toBe(1);
        });

        it('bars', function () {
            var norm = d3.random.normal(0.5, 0.1),
                c = chart({
                        bar: {show: true}
                    }),
                count = 0;

            c.addSerie(d3.range(30).map(function () {
                return [Math.random(), norm()];
            }));

            c.each(function (serie) {
                count++;
                expect(serie.point).toBe(undefined);
                expect(serie.line).toBe(undefined);

                expect(serie.bar).not.toBe(undefined);
                expect(serie.bar.radius).toBe(4);
            });

            expect(count).toBe(1);
        });
    }


    describe("SVG charts", function() {
        testCharts('svg');
    });

    describe("Canvas charts", function() {
        testCharts('canvas');
    });