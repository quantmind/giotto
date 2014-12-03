    //
    describe("Test svg paper", function() {
        var g = d3.giotto,
            _ = g._;

        it("Check basic properties", function() {
            var paper = g.paper();
            expect(_.isObject(paper)).toBe(true);
            expect(paper.type()).toBe('svg');
            var current = paper.current();
            expect(current.node().tagName).toBe('g');
            expect(paper.parent().current()).toBe(current);

            // Default size
            expect(paper.width()).toBe(g.constants.WIDTH);
            expect(paper.height()).toBe(g.constants.HEIGHT);
            //
            expect(paper.destroy().current()).toBe(null);
        });

        it("Check axis linear scale", function () {
            var paper = g.paper();
            checkScale(paper);
            //
            // custom size
            paper = g.paper({width: 600, height: 500});
            expect(paper.width()).toBe(600);
            expect(paper.height()).toBe(500);
            expect(paper.aspectRatio()).not.toBe(5/6);
            expect(paper.aspectRatio()).toBe(paper.innerHeight()/paper.innerWidth());
            checkScale(paper);
        });

        it("Check scalex scaley methods", function () {
            var paper = g.paper();

            expect(paper.scalex(1)).toBe(paper.innerWidth());
            expect(paper.scaley(1)).toBe(0);
        });

        it("Check group", function () {
            var paper = g.paper(),
                gr = paper.group();
            expect(gr.node().tagName).toBe('g');
            expect(paper.current()).toBe(gr);
            //expect(paper.parent().current()).toBe(paper.root().current());
        });

        it("Check circle", function () {
            var paper = g.paper(),
                c = paper.circle(0.5, 0.5, 0.3);

            expect(c.node().tagName).toBe('circle');
            expect(+c.attr('cx')).toBe(0.5*paper.innerWidth());
            expect(+c.attr('cy')).toBe(0.5*paper.innerHeight());
            expect(+c.attr('r')).toBe(0.3*paper.innerWidth());
        });

        it("Check rect", function () {
            var paper = g.paper({width: 600, height: 500});
            paper.xAxis().scale().domain([-1, 1]);
            paper.yAxis().scale().domain([-1, 1]);

            var r = paper.rect(-0.5, -0.5, 1, 1);

            expect(+r.attr('x')).toBe(140);
            expect(+r.attr('y')).toBe(345);
        });

        it("Check resize", function () {
            var paper = g.paper({width: 600, height: 500}),
                width = 400,
                height = 300;

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
            var paper = g.paper();

            expect(paper.clear()).toBe(paper);
        });

        function checkScale(paper) {
            var width = paper.innerWidth(),
                height = paper.innerHeight(),
                scale = paper.xAxis().scale();

            expect(scale(1)).toBe(width);
            expect(scale(0.5)).toBe(0.5*width);
            expect(scale(0)).toBe(0);
            expect(scale(-1)).toBe(-width);
            //
            // Now check scale change
            paper.xAxis().scale().domain([-1, 1]);
            //
            expect(scale(1)).toBe(width);
            expect(scale(0)).toBe(0.5*width);
            expect(scale(-1)).toBe(0);
        }
    });