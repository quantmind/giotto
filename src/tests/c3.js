    //
    describe("Test C3 graphs", function() {
        var C3 = d3.ext.C3;

        it("Check basic properties", function() {
            var c3 = new C3();
            expect(c3 instanceof d3.ext.Viz).toBe(true);
            expect(c3 instanceof C3).toBe(true);
            expect(c3.element instanceof Array).toBe(true);
        });

        it("Check sizing", function() {
            var c3 = new C3({height: 100});
            expect(c3.attrs.height).toBe(100);
            expect(c3.element instanceof Array).toBe(true);
        });

    });