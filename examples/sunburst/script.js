    examples.sunburst = function (viz) {
        var scope = viz.options().scope;
        scope.$on('formFieldChange', function (e, o, value) {
            if (o && o.field === 'scale')
                viz.scale(o.form.scale);
        });
    };
