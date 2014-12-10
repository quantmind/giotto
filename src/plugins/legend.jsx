    var legendDefaults = {
        template: ["<ul class=\"<%=name.toLowerCase()%>-legend\">",
                   "<% for (var i=0; i<datasets.length; i++){%>",
                   "<li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span>",
                   "<%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"].join('')
    };
    //
    //  Add legend functionality to an svg paper
    g.paper.svg.plugin('legend', legendDefaults,

    function (paper, opts) {

        legend: function (data) {
            return g.template(opts.legend.template, this);
    });

    //
    //  Add legend functionality to an canvas paper
    g.paper.canvas.plugin('legend', legendDefaults,

    function (paper, opts) {
    });
