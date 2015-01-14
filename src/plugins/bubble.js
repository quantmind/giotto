
    g.paper.plugin('bubble', {
        force: false,
        theta: 0.8,
        friction: 0.9
    }, function (group, opts) {

        // Add force visualization to the group
        group.bubble = function (data, opts) {
            opts || (opts = {});
            chartFormats(group, opts);
            copyMissing(p.bubble, opts);

            return group.add(g[type].bubble)
                        .dataConstructor(bubble_costructor)
                        .options(opts);
        };
    });

    var bubble_costructor = function (rawdata) {
        return rawdata;
    };

    g.svg.bubble = function () {
        var group = this.group(),
            opts = this.options(),
            bubble = d3.layout.pack()
                        .padding(opts.padding)
                        .size([group.innerWidth(), group.innerHeight()])
                        .sort(null)
                        .data(this.data()),
            elem = group.element().selectAll("#" + this.uid()).data([true]);

        elem.enter().append('g').attr('id', thiss.uid());

    };