
gexamples.slider2 = {
    min: 2000,
    max: 2100,
    step: 10,
    axis: true
};

gexamples.slider3 = {
    axis: true,
    step: 5,
    onInit: function (slider) {
        var scope = slider.scope();
        scope.slider3 = slider.value();
        slider.on('slide', function (e, value) {
            slider.scope().slider3 = value;
            scope.$apply();
        });
    }
};

gexamples.slider11 = {
    orientation: 'vertical'
};
gexamples.slider12 = {
    orientation: 'vertical',
    min: 2000,
    max: 2100,
    step: 10,
    axis: true
};