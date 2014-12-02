
    gexamples.trianglify = {

        height: '60%',

        onInit: function (viz) {

            luxforms.redraw = function (e) {
                e.preventDefault();
                if (this.form.$valid)
                    viz.redraw(this.trianglify);
            };
        }
    };
