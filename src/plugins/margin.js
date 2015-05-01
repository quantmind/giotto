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

            group.innerWidth = function () {
                return factor*(p.size[0] - p.margin.left - p.margin.right);
            };

            group.innerHeight = function () {
                return factor*(p.size[1] - p.margin.top - p.margin.bottom);
            };

            group.aspectRatio = function () {
                return group.innerHeight()/group.innerWidth();
            };

            group.marginLeft = function () {
                return factor*p.margin.left;
            };

            group.marginRight = function () {
                return factor*p.margin.right;
            };

            group.marginTop = function () {
                return factor*p.margin.top;
            };

            group.marginBottom = function () {
                return factor*p.margin.bottom;
            };

        },

        options: function (opts) {
            var margin = opts.margin;
            if (isObject(margin)) opts.margin = extend({}, this.defaults, margin);
            else if (margin !== undefined) opts.margin = {left: value, right: value, top: value, bottom: value};
        }
    });