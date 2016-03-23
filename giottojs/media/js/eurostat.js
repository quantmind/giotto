require([
    'js/require.config',
    'giotto'], function (lux, d3) {


    d3.data.addProvider('eurostat', eurostat);

    var baseUrl = 'http://ec.europa.eu/eurostat/wdds/rest/data/v2.1/json/en/';

    function eurostat(expr, opts) {
        var self = this,
            url = baseUrl + expr + '?',
            clean = opts.clean;

        delete opts.clean;

        d3.quant.forEach(opts, function (value, key) {
            if (key !== 'eurostat') {
                if (!d3.quant.isArray(value)) value = [value];
                value.forEach(function (v) {
                    if (url[url.length - 1] != '?') url += '&';
                    url += key + '=' + v;
                });
            }
        });

        d3.request.json(url, function (error, data) {
            if (error)
                throw new Error(error);
            var serie = d3.quant.jsonStat(data, {crossfilter: true, clean: clean});

            self.ready(serie.data(), expr, opts);
        });
    }

});
