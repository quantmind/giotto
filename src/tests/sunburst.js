    //
    describe("Test Sunburst", function() {
        var g = d3.giotto,
            src = "https://gist.githubusercontent.com/lsbardel/f3d21f35a685a96706bf/raw";

        it("Check basic properties", function() {
            var sunb = g.viz.sunBurst();

            expect(sunb.alpha()).toBe(0);
            expect(sunb.vizType()).toBe(g.viz.sunBurst);
            expect(sunb.vizName()).toBe('sunBurst');
            expect(sunb.options().padding).toBe(10);
        });

        it("Check agile development src", function() {
            var sunb = g.viz.sunBurst({
                    padding: '30',
                    src: src
                });
            expect(sunb.options().padding).toBe('30');
            expect(sunb.options().src).toBe(src);
            expect(sunb.options().resize).toBe(true);
        });

        it("Check agile development build", function(done) {
            var scale = 'sqrt',
                sunb = g.viz.sunBurst({
                    padding: '30',
                    scale: scale,
                    src: src
                }),
                check = function (o) {
                    expect(g._.isObject(o)).toBe(true);
                    expect(o.type).toBe('end');
                    expect(sunb.alpha()).toBe(0);
                    if (scale === 'sqrt') {
                        expect(sunb.scale()).toBe('sqrt');
                        scale = 'log';
                        expect(sunb.scale(scale)).toBe(sunb);
                    } else {
                        expect(sunb.scale()).toBe('log');
                        //
                        // try setting the
                        done();
                    }
                };
            sunb.on('end', check);
            sunb.start();
        });

    });