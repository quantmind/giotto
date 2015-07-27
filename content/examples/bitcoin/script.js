
    gexamples.bitcoin1 = {
        height: '60%',
        margin: 60,
        fill: '#000',
        data: {
            src: function () {
                return d3.giotto.quandl.url('BAVERAGE/USD.json', {rows: 365});
            },
            process: function (raw) {
                raw.data.forEach(function (row) {
                    row[0] = new Date(row[0]);
                });
                data = d3.giotto.data.multi().data(raw.data);

                return [
                    {
                        label: 'Average Price',
                        data: data.serie().y(1),
                    }];
                    //,
                    //{
                    //    label: 'Volume',
                    //    yaxis: 2,
                    //    data: data.serie().y(5),
                    //}];
            }
        },
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
        }
    };
