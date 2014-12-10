
    gexamples.sunburst1 = {
        height: '80%',

        src: "https://gist.githubusercontent.com/lsbardel/f3d21f35a685a96706bf/raw",

        addorder: true,

        margin: {top: 40, left:20, right: 20, bottom: 40},

        angular: function (chart, opts) {
            opts.scope.$on('formFieldChange', function (e, o, value) {
                if (o && o.field === 'scale')
                    viz.scale(o.form.scale);
            });
        }
    };
