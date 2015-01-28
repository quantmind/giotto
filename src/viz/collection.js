    //
    // Manage a collection of visualizations
    g.collection = function () {
        var collection = vizMixin(d3.map());

        collection.start = function () {
            return onInitViz(collection).load(start);
        };

        return collection;

        function start () {
            var opts = collection.options();

            collection.forEach(function (key, viz) {
                var o = opts[key];
                if (o) viz.options(o);
                viz.data(collection.data()).start();
            });
        }
    };