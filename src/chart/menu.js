
    g.chartContextMenu = function (chart) {

        var menu = [];
        chart.options().menu.items = menu;

        menu.push({
            label: 'Open Image',
            callback: function (chart) {
                    window.open(chart.image());
            }
        },
        {
            label: function () {
                if (chart.paper().type() === 'svg')
                    return 'Redraw as Canvas';
                else
                    return 'Redraw as SVG';
            },
            callback: function () {
                var type = 'svg';
                if (chart.paper().type() === 'svg')
                    type = 'canvas';
                chart.options().type = type;
                chart.resume();
            }
        });
    };