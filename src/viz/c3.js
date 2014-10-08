
    d3ext.C3 = Viz.extend({
        c3opts: ['data', 'axis', 'grid', 'region', 'legend', 'tooltip',
                 'subchart', 'zoom', 'point', 'line', 'bar', 'pie', 'donut'],
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
                        width: opts.width,
                        height: opts.height
                    }
                };
            self.c3opts.forEach(function (name) {
                if (opts[name])
                    config[name] = opts[name];
            });
            var chart = this.c3.generate(config);
        }
    });
