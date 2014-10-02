
    d3ext.C3 = Viz.extend({
        //
        d3build: function () {
            var self = this;
            if (!this.c3) {
                return require(['c3'], function (c3) {
                    self.c3 = c3;
                    self.d3build();
                });
            }
            //
            //
            // Load data if not already available
            if (!this.attrs.data) {
                return this.loadData(function () {
                    self.d3build();
                });
            }
            //
            var series = this.attrs.data;
            if (series.series) series = series.series;
            var options = extend({
                bindto: this.element[0],
                data: {
                    x: series[0][0],
                    columns: series
                }
            }, this.attrs.c3);
            var chart = this.c3.generate(options);
        }
    });
