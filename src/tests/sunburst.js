    //
    describe("Test Sunburst", function() {
        var SunBurst = d3.giotto.SunBurst,
            src = "https://gist.githubusercontent.com/lsbardel/f3d21f35a685a96706bf/raw";

        it("Check basic properties", function() {
            var sunb = new SunBurst();
            expect(sunb instanceof d3.giotto.Viz).toBe(true);
            expect(sunb instanceof SunBurst).toBe(true);
            expect(sunb.element instanceof Array).toBe(true);
            expect(sunb.attrs.padding).toBe(10);
        });

        it("Check agile development src", function() {
            var sunb = new SunBurst({
                    padding: '30',
                    src: src
                });
            expect(sunb.attrs.padding).toBe('30');
            expect(sunb.attrs.src).toBe(src);
            expect(sunb.attrs.resize).toBe(false);
        });

        it("Check agile development build", function(done) {
            var sunb = new SunBurst({
                    autoBuild: false,
                    padding: '30',
                    src: src
                }),
                check = function () {
                    expect(this).toBe(sunb);
                    //expect(typeof(o.attrs.data)).toBe('object');
                    done();
                };
            expect(sunb.attrs.autoBuild).toBe(false);
            sunb.on('build', check);
            sunb.build();
        });

    });