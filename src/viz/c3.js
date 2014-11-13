
    g.C3 = Viz.extend({
        c3opts: ['data', 'axis', 'grid', 'region', 'legend', 'tooltip',
                 'subchart', 'zoom', 'point', 'line', 'bar', 'pie', 'donut'],
        //
        init: function (element, attrs) {
            // make sure resize is false, let c3 do the resizing
            if (!attrs && Object(element) === element) {
                attrs = element;
                element = null;
            }
            if (attrs)
                attrs.resize = false;
            this._super(element, attrs);
        },
        //
        d3build: function () {
            var self = this,
                opts = this.attrs;
            if (!this.c3) {
                return require(['c3'], function (c3) {
                    self.c3 = c3;
                    self.d3build();
                });
            }
            //
            //
            // Load data if not already available
            if (!opts.data) {
                return this.loadData(function () {
                    self.d3build();
                });
            }
            //
            var config = {
                    bindto: this.element.node(),
                    size: {
                        width: this.elwidth ? null : opts.width,
                        height: this.elheight ? null : opts.height
                    }
                };
            self.c3opts.forEach(function (name) {
                if (opts[name])
                    config[name] = opts[name];
            });
            var chart = this.c3.generate(config);
        }
    });
