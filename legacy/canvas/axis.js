
    // same as d3.svg.axis... but for canvas
    d3.canvas.axis = function() {
        var scale = d3.scale.linear(),
            orient = d3_canvas_axisDefaultOrient,
            innerTickSize = 6,
            outerTickSize = 6,
            tickPadding = 3,
            tickArguments_ = [10],
            tickValues = null,
            tickFormat_ = null,
            textRotate = 0,
            textAlign = null;

        function axis (canvas) {
            canvas.each(function() {
                var ctx = this.getContext('2d'),
                    scale0 = this.__chart__ || scale,
                    scale1 = this.__chart__ = scale.copy();

                // Ticks, or domain values for ordinal scales.
                var ticks = tickValues === null ? (scale1.ticks ? scale1.ticks.apply(scale1, tickArguments_) : scale1.domain()) : tickValues,
                    tickFormat = tickFormat_ === null ? (scale1.tickFormat ? scale1.tickFormat.apply(scale1, tickArguments_) : d3_identity) : tickFormat_,
                    tickSpacing = Math.max(innerTickSize, 0) + tickPadding,
                    sign = orient === "top" || orient === "left" ? -1 : 1,
                    tickTransform,
                    trange;

                // Domain.
                var range = d3_scaleRange(scale1);

                if (scale1.rangeBand) {
                    var x = scale1, dx = x.rangeBand()/2;
                    scale0 = scale1 = function (d) { return x(d) + dx; };
                } else if (scale0.rangeBand) {
                    scale0 = scale1;
                }

                // Apply axis labels on major ticks
                if (orient === "bottom" || orient === "top") {
                    ctx.textBaseline = sign < 0 ? 'bottom' : 'top';
                    ctx.textAlign = textAlign || 'center';
                    ctx.moveTo(range[0], 0);
                    ctx.lineTo(range[1], 0);
                    ctx.moveTo(range[0], 0);
                    ctx.lineTo(range[0], sign*outerTickSize);
                    ctx.moveTo(range[1], 0);
                    ctx.lineTo(range[1], sign*outerTickSize);
                    ticks.forEach(function (tick, index) {
                        trange = scale1(tick);
                        ctx.moveTo(trange, 0);
                        ctx.lineTo(trange, sign*innerTickSize);
                        if (textRotate) {
                            ctx.save();
                            ctx.translate(trange, sign*tickSpacing);
                            ctx.rotate(textRotate);
                            ctx.fillText(tickFormat(tick), 0, 0);
                            ctx.restore();
                        } else
                            ctx.fillText(tickFormat(tick), trange, sign*tickSpacing);
                    });
                } else {
                    ctx.textBaseline = 'middle';
                    ctx.textAlign = textAlign || (sign < 0 ? "end" : "start");
                    ctx.moveTo(0, range[0]);
                    ctx.lineTo(0, range[1]);
                    ctx.moveTo(0, range[0]);
                    ctx.lineTo(sign*outerTickSize, range[0]);
                    ctx.moveTo(0, range[1]);
                    ctx.lineTo(sign*outerTickSize, range[1]);
                    ticks.forEach(function (tick, index) {
                        trange = scale1(tick);
                        ctx.moveTo(0, trange);
                        ctx.lineTo(sign*innerTickSize, trange);
                        if (textRotate) {
                            ctx.save();
                            ctx.rotate(textRotate);
                            ctx.fillText(tickFormat(tick), sign*tickSpacing, trange);
                            ctx.restore();
                        } else
                            ctx.fillText(tickFormat(tick), sign*tickSpacing, trange);
                    });
                }
            });
        }

        axis.scale = function(x) {
            if (!arguments.length) return scale;
            scale = x;
            return axis;
        };

        axis.orient = function(x) {
            if (!arguments.length) return orient;
            orient = x in d3_canvas_axisOrients ? x + "" : d3_canvas_axisDefaultOrient;
            return axis;
        };

        axis.ticks = function() {
            if (!arguments.length) return tickArguments_;
            tickArguments_ = arguments;
            return axis;
        };

        axis.tickValues = function(x) {
            if (!arguments.length) return tickValues;
            tickValues = x;
            return axis;
        };

        axis.tickFormat = function(x) {
            if (!arguments.length) return tickFormat_;
            tickFormat_ = x;
            return axis;
        };

        axis.tickSize = function(x) {
            var n = arguments.length;
            if (!n) return innerTickSize;
            innerTickSize = +x;
            outerTickSize = +arguments[n - 1];
            return axis;
        };

        axis.innerTickSize = function(x) {
            if (!arguments.length) return innerTickSize;
            innerTickSize = +x;
            return axis;
        };

        axis.outerTickSize = function(x) {
            if (!arguments.length) return outerTickSize;
            outerTickSize = +x;
            return axis;
        };

        axis.tickPadding = function(x) {
            if (!arguments.length) return tickPadding;
            tickPadding = +x;
            return axis;
        };

        axis.tickSubdivide = function() {
            return arguments.length && axis;
        };

        axis.textRotate = function (x) {
            if (!arguments.length) return textRotate;
            textRotate = +x;
            return axis;
        };

        axis.textAlign = function (x) {
            if (!arguments.length) return textAlign;
            textAlign = x;
            return axis;
        };

        return axis;
    };

    var d3_canvas_axisDefaultOrient = "bottom",
        d3_canvas_axisOrients = {top: 1, right: 1, bottom: 1, left: 1};

