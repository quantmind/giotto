
    examples.bitcoin1 = {
        src: 'http://www.quandl.com/api/v1/datasets/BAVERAGE/USD.json?auth_token=-kdL9rjDHgBsx1VcDkrC&rows=' + 365*years,
        processData: function (raw) {
            var cols = d3.transpose(raw.data);
                dates = cols[0],
                price = cols[1],
                volume = cols[2];
            dates.splice(0, 0, 'dates');
            price.splice(0, 0, 'price');
            volume.splice(0, 0, 'volume');
            return {
                data: {
                    x: 'dates',
                    axes: {
                        price: 'y',
                        volume: 'y2'
                    },
                    columns: [dates, price, volume],
                    types: {
                        price: 'area-spline',
                    }
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick : {
                            format : "%e %b %y"
                        }
                    },
                    y2: {
                        show: true
                    }
                }
            };
        }
    };
