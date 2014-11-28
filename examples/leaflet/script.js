    examples.leaflet1 = {

        tile: 'leaflet',

        center: [32, 103.14],

        wheelZoom: false,

        onInit: function (viz) {
            var http = 'http://{s}.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={token}',
                MB_ATTR = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                          '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                          'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                opts = viz.options();

            viz.on('tick.main', function () {
                //
                // Add layer to the map
                viz.stop().addLayer(http, {
                    attribution: MB_ATTR,
                    id: 'lsbardel.jlpfdli1',
                    token: 'pk.eyJ1IjoibHNiYXJkZWwiLCJhIjoidHltTnFxRSJ9.Mx5To8eaHJjq8OS6usKV8g'
                });

                if (opts.src) {

                    g.require(['topojson'], function (topojson) {

                        d3.json(opts.src, function(topology) {
                            var collection = topojson.feature(topology, topology.objects.china_adm1),
                                layer = viz.addLayer(collection, onDraw),
                                feature = layer.element.attr("class", "china-wine").selectAll("path")
                                                .data(collection.features)
                                                .enter().append("path")
                                                .on('click', function (d) {
                                                    var hash = d.properties.name,
                                                        scope = viz.attrs.scope;
                                                    if (scope && scope.$location) {
                                                        scope.$location.hash(lux.slugify(hash));
                                                        scope.$apply();
                                                    }
                                                }),
                                text = layer.element.selectAll("text")
                                            .data(collection.features)
                                            .enter()
                                            .append("svg:text")
                                            .text(function (d) {
                                                return d.properties.name;
                                            })
                                            .attr("text-anchor","middle")
                                            .attr('font-size','6pt');
                            layer.draw();

                            function onDraw (svgLayer) {
                                feature.attr("d", svgLayer.path);
                                text.attr("x", function(d) {
                                    return layer.path.centroid(d)[0];
                                }).attr("y", function(d) {
                                    return layer.path.centroid(d)[1];
                                });
                            }
                        });
                    });
                }
            });
        }
    };
