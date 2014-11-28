//
//  Script for giotto website
//  =============================
require(rcfg.min(['lux/lux', 'giotto/giotto', 'angular-ui-router', 'angular-strap']), function (lux, d3) {

    var url = lux.context.url,
        sitemap = function () {
        var s = ['sunburst',
                 'force',
                 {href: 'charts', label: 'Charting'},
                 {href: 'giotto', label: 'Logo'},
                 {href: 'c3', label: 'time series'},
                 'trianglify'],
            all = [];
        //
        s.forEach(function (v) {
            if (typeof(v) === 'string')
                v = {href: v, label: v};
            v.href = url + '/examples/' + v.href;
            all.push(v);
        });
        return all;
    };
    //
    lux.extend({
        navbar: {
            brand: 'Giotto',
            theme: 'default',
            top: true,
            target: '_self',
            itemsRight: [
                {
                    href: url + '/examples/',
                    icon: 'fa fa-bar-chart',
                    label: 'examples'
                },
                {
                    href: url + '/api/',
                    icon: 'fa fa-cogs',
                    label: 'api'
                },
                {
                    href: 'https://github.com/quantmind/giotto',
                    icon: 'fa fa-github'
                }
            ],
            items2: sitemap()
        }
    });
    //
    var examples = this.examples = {},
        g = d3.giotto;


    examples.sunburst = function (viz) {
        var scope = viz.options().scope;
        scope.$on('formFieldChange', function (e, o, value) {
            if (o && o.field === 'scale')
                viz.scale(o.form.scale);
        });
    };

    examples.force1 = function (force) {
        var opts = force.options(),
            root = {fixed: true, radius: 0},
            paper = force.paper(),
            charge = force.charge();

        force.addNode(root);

        force.charge(function (d) {
            return d.fixed ? charge : 0;
        }).drawCircles();

        paper.current().on("mousemove", function() {
            var p1 = d3.mouse(this);
            root.px = paper.xAxis().scale().invert(p1[0]);
            root.py = paper.yAxis().scale().invert(p1[1]);
            force.resume();
        }).on("touchmove", function() {
            var p1 = d3.touches(this);
            root.px = paper.xAxis().scale().invert(p1[0]);
            root.py = paper.yAxis().scale().invert(p1[1]);
            force.resume();
        });

        force.on("tick", function(e) {
            paper.current().selectAll("circle")
                .attr("cx", function (d) { return paper.scalex(d.x); })
                .attr("cy", function (d) { return paper.scaley(d.y); });
        });
    };

    examples.sigmoid = function () {

        var X = d3.range(-2, 2, 0.1);

        return {
            data: [
                d3.giotto.xyfunction(X, function (x) {
                    return 1/(1+Math.exp(-x));
                }),
                d3.giotto.xyfunction(X, function (x) {
                    return x*x;
                })
            ]
        };
    };


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

    d3.giotto.angular.addAll(angular);

    lux.bootstrap('giottoExamples', ['lux.nav', 'giotto']);
});