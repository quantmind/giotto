
    gexamples.world = {
        src: '/data/population.csv',

        // data loader
        loader: function (src, callback) {
            return d3.dsv(';', 'text/csv')(src, function (error, data) {
                if (!error) {
                    var gt = d3.giotto;
                    data = gt.data.multi(gt.data.fromcsv(data));
                }
                callback(error, data);
            });
        },

        world: {
            margin: 0,
            processData: function (data) {
                return [data.serie().x('Country').y(2013)];
            },
            map: {
                show: true,
                features: function (callback) {
                    d3.giotto.require(['topojson'], function (topojson) {
                        d3.json('/data/world-topo.json', function (topology) {
                            countries = topojson.feature(worldtopo, worldtopo.objects.countries);
                            callback({countries: countries});
                        });
                    });
                }
            }
        },

        timeserie: {
            line: {show: true},
            point: {show: true}
        }
    };