    //
    describe("K-means clustering", function() {
        var g = d3.giotto;

        it("Simple checks", function() {
            var km = g.math.kmeans();

            expect(km.centroids()).toBe(undefined);
            expect(km.maxIters()).toBe(300);
            expect(km.maxIters('400').maxIters()).toBe(400);

            var points = d3.range(200).map(function () {
                return [Math.random(), Math.random()];
            });
            var centroids = km.randomCentroids(points, 10);
            expect(points.length).toBe(200);
            expect(centroids.length).toBe(10);
            expect(km.centroids(centroids).centroids().length).toBe(10);
        });

        it("Kmeans", function () {
            var km = g.math.kmeans();
            var points = d3.range(200).map(function () {
                return [Math.random(), Math.random()];
            });
            var centroids = km.randomCentroids(points, 10),
                prevIter = 0;

            km.centroids(centroids).cluster(points, function (cluster, iteration) {
                expect(iteration).toBe(++prevIter);
            });
        });

    });