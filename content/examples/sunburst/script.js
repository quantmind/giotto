
gexamples.sunburst1 = {
    height: '80%',

    data: "https://gist.githubusercontent.com/lsbardel/f3d21f35a685a96706bf/raw",

    addorder: true,

    margin: {top: 40, left:20, right: 20, bottom: 40},

    colors: function (d3) {return d3.scale.category20().range();},

    angular: function (viz) {
        viz.scope().$on('formFieldChange', function (e, o) {
            if (o.scale)
                viz.scale(o.scale).resume();
        });
    }
};
