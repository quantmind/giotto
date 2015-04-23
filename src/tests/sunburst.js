    //
    describe("Test Sunburst", function() {
        var g = d3.giotto,
            _ = g._,
            src = '/sunburst';
            //src = "http://gist.githubusercontent.com/lsbardel/f3d21f35a685a96706bf/raw";

        it("Check basic properties", function() {
            var sunb = g.viz.sunburst();

            expect(sunb.alpha()).toBe(0);
            expect(sunb.vizType()).toBe(g.viz.sunburst);
            expect(sunb.vizName()).toBe('sunburst');
            expect(sunb.options().margin.left).toBe(20);
        });

        it("Check agile development src", function() {
            var sunb = g.viz.sunburst({
                    margin: {top: 30},
                    src: src
                });

            expect(sunb.options().margin.top).toBe(30);
            expect(sunb.options().margin.left).toBe(20);
            expect(sunb.options().src).toBe(src);
            expect(sunb.options().resize).toBe(true);
        });

        //TODO: fix this when http mock in place
        function __it() {}

        __it("Check agile development build", function(done) {
            var scale;

            g.viz.sunburst({
                padding: '30',

                src: src,

                onInit: function (sunb) {
                    sunb.on('end.test', function (o) {
                        expect(_.isObject(o)).toBe(true);
                        expect(o.type).toBe('end');
                        expect(sunb.alpha()).toBe(0);

                        var data = sunb.current();

                        expect(_.isObject(data)).toBe(true);
                        expect(data.depth).toBe(0);
                    });
                }
            }).start();
        }, 5000);

    });