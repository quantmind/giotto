    //
    describe("Test extension object", function() {
        var d3ext = d3.ext;

        it("Check basic properties", function() {
            expect(typeof(d3ext)).toBe('object');
            expect(typeof(d3ext.version)).toBe('string');
        });

        it("Check phantom", function() {
            expect(typeof(phantom)).toBe('object');
        });
    });