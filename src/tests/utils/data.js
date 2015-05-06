
    describe("Test data utilities", function() {
        var g = d3.giotto,
            _ = g._;

        it("test multi", function (done) {

            var multi = g.data.multi();

            expect(_.isObject(multi)).toBe(true);

            d3.dsv(';', 'text/csv')('giottoweb/content/data/population.csv', function (error, data) {
                if (error)
                    fail('could not load data');
                else
                    do_test(data);
                done();
            });

            function do_test (data) {
                multi = g.data.multi(data);

                expect(_.isObject(multi)).toBe(true);

            }
        });

    });
