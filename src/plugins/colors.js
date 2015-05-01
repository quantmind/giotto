    //
    //  Colors
    //  ===========
    //
    //  Add margins to a giotto group
    //
    g.paper.plugin('colors', {

        defaults: {
            scale: d3.scale.category10().range(),
            darkerColor: 0,
            brighterColor: 0,
            colorIndex: 0
        },

        init: function () {

            // pick a color
            d.pickColor = function (index) {
                if (arguments.length === 0)
                    index = opts.colorIndex++;
                var dk = 0, bk = 0;
                while (index >= opts.colors.length) {
                    index -= opts.colors.length;
                    dk += opts.darkerColor;
                    bk += opts.brighterColor;
                }
                var c = opts.colors[index];
                if (dk)
                    c = d3.rgb(c).darker(dk).toString();
                else if (bk)
                    c = d3.rgb(c).brighter(bk).toString();
                return c;
            };
        },

        options: function (opts) {
            var colors = extend({}, this.defaults, opts.colors);
            if (isFunction (colors.scale)) colors.scale = colors.scale(d3);
            opts.colors = colors;
        }

    });