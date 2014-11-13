
    g.Trianglify = Viz.extend({
        //
        defaults: {
            bleed: 150,
            fillOpacity: 1,
            strokeOpacity: 1,
            noiseIntensity: 0,
            gradient: null,
            x_gradient: null,
            y_gradient: null
        },
        //
        d3build: function () {
            //
            if (this.Trianglify === undefined && typeof Trianglify === 'undefined') {
                var self = this;
                return g.require(['trianglify'], function (Trianglify) {
                    self.Trianglify = Trianglify || null;
                    self.d3build();
                });
            }

            if (this.Trianglify === undefined)
                this.Trianglify = Trianglify;

            var t = this._t,
                attrs = this.attrs,
                cellsize = attrs.cellsize ? +attrs.cellsize : 0,
                cellpadding = attrs.cellpadding ? +attrs.cellpadding : 0,
                fillOpacity = attrs.fillOpacity ? +attrs.fillOpacity : 1,
                strokeOpacity = attrs.strokeOpacity ? +attrs.strokeOpacity : 1,
                noiseIntensity = attrs.noiseIntensity ? +attrs.noiseIntensity : 0,
                gradient = this.gradient(attrs.gradient),
                x_gradient = this.gradient(attrs.x_gradient) || gradient,
                y_gradient = this.gradient(attrs.y_gradient) || gradient;

            if (!this._t)
                this._t = t = new Trianglify();

            t.options.fillOpacity = Math.min(1, Math.max(fillOpacity, 0));
            t.options.strokeOpacity = Math.min(1, Math.max(strokeOpacity, 0));
            t.options.noiseIntensity = Math.min(1, Math.max(noiseIntensity, 0));
            if (x_gradient)
                t.options.x_gradient = x_gradient;
            if (y_gradient)
                t.options.y_gradient = y_gradient;
            if (cellsize > 0) {
                t.options.cellsize = cellsize;
                t.options.bleed = +attrs.bleed;
            }
            var pattern = t.generate(this.attrs.width, this.attrs.height),
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
            element.style("min-height", "100%")
                   //.style("height", this.attrs.height+"px")
                   //.style("width", this.attrs.width+"px")
                   .style("background-image", pattern.dataUrl);
        },
        //
        gradient: function (value) {
            if (value && typeof(value) === 'string') {
                var bits = value.split('-');
                if (bits.length === 2) {
                    var palette = Trianglify.colorbrewer[bits[0]],
                        num = +bits[1];
                    if (palette) {
                        return palette[num];
                    }
                }
            }
        }
    });