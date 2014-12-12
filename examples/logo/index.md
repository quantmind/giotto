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

    gexamples.glogo = {
        height: '100%',

        data: [{pie: logo}],

        // Rightclick menu
        contextmenu: [{
            label: 'Open Image',
            callback: function (chart) {
                window.open(chart.image());
            }
        }]
    };