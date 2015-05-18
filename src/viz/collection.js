    //
    // Manage a collection of visualizations
    g.createviz('collection', {

            paper: false
        },

        function (collection) {

            var vizs = {};

            collection.set = function (key, viz) {
                vizs[key] = viz;
            };

            collection.size = function () {
                return size(vizs);
            };

            // Required by the visualization class
            collection.resume = function () {

                var opts = collection.options();

                forEach(vizs, function (viz, key) {
                    var o = opts[key];
                    if (o) viz.options(o);
                    viz.data(collection.data()).start();
                });
            };
        });