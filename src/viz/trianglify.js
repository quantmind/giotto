
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
                element = this.element.select('.trianglify-background');
            if (!element.node()) {
                var parentNode = this.element.node(),
                    node = document.createElement('div'),
                    inner = parentNode.childNodes;
                while (inner.length) {
                    node.appendChild(inner[0]);
                }
                node.className = 'trianglify-background';
                parentNode.appendChild(node);
                element = this.element.select('.trianglify-background');
            }
            element.style("height", this.attrs.height+"px")
                   .style("width", this.attrs.width+"px")
                   .style("background-image", pattern.dataUrl);
        }
    });