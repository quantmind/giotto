
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

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0 , 0, ctx.canvas.width, ctx.canvas.height);
        return window.devicePixelRatio || 1;
    };


    d3.canvas.resize = function (ctx, width, height) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect (0 , 0, ctx.canvas.width, ctx.canvas.height);
        return d3.canvas.retinaScale(ctx, width, height);
    };


    d3.canvas.drawPolygon = function (ctx, pts, radius) {
        if (radius > 0)
            pts = getRoundedPoints(pts, radius);
        var i, pt, len = pts.length;
        ctx.beginPath();
        for (i = 0; i < len; i++) {
            pt = pts[i];
            if (i === 0)
                ctx.moveTo(pt[0], pt[1]);
            else
                ctx.lineTo(pt[0], pt[1]);
            if (radius > 0)
                ctx.quadraticCurveTo(pt[2], pt[3], pt[4], pt[5]);
        }
        ctx.closePath();
    };

    d3.canvas.rgba = function (color, opacity) {
        if (opacity < 1) {
            var c = d3.rgb(color);
            return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + opacity + ')';
        } else
            return color;
    };

    function getRoundedPoints(pts, radius) {
        var i1, i2, i3, p1, p2, p3, prevPt, nextPt,
            len = pts.length,
            res = new Array(len);
        for (i2 = 0; i2 < len; i2++) {
            i1 = i2-1;
            i3 = i2+1;
            if (i1 < 0)
                i1 = len - 1;
            if (i3 === len) i3 = 0;
            p1 = pts[i1];
            p2 = pts[i2];
            p3 = pts[i3];
            prevPt = getRoundedPoint(p1[0], p1[1], p2[0], p2[1], radius, false);
            nextPt = getRoundedPoint(p2[0], p2[1], p3[0], p3[1], radius, true);
            res[i2] = [prevPt[0], prevPt[1], p2[0], p2[1], nextPt[0], nextPt[1]];
        }
      return res;
    }

    function getRoundedPoint(x1, y1, x2, y2, radius, first) {
        var total = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
            idx = first ? radius / total : (total - radius) / total;
        return [x1 + (idx * (x2 - x1)), y1 + (idx * (y2 - y1))];
    }
