    //
    describe("Test Sunburst", function() {
        var g = d3.giotto,
            src = "https://gist.githubusercontent.com/lsbardel/f3d21f35a685a96706bf/raw";

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
                }),
                paper = sunb.paper();

            expect(paper.options().margin.top).toBe(30);
            expect(paper.options().margin.left).toBe(20);
            expect(sunb.options().src).toBe(src);
            expect(sunb.options().resize).toBe(true);
        });

        it("Check agile development build", function(done) {
            var scale;

            g.viz.sunburst({
                padding: '30',

                src: src,

                onInit: function (sunb) {
                    sunb.on('end', function (o) {
                        expect(g._.isObject(o)).toBe(true);
                        expect(o.type).toBe('end');
                        expect(sunb.alpha()).toBe(0);

                        if (scale === 'sqrt') {
                            expect(sunb.scale()).toBe('sqrt');
                            scale = 'linear';
                            expect(sunb.scale(scale)).toBe(sunb);
                            sunb.resume();
                        } else if (scale) {
                            expect(sunb.scale()).toBe('linear');
                            done();
                        } else {
                            expect(sunb.current()).toBe(undefined);
                            scale = 'sqrt';
                        }
                    });
                }
            }).start();
        });

    });