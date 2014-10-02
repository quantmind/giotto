
    d3ext.C3 = Viz.extend({
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
            var config = extend({
                    bindto: this.element[0]
                },
                this.attrs.data),
                chart = this.c3.generate(config);
        }
    });
