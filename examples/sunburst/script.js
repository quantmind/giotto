
    gexamples.sunburst = {
        src: "https://gist.githubusercontent.com/lsbardel/f3d21f35a685a96706bf/raw",

        height: '70%',

        addorder: true,

        margin: {top: 40, left:30, right: 30, bottom: 40},

        onInit: function (viz) {
            var scope = viz.options().scope;
            scope.$on('formFieldChange', function (e, o, value) {
                if (o && o.field === 'scale')
                    viz.scale(o.form.scale);
            });
        }
    };
