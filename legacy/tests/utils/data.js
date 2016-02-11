
    describe("Test data utilities", function() {
        var g = d3.giotto,
            _ = g._;

        it("test serie", function () {

            var serie = g.data.serie();

            expect(serie.data()).toBe(undefined);
            serie.data([[1, 3], [4, -5], [7, -9]]);
            expect(_.isArray(serie.data())).toBe(true);

            var range = serie.xrange();
            expect(range[0]).toBe(1);
            expect(range[1]).toBe(7);
            range = serie.yrange();
            expect(range[0]).toBe(-9);
            expect(range[1]).toBe(3);
        });

        it("test multi", function (done) {

            var multi = g.data.multi();

            expect(_.isObject(multi)).toBe(true);

            d3.dsv(';', 'text/csv')('https://gist.githubusercontent.com/lsbardel/85423c833fc833551e9f/raw/8aa0c34c485ad6354eb8bd3fcf010087d44961eb/population.csv', function (error, data) {
                if (error)
                    fail('could not load data');
                else
                    do_test(data);
                done();
            });

            function do_test (data) {
                multi = g.data.multi().data(data);

                expect(_.isObject(multi)).toBe(true);
                expect(_.isArray(multi.data())).toBe(true);

                var serie = multi.serie().y(1990);
                expect(serie.length > 0).toBe(true);
            }
        });

    });
