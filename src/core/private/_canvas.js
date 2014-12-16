
    function canvas_implementation (p) {
        var _ = {};

        _.clear = function (group, size) {
            var factor = group.factor(),
                ctx = group.context();
            if (!size) size = p.size;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect (0 , 0, factor*size[0], factor*size[1]);
            return factor;
        };

        _.resize = function (group, size) {
            var oldsize = p.size;
            p.size = size;
            _clearCanvas(oldsize);
            _scaleCanvas();
            group.render();
        };

        _.point = canvasPoint;

        _.axis = canvasAxis;

        _.path = canvasPath;

        _.points = function (group) {
            return drawing(group, function () {
                this.each(function () {
                    this.render();
                });
            });
        };

        _.barchart = _.points;

        _.pie = _.points;

        // Download
        _.image = function () {
            var canvas = _addCanvas().node(),
                context = paper.current(),
                img;

            _apply(function (ctx) {
                if (ctx !== context) {
                    img = new Image();
                    img.src = ctx.canvas.toDataURL();
                    context.drawImage(img, 0, 0, p.size[0], p.size[1]);
                }
            });
            var dataUrl = canvas.toDataURL();
            paper.removeCanvas(canvas);
            return dataUrl;
        };

        return _;
    }
