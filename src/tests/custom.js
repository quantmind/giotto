    //
    describe("Custom chart", function() {
        var g = d3.giotto,
            _ = g._;

        it("custom text", function() {
            var c = g.chart();

            expect(c.numSeries()).toBe(0);

            c.addSerie({
                custom: {
                    show: function () {
                        var group = this.group();
                    }
                }
            }).render();

            expect(c.numSeries()).toBe(1);
        });

    });