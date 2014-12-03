    //
    describe("Test canvas paper", function() {
        var g = d3.giotto,
            _ = g._;

        it("Check basic properties", function() {
            var paper = g.paper({type: 'canvas'});
            expect(_.isObject(paper)).toBe(true);
            expect(paper.type()).toBe('canvas');
            var current = paper.current();

            // Default size
            expect(paper.width()).toBe(g.constants.WIDTH);
            expect(paper.height()).toBe(g.constants.HEIGHT);

            //
            expect(paper.destroy().current()).toBe(null);
        });

        it("Check resize", function () {
            var paper = g.paper({type: 'canvas', width: 600, height: 500}),
                width = 400,
                height = 300;

            expect(paper.type()).toBe('canvas');

            function listener (e) {
                expect(e.type).toBe('refresh');
                expect(e.size[0]).toBe(width);
                expect(e.size[1]).toBe(height);
            }
            paper.on('refresh', listener);

            paper.resize([width, height]);
            expect(paper.width()).toBe(width);
            expect(paper.height()).toBe(height);

            width = 200;
            height = 180;
            paper.resize([width, height]);
            expect(paper.width()).toBe(width);
            expect(paper.height()).toBe(height);
        });

        it("Check clear", function () {
            var paper = g.paper({type: 'canvas'});

            expect(paper.clear()).toBe(paper);
        });

        it("Axis", function () {
            var paper = g.paper({type: 'canvas'}),
                xaxis = paper.xAxis(),
                yaxis = paper.yAxis();

            expect(_.isFunction(xaxis.scale())).toBe(true);
            expect(xaxis.orient()).toBe('bottom');
            expect(yaxis.orient()).toBe('left');
            expect(paper.yaxis(2).yAxis().orient()).toBe('right');
        });

    });