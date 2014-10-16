
    d3ext.trianglify = Viz.extend({
        //
        defaults: {
            center: [41.898582, 12.476801],
            zoom: 4,
            maxZoom: 18
        },
        //
        d3build: function () {
            if (!this.Trianglify) {
                var self = this;
                require(['trianglify'], function (Trianglify) {
                    self.Trianglify = Trianglify;
                    self.d3build();
                });
                return;
            }
            if (!this._t)
                this._t = new this.Trianglify();
            var pattern = this._t.generate(this.attrs.width, this.attrs.height),
                element = this.element.html('').append('div');
            element.style("height", this.attrs.height+"px")
                   .style("width", this.attrs.width+"px")
                   .style("background-image", pattern.dataUrl);
        }
    });