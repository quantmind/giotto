    function testGroup (type) {

        var g = d3.giotto,
            paper = g.paper(),
            _ = g._;

        function pgroup (opts) {
            opts || (opts = {});
            opts.type = type;
            return paper.group(opts);
        }

        it("Axis", function () {
            var group = pgroup(),
                xaxis = group.xaxis(),
                yaxis = group.yaxis();

            expect(_.isFunction(xaxis.scale())).toBe(true);
            expect(xaxis.orient()).toBe('bottom');
            expect(yaxis.orient()).toBe('left');
            expect(p.scaley(0)).toBe(p.innerHeight());
            expect(p.scaley(1)).toBe(0);
        });

        it("Check axis linear scale", function () {
            var group = pgroup();
            checkScale(group);
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
                scale = p.xaxis().scale();

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

    describe("Paper", function () {
        var g = d3.giotto,
            _ = g._;

        it("Check basic properties", function() {
            var paper = g.paper();

            expect(_.isObject(paper)).toBe(true);
            expect(paper.type()).toBe('svg');
            expect(paper.element().node().tagName.toLowerCase()).toBe('div');

            // Default size
            expect(paper.size()[0]).toBe(g.constants.WIDTH);
            expect(paper.size()[1]).toBe(g.constants.HEIGHT);
        });

        it("Check axis linear scale", function () {
            var paper = g.paper({width: 600, height: 500});

            expect(paper.size()[0]).toBe(600);
            expect(paper.size()[1]).toBe(500);
        });
    });

    //
    describe("SVG group", function() {
        //testPaper('svg');
    });

    //
    describe("CANVAS group", function() {
        //testGroup('canvas');
    });
