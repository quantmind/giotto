    //
    describe("Right click menu", function() {
        var g = d3.giotto,
            _ = g._;

        it("Api", function() {
            var menu = g.contextmenu;

            expect(_.isObject(menu)).toBe(true);
            expect(menu.disabled()).toBe(false);
            expect(menu.disabled(true).disabled()).toBe(true);
            expect(menu.disabled(false).disabled()).toBe(false);
        });

    });