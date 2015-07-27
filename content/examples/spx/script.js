
gexamples.spx = {
    height: '60%',
    margin: 60,
    fill: '#000',

    data: {
        src: function () {
            return d3.giotto.quandl.url('YAHOO/INDEX_GSPC');
        },
        process: function (raw) {
            var price = [],
                volume = [],
                dt;
            raw.data.forEach(function (row) {
                dt = new Date(row[0]);
                price.push([dt, row[1]]);
                volume.push([dt, row[5]]);
            });
            return [
                {
                    label: 'Average Price',
                    data: price,

                }];
                //,
                //{
                //    label: 'Volume',
                //    yaxis: 2,
                //    data: volume
                //}];
        }
    },

    tooltip: true,
    grid: true,
    yaxis: {
        min: 0,
        scale: 'log'
    },
    xaxis: {
        scale: 'time'
    },
    line: {
        area: true,
        gradient: '#000',
        fillOpacity: 0.8,
        active: {
            fillOpacity: 1,
            symbol: 'circle',
            size: '10px'
        }
    },
};
