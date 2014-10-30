    d3ext.Leaflet = Viz.extend({
        //
        defaults: {
            center: [41.898582, 12.476801],
            zoom: 4,
            maxZoom: 18
        },
        //
        d3build: function () {
            var o = this.attrs,
                e = this.element.node();
            if (typeof L === 'undefined') {
                var self = this;
                require(['leaflet'], function () {
                    self.d3build();
                });
            } else {
                this.map = new L.map(e, {
                    center: o.center,
                    zoom: o.zoom
                });
                if (o.buildMap)
                    o.buildMap.call(this);
            }
        },
        //
        addLayer: function (url, options) {
            if (this.map)
                L.tileLayer(url, options).addTo(this.map);
        }
    });
