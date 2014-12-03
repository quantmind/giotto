
    describe("Angular Integration", function() {
        var g = d3.giotto,
            _ = g._;

        it('angular module', function (done) {

            g.require(['angular'], function (angular) {

                var mod = g.angular.module(angular);

                expect(mod.name).toBe('giotto');

                g.angular.addAll(angular);

                done();
            });

        });

    });