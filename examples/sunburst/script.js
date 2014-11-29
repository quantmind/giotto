    examples.sunburst = {
        src: "https://gist.githubusercontent.com/lsbardel/f3d21f35a685a96706bf/raw",
        height: '70%',
        addorder: true,
        padding: 60,
        onInit: function (viz) {
            var scope = viz.options().scope;
            scope.$on('formFieldChange', function (e, o, value) {
                if (o && o.field === 'scale')
                    viz.scale(o.form.scale);
            });
        }
    };
