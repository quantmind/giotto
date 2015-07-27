    var eurozone = ['Austria', 'Belgium', 'Cyprus', 'Estonia', 'Finland',
                    'France', 'Germany', 'Greece', 'Ireland', 'Italy', 'Latvia',
                    'Lithuania', 'Luxembourg', 'Malta', 'Netherlands',
                    'Portugal', 'Slovakia', 'Slovenia', 'Spain'],
        eucolor = '#225ea8',
        noneucolor = '#993404',
        barcolor = function (d) {
            return eurozone.indexOf(d.x) === -1 ? noneucolor : eucolor;
        };

    gexamples.education = {
        height: '60%',
        min_height: 250,
        margin: {left: 40, right: 20, top: 20, bottom: 120},

        bar: {
            show: true,
            formatY: '.1%',
            fill: barcolor,
            color: function (d) {return d3.rgb(barcolor(d)).darker();}
        },

        // Display x-axis labels at 65 degrees angle
        xaxis: {
            textAnchor: 'end',
            textRotate: -65,
            dx: '-0.8em',
            dy: '-0.2em'
        },

        yaxis: {
            min: 0,
            tickFormat: '%'
        },

        tooltip: true,

        legend: {
            show: true,
            position: 'bottom',
            margin: 0
        },

        data: {
            loader: function () {
                return d3.dsv(';', 'text/csv');
            },
            // Data pre-processor
            process: function (data) {
                var jd = {}, all = [], name, c, value;
                data.forEach(function (d) {
                    name = d.GEO[0].toUpperCase() + d.GEO.slice(1).toLowerCase();
                    c = jd[name];
                    if (!c) jd[name] = c = {country: name};
                    value = +d.Value;
                    if (isNaN(value))
                        value = 0;
                    c[+d.TIME] = 0.01*value;
                });
                d3.giotto._.forEach(jd, function (value) {
                    all.push(value);
                });
                data = d3.giotto.multi().data(all.sort(function (a, b) {
                    return d3.descending(a[2013], b[2013]);
                })).x('country');

                return [{
                    label: 'tertiary education',
                    legend: [{
                        label: 'Eurozone',
                        fill: eucolor,
                        color: d3.rgb(eucolor).darker()
                    },
                    {
                        label: 'Non Eurozone',
                        fill: noneucolor,
                        color: d3.rgb(noneucolor).darker()
                    }],
                    data: data.serie().y(2013)
                }];
            }
        }
    };
