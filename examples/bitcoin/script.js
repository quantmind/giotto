
    gexamples.bitcoin1 = {
        height: '60%',
        margin: 60,
        fill: '#000',
        src: 'http://www.quandl.com/api/v1/datasets/BAVERAGE/USD.json?auth_token=-kdL9rjDHgBsx1VcDkrC&rows=' + 365,
        tooltip: true,
        grid: true,
        yaxis: {
            min: 0,
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

        onInit: function (chart) {
            var opts = chart.options(),
                color = '#999';
            opts.font.color = color;
            opts.xaxis.color = color;
            opts.xaxis.font.color = color;
            opts.yaxis.color = color;
            opts.yaxis.font.color = color;
            opts.grid.color = color;
        },

        processData: function (raw) {
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
    };
