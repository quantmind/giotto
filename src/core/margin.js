    //
    //  Margin plugin
    //  ================
    //
    //
    //  Margin
    //  ===========
    //
    //  Add margins to a giotto group
    //
    g.paper.plugin('margin', {

        defaults: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
        },

        init: function (group) {

            var p = group.options(),
                factor = group.factor();

            group.marginLeft = function () {
                return factor*pc(p.margin.left, p.size[0]);
            };

            group.marginRight = function () {
                return factor*pc(p.margin.right, p.size[0]);
            };

            group.marginTop = function () {
                return factor*pc(p.margin.top, p.size[1]);
            };

            group.marginBottom = function () {
                return factor*pc(p.margin.bottom, p.size[1]);
            };

            group.innerWidth = function () {
                return factor*p.size[0] - group.marginLeft() - group.marginRight();
            };

            group.innerHeight = function () {
                return factor*p.size[1] - group.marginTop() - group.marginBottom();
            };

            group.aspectRatio = function () {
                return group.innerHeight()/group.innerWidth();
            };

            function pc (margin, size) {
                if (typeof(margin) === "string" && margin.indexOf('%') === margin.length-1)
                    margin = d3.round(0.01*parseFloat(margin)*size);
                return margin;
            }
        },

        options: function (opts) {
            var margin = opts.margin;
            opts.margin = extend({}, this.defaults);
            this.extend(opts.margin, margin);
        },

        // Allow to specify margin as a scalar value
        extend: function (opts, value) {
            if (value === undefined)
                return;
            if (!isObject(value))
                value = {
                    left: value,
                    right: value,
                    top: value,
                    bottom: value
                };
            else
                value = extend({}, opts[this.name], value);
            opts[this.name] = value;
        }
    });
