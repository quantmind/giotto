
    gexamples.bitcoin1 = {
        height: '60%',
        margin: 60,
        fill: '#000',
        font: {
            color: '#fff'
        },
        src: 'http://www.quandl.com/api/v1/datasets/BAVERAGE/USD.json?auth_token=-kdL9rjDHgBsx1VcDkrC&rows=' + 365,

        yaxis: {
            min: 0,
        },

        xaxis: {
            type: 'time'
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

                },
                {
                    label: 'Volume',
                    yaxis: 2,
                    data: volume
                }];
        }
    };
