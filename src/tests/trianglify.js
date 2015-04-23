
    describe("Trianglify", function() {
        var g = d3.giotto;

        function _it() {}

        _it("Check basic properties", function() {
            var t = g.viz.trianglify();

            expect(t.alpha()).toBe(0);
            expect(t.vizType()).toBe(g.viz.trianglify);
            expect(t.vizName()).toBe('trianglify');

            expect(t.options().x_gradient).toBe(null);
            expect(t.options().y_gradient).toBe(null);
        });

        _it("Build simple", function(done) {
            var t = g.viz.trianglify();

            t.start().on('end.test', function (e) {
                var element = t.paper().element().select('.trianglify-background');
                //expect(element.lenght).toBe(1);
                done();
            });
        });
    });
