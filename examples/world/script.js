
    gexamples.world = {
        src: '/data/population.csv',

        // data loader
        loader: function (src, callback) {
            return d3.dsv(';', 'text/csv')(src, function (error, data) {
                if (!error) {
                    callback(d3.giotto.data.multi(data));
                } else
                    callback(error, data);
            });
        },

        onInit: function (container) {
            container.scope().year = 2013;
        },

        // Initialise slider
        slider: {
            axis: true,
            min: 1960,
            max: 2013,
            step: 1,
            onInit: function (slider) {
                var scope = slider.scope();
                scope.year = slider.value(scope.year).value();
                slider.on('slide', function (e, value) {
                    scope.year = value;
                    scope.$apply();
                }).on('slideend', function (e, value) {
                    scope.$emit('yearchange', value);
                });
            }
        },

        // World map
        world: {
            tooltip: {
                show: true
            },
            colors: {
                scale: function (d3) {return d3.colorbrewer.YlGnBu[9];}
            },
            margin: 0,
            height: '60%',
            zoom: true,
            grid: {
                show: true
            },
            // Listen for yearchange event
            onInit: function (chart) {
                var scope = chart.scope();
                scope.$on('yearchange', function (e, value) {
                    var data = map_data(scope.giottoCollection.data(), value);
                    chart.each(function (serie) {
                        serie.data(data);
                    }).resume();
                });
            },
            processData: function (multi) {
                return [map_data(multi, this.scope().year)];
            },
            map: {
                show: true,
                scale: 0.6,
                grid: true,
                projection: 'kavrayskiy7',
                active: {
                    fill: '#993404'
                },
                transition: {
                    duration: 500
                },
                // load features
                features: function (callback) {
                    require(['topojson'], function (topojson) {
                        d3.json('/data/world-110m.json', function (topology) {
                            var countries = topojson.feature(topology, topology.objects.countries);

                            callback([{
                                object: {type: "Sphere"},
                                name: 'sea',
                                fill: '#c6dbef'
                            },
                            d3.giotto.data.geo(countries.features).scale(d3.scale.log())]);
                        });
                    });
                }
            }
        },

        timeserie: {
            line: {show: true},
            point: {show: true},
            processData: function (multi) {
                return [[]];
            },
            onInit: function (chart) {
                //var map = chart.scope().container.map;
            }
        }
    };

    function map_data (multi, year) {
        return multi.map('code', function (d) {
            var value = d[year];
            if (value)
                return {
                    code: d['Country Code'],
                    label: d['Country Name'],
                    value: value
                };
            else
                return {};
        });
    }