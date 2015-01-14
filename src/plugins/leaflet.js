
    g.geo.leaflet = function (element, opts) {

        if (typeof L === 'undefined') {
            g._.loadCss(g.constants.leaflet);
            g.require(['leaflet'], function () {
                viz.start();
            });
        } else {
            var map = new L.map(element, {
                center: opts.center,
                zoom: opts.zoom
            });
            if (opts.zoomControl) {
                if (!opts.wheelZoom)
                    map.scrollWheelZoom.disable();
            } else {
                map.dragging.disable();
                map.touchZoom.disable();
                map.doubleClickZoom.disable();
                map.scrollWheelZoom.disable();

                // Disable tap handler, if present.
                if (map.tap) map.tap.disable();
            }

            // Attach the view reset callback
            map.on("viewreset", function () {
                for (var i=0; i<callbacks.length; ++i)
                    callbacks[i]();
            });

            viz.resume();
        }
        d3.geo.transform({point: LeafletProjectPoint});

        function LeafletProjectPoint (x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }
    };
