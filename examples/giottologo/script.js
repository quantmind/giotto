    var logo = [['Italy', 42772],
                ['France', 50764],
                ['Spain', 33397],
                ['USA', 19187],
                ['Argentina', 15473],
                ['China', 13200],
                ['Australia', 11180],
                ['Chile', 10463],
                ['Germany', 9132],
                ['South Africa', 9725],
                ['Portugal', 5610],
                ['New Zealand', 2350],
                ['Rest of World', 63776]];

    gexamples.giottologo1 = {
        width: 500,
        height: 500,

        // Some defaults for all pies
        pie: {
            padAngle: 2,
            cornerRadius: 0.02,
            fillOpacity: 1,
            x: function (d) {return d.label;},
            y: function (d) {return d.value;}
        },

        data: function () {
            var width = 500,
                dangle = 10,
                margin = 0.05,
                angle = 0,
                inner = 0.9,
                innerpad = 0.05,
                dinnerpad = 0.005,
                series = [],
                logodata = [],
                colors = ['#005AAA', '#0091E8', '#BB7200', '#F2A605', '#F2E905'];

            logo.forEach(function (d, i) {
                while (i >= colors.length) i-= colors.length;
                logodata.push({label: d[0], value: d[1], fill: colors[i]});
            });

            while (margin < 0.97) {
                series.push({
                    data: logodata,
                    pie: {
                        startAngle: angle,
                        innerRadius: inner
                    },
                    margin: m(0.5*margin*width)
                });
                angle += dangle;
                margin = 1 - (1-margin)*(inner - innerpad);
                innerpad += dinnerpad;
            }
            return series;

            function m (n) {
                return {left: n, right: n, top: n, bottom: n};
            }
        },

        // Callback for angular directive
        angular: function (chart, opts) {

            opts.scope.$on('formFieldChange', function (e, form) {
                opts.type = form.type;
                chart.resume();
            });
        }
    };