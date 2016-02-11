
    describe("Crossfilter data", function() {
        var g = d3.giotto,
            _ = g._,
            data = randomPath(3000);

        it("Check data", function(done) {
            expect(_.size(data)).toBe(3000);

            g.crossfilter({
                data: data,

                dimensions: ['time'],

                callback: function (cf) {
                    expect(cf.data.size()).toBe(3000);
                    expect(cf.dims.time).not.toBe(undefined);
                    done();
                }
            });
        });

        it("Reduce density group", function(done) {
            expect(_.size(data)).toBe(3000);

            g.crossfilter({
                data: data,

                dimensions: ['time'],

                callback: function (cf) {
                    expect(cf.data.size()).toBe(3000);
                    expect(cf.dims.time).not.toBe(undefined);
                    var group = cf.reduceDensity('time', 300);
                    expect(group.length).toBe(300);
                    // It should be ordered with increasing time
                    var g1 = group[0],
                        g0;
                    for (var j=1; j<group.length; ++j) {
                        g0 = g1;
                        g1 = group[j];
                        expect(g1.time > g0.time).toBe(true);
                    }
                    done();
                }
            });
        });


        function randomPath (N) {
            // Create a random path
            var t = d3.range(0, N, 1),
                σ = 0.1,
                µ = 0,
                data = [{time: 0, value: 0}],
                norm = d3.random.normal(0, σ),
                dt;

            for(var i=1; i<t.length; i++) {
                dt = t[i] - t[i-1];
                dx = dt*µ + σ*norm()*Math.sqrt(dt);
                data[i] = {
                    time: i,
                    value: data[i-1].value + dx
                };
            }
            return data;
        }
    });