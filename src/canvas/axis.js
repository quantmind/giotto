
    d3.canvas.axis = function() {
        var scale = d3.scale.linear(),
            orient = d3_canvas_axisDefaultOrient,
            innerTickSize = 6,
            outerTickSize = 6,
            tickPadding = 3,
            tickArguments_ = [10],
            tickValues = null,
            tickFormat_ = null,
            lineColor_,
            lineWidth = 1,
            font = g.defaults.paper.font;

        function axis (canvas) {
            canvas.each(function() {
                var ctx = this.canvas.getContext('2d');

                var scale0 = this.__chart__ || scale,
                    scale1 = this.__chart__ = scale.copy();

                // Ticks, or domain values for ordinal scales.
                var ticks = tickValues === null ? (scale1.ticks ? scale1.ticks.apply(scale1, tickArguments_) : scale1.domain()) : tickValues,
                    tickFormat = tickFormat_ === null ? (scale1.tickFormat ? scale1.tickFormat.apply(scale1, tickArguments_) : d3_identity) : tickFormat_,
                    tick = g.selectAll(".tick").data(ticks, scale1),
                    tickSpacing = Math.max(innerTickSize, 0) + tickPadding,
                    lineColor = lineColor_ || font.color,
                    tickTransform;

                // Domain.
                var range = d3_scaleRange(scale1);

                ctx.fillStyle = font.color;
                ctx.font = font.family;
                // Apply axis labels on major ticks
                if (orient === "bottom" || orient === "top") {
                    ticks.forEach(function (tick, index) {
                        ctx.beginPath();
                        ctx.lineWidth = lineWidth;
                        ctx.strokeStyle = lineColor;
                        ctx.moveTo(xStart, linePositionY);
                        ctx.lineTo(this.width, linePositionY);
                        ctx.stroke();
                        ctx.closePath();
                    });
                } else {
                    ticks.forEach(function (tick, index) {
                        ctx.beginPath();
                        ctx.lineWidth = lineWidth;
                        ctx.strokeStyle = lineColor;
                        ctx.moveTo(xStart, linePositionY);
                        ctx.lineTo(this.width, linePositionY);
                        ctx.stroke();
                        ctx.closePath();
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

        return axis;
    };

    var d3_canvas_axisDefaultOrient = "bottom",
        d3_canvas_axisOrients = {top: 1, right: 1, bottom: 1, left: 1};

    function d3_canvas_axisX(selection, x0, x1) {
        selection.attr("transform", function(d) { var v0 = x0(d); return "translate(" + (isFinite(v0) ? v0 : x1(d)) + ",0)"; });
    }

    function d3_canvas_axisY(selection, y0, y1) {
        selection.attr("transform", function(d) { var v0 = y0(d); return "translate(0," + (isFinite(v0) ? v0 : y1(d)) + ")"; });
    }
