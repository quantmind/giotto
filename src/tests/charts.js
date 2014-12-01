
    function testCharts(type) {
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
    }


    describe("SVG charts", function() {
        testCharts('svg');
    });