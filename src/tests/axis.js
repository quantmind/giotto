
    describe("Axis plugin", function() {
        var g = d3.giotto,
            _ = g._;

        it("Check axis defaults", function() {
            var axis = g.paper.plugins.axis;
            expect(_.isObject(axis)).toBe(true);

            expect(_.isObject(axis.defaults)).toBe(true);
        });

        it("Check axis options defaults", function () {
            var opts = g.options();

            expect(opts.axis).toBe(undefined);
            expect(_.isObject(opts.xaxis)).toBe(true);
            expect(_.isObject(opts.yaxis)).toBe(true);

            expect(opts.xaxis.show).toBe(false);
            expect(opts.xaxis.position).toBe('bottom');

            expect(opts.yaxis.show).toBe(false);
            expect(opts.yaxis.position).toBe('left');
        });

        it("Check axis group", function () {
            var p = g.paper(),
                group = p.group(),
                xaxis = group.xaxis(),
                yaxis = group.yaxis();

            expect(_.isFunction(xaxis)).toBe(true);
            expect(xaxis.options()).toBe(group.options().xaxis);

            expect(_.isFunction(yaxis)).toBe(true);
            expect(yaxis.options()).toBe(group.options().yaxis);

            group = p.group({xaxis: {colorOpacity: 0.3, show: true}});
            xaxis = group.xaxis();
            expect(xaxis.options().colorOpacity).toBe(0.3);
            expect(xaxis.options().show).toBe(true);
            expect(yaxis.options().colorOpacity).toBe(1);
        });

    });