
gexamples.trianglify = {

    onInit: function (viz, opts) {

        luxforms.redraw = function (e) {
            e.preventDefault();
            angular.extend(viz.options(), this.trianglify);
            viz.resume();
        };
    }
};
