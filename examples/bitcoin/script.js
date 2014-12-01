
    examples.bitcoin1 = {

        xaxis: {
            type: 'time'
        },

        data: function (chart) {
            var src = 'http://www.quandl.com/api/v1/datasets/BAVERAGE/USD.json?auth_token=-kdL9rjDHgBsx1VcDkrC&rows=' + 365;
            d3.json(src, function (raw) {
                d3.giotto.crossfilter({
                    raw: raw,
                    data: raw.data,
                    labels: raw.column_names,
                    callback: function (cf) {
                        chart.setData(cf);
                    }
                });
            });
        }
    };
