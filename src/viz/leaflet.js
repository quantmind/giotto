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
                e = this.element[0];
            require('leaflet', function () {
                this.map = new L.Map(e, {
                    center: o.center,
                    zoom: o.zoom
                });
                if (o.buildMap)
                    o.buildMap.call(this);
            });
        },
        //
        addLayer: function (url, options) {
            if (this.map)
                L.tileLayer(url, options).addTo(this.map);
        }
    });
