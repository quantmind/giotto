    //
    describe("Test Sunburst", function() {
        var SunBurst = d3.ext.SunBurst;

        it("Check basic properties", function() {
            var sunb = new SunBurst();
            expect(sunb instanceof d3.ext.Viz).toBe(true);
            expect(sunb instanceof SunBurst).toBe(true);
            expect(sunb.element instanceof Array).toBe(true);
            expect(sunb.attrs.padding).toBe(10);
        });

        it("Check agile development", function() {
            var src = "https://gist.githubusercontent.com/lsbardel/f3d21f35a685a96706bf/raw",
                sunb = new SunBurst({
                    padding: '30',
                    src: src
                });
            expect(sunb.attrs.padding).toBe('30');
            expect(sunb.attrs.src).toBe(src);
        });

    });