    //
    //  K-means clustering
    g.math.kmeans = function (centroids, max_iter, distance) {
        var km = {};

        max_iter = max_iter || 300;
        distance = distance || "euclidean";
        if (typeof distance == "string")
            distance = g.math.distances[distance];

        km.centroids = function (x) {
            if (!arguments.length) return centroids;
            centroids = x;
            return km;
        };

        km.maxIters = function (x) {
            if (!arguments.length) return max_iter;
            max_iter = +x;
            return km;
        };

        // create a set of random centroids from a set of points
        km.randomCentroids = function (points, K) {
            var means = points.slice(0); // copy
            means.sort(function() {
                return Math.round(Math.random()) - 0.5;
            });
            return means.slice(0, K);
        };

        km.classify = function (point) {
            var min = Infinity,
                index = 0,
                i, dist;
            for (i = 0; i < centroids.length; i++) {
                dist = distance(point, centroids[i]);
                if (dist < min) {
                    min = dist;
                    index = i;
                }
           }
           return index;
        };

        km.cluster = function (points, callback) {

            var iterations = 0,
                movement = true,
                N = points.length,
                K = centroids.length,
                clusters = new Array(K),
                newCentroids,
                n, k;

            if (N < K)
                throw Error('Number of points less than the number of clusters in K-means classification');

            while (movement && iterations < max_iter) {
                movement = false;
                ++iterations;

                // Assignments
                for (k = 0; k < K; ++k)
                    clusters[k] = {centroid: centroids[k], points: [], indices: []};

                for (n = 0; n < N; n++) {
                    k = km.classify(points[n]);
                    clusters[k].points.push(points[n]);
                    clusters[k].indices.push(n);
                }

                // Update centroids
                newCentroids = [];
                for (k = 0; k < K; ++k) {
                    if (clusters[k].points.length)
                        newCentroids.push(g.math.mean(clusters[k].points));
                    else {
                        // A centroid with no points, randomly re-initialise it
                        newCentroids = km.randomCentroids(points, K);
                        break;
                    }
                }

                for (k = 0; k < K; ++k) {
                    if (newCentroids[k] != centroids[k]) {
                        centroids = newCentroids;
                        movement = true;
                        break;
                    }
                }

                if (callback)
                    callback(clusters, iterations);
            }

            return clusters;
        };

        return km;
    };