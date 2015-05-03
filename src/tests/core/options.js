
    describe("Options", function() {
        var g = d3.giotto,
            _ = g._;

        it("Check options api", function() {
            var opts = g.options();
            expect(_.isObject(opts)).toBe(true);
            expect(_.isFunction(opts.extend)).toBe(true);
            expect(_.isFunction(opts.copy)).toBe(true);
            expect(opts.type).toBe('svg');
            expect(opts.resize).toBe(true);
        });

        it("Check options margin", function() {
            var opts = g.options({margin: 50});
            expect(_.isObject(opts)).toBe(true);
            expect(_.isObject(opts.margin)).toBe(true);
            expect(opts.margin.top).toBe(50);
            expect(opts.margin.bottom).toBe(50);
            expect(opts.margin.right).toBe(50);
            expect(opts.margin.left).toBe(50);

            opts = g.options({margin: '10%'});
            expect(_.isObject(opts)).toBe(true);
            expect(_.isObject(opts.margin)).toBe(true);
            expect(opts.margin.top).toBe('10%');
            expect(opts.margin.bottom).toBe('10%');
            expect(opts.margin.right).toBe('10%');
            expect(opts.margin.left).toBe('10%');
        });
    });