
    d3.canvas.retinaScale = function(ctx, width, height){
        ctx.canvas.width = width;
        ctx.canvas.height = height;

        if (window.devicePixelRatio) {
            ctx.canvas.style.width = width + "px";
            ctx.canvas.style.height = height + "px";
            ctx.canvas.width = width * window.devicePixelRatio;
            ctx.canvas.height = height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
        return window.devicePixelRatio || 1;
    };