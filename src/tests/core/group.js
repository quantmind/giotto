    function testGroup (type) {

        var g = d3.giotto,
            paper = g.paper(),
            _ = g._;

        function pgroup (opts) {
            opts || (opts = {});
            opts.type = type;
            return paper.group(opts);
        }

        it("scale", function () {
            var group = pgroup(),
                scale = group.scale();

            expect(scale.domain()[0]).toBe(0);
            expect(scale.domain()[1]).toBe(1);
            expect(scale(0)).toBe(0);
            expect(scale(1)).toBe(group.innerWidth());

            // resize the paper
            expect(paper.resize([500, 300]).size()[0]).toBe(500);
            expect(group.innerWidth()).toBe(460);
            expect(scale(0)).toBe(0);
            expect(scale(1)).toBe(group.innerWidth());
        });

        it("Axis", function () {
            var group = pgroup(),
                xaxis = group.xaxis(),
                yaxis = group.yaxis();

            expect(_.isFunction(xaxis.scale())).toBe(true);
            expect(xaxis.orient()).toBe('bottom');
            expect(yaxis.orient()).toBe('left');
            expect(group.scaley(0)).toBe(group.innerHeight());
            expect(group.scaley(1)).toBe(0);
        });

        it("Check aspect ratio", function () {
            var group = pgroup();
            //
            // custom size
            paper.resize([600, 500]);
            expect(group.width()).toBe(600);
            expect(group.height()).toBe(500);
            expect(group.aspectRatio()).not.toBe(5/6);
            expect(group.aspectRatio()).toBe(group.innerHeight()/group.innerWidth());
            checkScale(group);
        });

        it("Check scalex scaley methods", function () {
            var group = pgroup();

            expect(group.scalex(1)).toBe(group.innerWidth());
            expect(group.scaley(1)).toBe(0);
        });

        it("dim method", function () {
            var group = pgroup();

            expect(group.dim(0)).toBe(0);
            expect(group.dim(0.5)).toBe(0.5);
            expect(group.dim(1)).toBe(1);
            expect(group.dim(group.innerWidth()+'px')).toBe(1);
        });

        it("Check paper change", function (done) {
            var width = 420,
                height = 290;

            function listener (e) {
                expect(e.type).toBe('change');
                expect(paper.size()[0]).toBe(width);
                expect(paper.size()[1]).toBe(height);
                done();
            }
            paper.on('change.test', listener).resize([width, height]);
        });

        function checkScale(group) {
            var width = group.innerWidth(),
                height = group.innerHeight(),
                scale = group.xaxis().scale();

            expect(scale(1)).toBe(width);
            expect(scale(0.5)).toBe(0.5*width);
            expect(scale(0)).toBe(0);
            expect(scale(-1)).toBe(-width);
            //
            // Now check scale change
            scale.domain([-1, 1]);
            //
            expect(scale(1)).toBe(width);
            expect(scale(0)).toBe(0.5*width);
            expect(scale(-1)).toBe(0);
        }

    }

    //
    describe("SVG group", function() {
        testGroup('svg');
    });

    //
    describe("CANVAS group", function() {
        testGroup('canvas');
    });
