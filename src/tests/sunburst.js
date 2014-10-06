    //
    describe("Test Sunburst", function() {
        var SunBurst = d3.ext.SunBurst;

        it("Check basic properties", function() {
            var sunb = new SunBurst();
            expect(sunb instanceof d3.ext.Viz).toBe(true);
            expect(sunb instanceof SunBurst).toBe(true);
            expect(sunb.element instanceof Array).toBe(true);
        });

    });