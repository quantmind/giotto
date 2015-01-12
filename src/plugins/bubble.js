
    g.paper.plugin('force', {
        theta: 0.8,
        friction: 0.9,

    }, function (group, opts) {

        // Add force visualization to the group
        group.force = function (data, opts) {
            opts || (opts = {});
            chartFormats(group, opts);
            chartColor(group.paper(), copyMissing(p.force, opts));

            return group.add(function () {

            });
        };
    });