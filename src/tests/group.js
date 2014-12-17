    function testPaper (type) {

        var g = d3.giotto,
            _ = g._;

        function paper (opts) {
            opts || (opts = {});
            opts.type = type;
            return g.paper(opts);
        }

        it("Axis", function () {
            var p = paper(),
                xaxis = p.xAxis(),
                yaxis = p.yAxis();

            expect(_.isFunction(xaxis.scale())).toBe(true);
            expect(xaxis.orient()).toBe('bottom');
            expect(yaxis.orient()).toBe('left');
            expect(p.scaley(0)).toBe(p.innerHeight());
            expect(p.scaley(1)).toBe(0);
            expect(p.yaxis(2).yAxis().orient()).toBe('right');
        });

        it("Check axis linear scale", function () {
            var p = paper();
            checkScale(p);
            //
            // custom size
            p = paper({width: 600, height: 500});
            expect(p.width()).toBe(600);
            expect(p.height()).toBe(500);
            expect(p.aspectRatio()).not.toBe(5/6);
            expect(p.aspectRatio()).toBe(p.innerHeight()/p.innerWidth());
            checkScale(p);
        });

        it("Check scalex scaley methods", function () {
            var p = paper();

            expect(p.scalex(1)).toBe(p.innerWidth());
            expect(p.scaley(1)).toBe(0);
        });

        it("dim method", function () {
            var p = paper();

            expect(p.dim(0)).toBe(0);
            expect(p.dim(0.5)).toBe(0.5);
            expect(p.dim(1)).toBe(1);
            expect(p.dim(p.innerWidth()+'px')).toBe(1);
        });

        it("Check resize", function () {
            var p = paper({width: 600, height: 500}),
                width = 400,
                height = 300;

            function listener (e) {
                expect(e.type).toBe('refresh');
                expect(e.size[0]).toBe(width);
                expect(e.size[1]).toBe(height);
            }
            p.on('refresh', listener);

            p.resize([width, height]);
            expect(p.width()).toBe(width);
            expect(p.height()).toBe(height);

            width = 200;
            height = 180;
            p.resize([width, height]);
            expect(p.width()).toBe(width);
            expect(p.height()).toBe(height);
        });

        it("Check clear", function () {
            var p = paper();

            expect(p.clear()).toBe(p);
        });

        function checkScale(p) {
            var width = p.innerWidth(),
                height = p.innerHeight(),
                scale = p.xAxis().scale();

            expect(scale(1)).toBe(width);
            expect(scale(0.5)).toBe(0.5*width);
            expect(scale(0)).toBe(0);
            expect(scale(-1)).toBe(-width);
            //
            // Now check scale change
            p.xAxis().scale().domain([-1, 1]);
            //
            expect(scale(1)).toBe(width);
            expect(scale(0)).toBe(0.5*width);
            expect(scale(-1)).toBe(0);
        }

    }

    //
    describe("SVG group", function() {
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

        it("Check group", function () {
            var paper = g.paper(),
                gr = paper.group();
            expect(gr.node().tagName).toBe('g');
            expect(paper.current()).toBe(gr);
            //expect(paper.parent().current()).toBe(paper.root().current());
        });

        it("Check circle", function () {
            var p = g.paper(),
                c = p.circle(0.5, 0.5, 0.3);

            expect(c.node().tagName).toBe('circle');
            expect(+c.attr('cx')).toBe(0.5*p.innerWidth());
            expect(+c.attr('cy')).toBe(0.5*p.innerHeight());
            expect(+c.attr('r')).toBe(0.3*p.innerWidth());
        });

        it("Check rect", function () {
            var p = g.paper({width: 600, height: 500});
            p.xAxis().scale().domain([-1, 1]);
            p.yAxis().scale().domain([-1, 1]);

            var r = p.rect(-0.5, -0.5, 1, 1);

            expect(+r.attr('x')).toBe(140);
            expect(+r.attr('y')).toBe(345);
        });

        testPaper('svg');
    });


    //
    describe("CANVAS group", function() {
        var g = d3.giotto,
            _ = g._;

        it("test retina", function () {
            var paper = g.paper({type: 'canvas'}),
                innerWidth = paper.innerWidth(),
                innerHeight = paper.innerHeight(),
                factor = paper.factor(),
                size = paper.size();
            expect(paper.factor(2*factor).factor()).toBe(2*factor);
        });

        testPaper('canvas');
    });