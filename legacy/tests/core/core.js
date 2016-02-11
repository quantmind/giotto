    //
    describe("Test extension object", function() {
        var g = d3.giotto;

        it("Check basic properties", function() {
            expect(typeof(g)).toBe('object');
            expect(typeof(g.version)).toBe('string');
            expect(g.d3).toBe(d3);
        });

        it("Check phantom", function() {
            expect(typeof(phantom)).toBe('object');
        });
    });