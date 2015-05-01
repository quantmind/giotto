    //
    //  Colors
    //  ===========
    //
    //  Add margins to a giotto group
    //
    var fillSpecials = [true, 'none', 'color'],

        colorPlugin = {

        defaults: {
            scale: d3.scale.category10().range(),
            darkerColor: 0,
            brighterColor: 0,
            colorIndex: 0
        },

        init: function (self) {
            var opts = self.options().colors;

            // pick a color
            self.pickColor = function (index) {
                if (arguments.length === 0)
                    index = opts.colorIndex++;
                var dk = 0, bk = 0;
                while (index >= opts.scale.length) {
                    index -= opts.scale.length;
                    dk += opts.darkerColor;
                    bk += opts.brighterColor;
                }
                var c = opts.scale[index];
                if (dk)
                    c = d3.rgb(c).darker(dk).toString();
                else if (bk)
                    c = d3.rgb(c).brighter(bk).toString();
                return c;
            };

            //
            // Select a suitable color for a draw element
            self.drawColor = function (opts) {
                if (!opts.color)
                    if (opts.fill && fillSpecials.indexOf(opts.fill) === -1)
                        opts.color = d3.rgb(opts.fill).darker().toString();
                    else
                        opts.color = self.pickColor();

                if (opts.fill === true)
                    opts.fill = d3.rgb(opts.color).brighter().toString();
                else if (opts.fill === 'color')
                    opts.fill = opts.color;

                return opts.color;
            };
        },

        options: function (opts) {
            var colors = extend({}, this.defaults, opts.colors);
            if (isFunction (colors.scale)) colors.scale = colors.scale(d3);
            opts.colors = colors;
        }

    };

    g.paper.plugin('colors', colorPlugin);
    g.viz.plugin('colors', colorPlugin);
