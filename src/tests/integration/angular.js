
    describe("Angular Integration", function() {
        var g = d3.giotto,
            _ = g._;

        it('angular module', function () {

            var mod = g.angular.module(angular).addAll().module();

            expect(mod.name).toBe('giotto');

        });

    });