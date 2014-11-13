    d3ext.Leaflet = Viz.extend({
        //
        defaults: {
            center: [41.898582, 12.476801],
            zoom: 4,
            maxZoom: 18,
            zoomControl: true,
            wheelZoom: true,
        },
        getAttributes: function (attrs) {
            // switch off resizing, handled by leflet
            attrs.resize = false;
            return attrs;
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
                var opts = this.attrs,
                    map = this.map = new L.map(e, {
                        center: o.center,
                        zoom: o.zoom
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

                if (o.buildMap)
                    o.buildMap.call(this);
            }
        },
        //
        addLayer: function (url, options) {
            if (this.map)
                L.tileLayer(url, options).addTo(this.map);
        },
        //
        addSvgLayer: function (collection, draw) {
            var transform = d3.geo.transform({point: ProjectPoint}),
                path = d3.geo.path().projection(transform),
                map = this.map,
                svg = map ? d3.select(map.getPanes().overlayPane).append("svg") : null,
                g = svg ? svg.append("g").attr("class", "leaflet-zoom-hide") : null;

            // Use Leaflet to implement a D3 geometric transformation.
            function ProjectPoint (x, y) {
                var point = map.latLngToLayerPoint(new L.LatLng(y, x));
                this.stream.point(point.x, point.y);
            }
            //
            // Reposition the SVG to cover the features.
            function reset () {
                var bounds = path.bounds(collection),
                    topLeft = bounds[0],
                    bottomRight = bounds[1];

                svg.attr("width", bottomRight[0] - topLeft[0])
                    .attr("height", bottomRight[1] - topLeft[1])
                    .style("left", topLeft[0] + "px")
                    .style("top", topLeft[1] + "px");

                g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

                if (draw)
                    draw(path);
            }
            //
            if (map) {
                var svgLayer = {
                    svg: svg,
                    g: g,
                    collection: collection,
                    path: path,
                    draw: function () {
                        var bounds = path.bounds(collection),
                            topLeft = bounds[0],
                            bottomRight = bounds[1];

                        svg.attr("width", bottomRight[0] - topLeft[0])
                            .attr("height", bottomRight[1] - topLeft[1])
                            .style("left", topLeft[0] + "px")
                            .style("top", topLeft[1] + "px");

                        g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

                        if (draw)
                            draw(svgLayer);
                    }
                };
                map.on("viewreset", svgLayer.draw);
                return svgLayer;
            }
        }
    });
