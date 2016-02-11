
    function scaled (c) {

        function f(group, data, opts) {
            return c(group, data, opts)
                        .x(function (d) {return d.x;})
                        .y(function (d) {return d.y;});
        }

        f.scaled = true;

        return f;
    }

    var chartTypes = {

        geo: function (group, data, opts) {
            return group.geo(data, opts);
        },

        pie: function (group, data, opts) {
            return group.pie(data, opts);
        },

        bar: scaled(function (group, data, opts) {
            return group.barchart(data, opts);
        }),

        line: scaled(function (group, data, opts) {
            return group.path(data, opts);
        }),

        point: scaled(function (group, data, opts) {
            return group.points(data, opts);
        }),

        custom: function (group, data, opts) {
            var draw = drawing(group, function () {
                    return opts.show.call(this);
                }).options(opts).data(data);

            if (group.type() === 'canvas') {
                draw = canvasMixin(draw);
                draw.each = function (callback) {
                    callback.call(draw);
                    return draw;
                };
            }

            return group.add(draw);
        }
    };
