
    // same as d3.svg.symbol... but for canvas
    d3.canvas.symbol = function() {
        var svg = d3.svg.symbol(),
            type = svg.type(),
            size = svg.size(),
            ctx;

        function symbol (d, i) {
            return (d3_canvas_symbols.get(type.call(symbol, d, i)) || d3_canvas_symbolCircle)(ctx, size.call(symbol, d, i));
        }

        symbol.type = function (x) {
            if (!arguments.length) return type;
            type = d3_functor(x);
            return symbol;
        };

        // size of symbol in square pixels
        symbol.size = function (x) {
            if (!arguments.length) return size;
            size = d3_functor(x);
            return symbol;
        };

        symbol.context = function (_) {
            if (!arguments.length) return ctx;
            ctx = _;
            return symbol;
        };

        return symbol;
    };


    function d3_canvas_symbolCircle(ctx, size) {
        var r = Math.sqrt(size / π);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, τ, false);
        ctx.closePath();
    }

    var d3_canvas_symbols = d3.map({
        "circle": d3_canvas_symbolCircle,
        "cross": function(ctx, size) {
            var r = Math.sqrt(size / 5) / 2,
                r3 = 3*r;
            ctx.beginPath();
            ctx.moveTo(-r3, -r);
            ctx.lineTo(-r, -r);
            ctx.lineTo(-r, -r3);
            ctx.lineTo(r, -r3);
            ctx.lineTo(r, -r);
            ctx.lineTo(r3, -r);
            ctx.lineTo(r3, r);
            ctx.lineTo(r, r);
            ctx.lineTo(r, r3);
            ctx.lineTo(-r, r3);
            ctx.lineTo(-r, r);
            ctx.lineTo(-r3, r);
            ctx.closePath();
        },
        "diamond": function(ctx, size) {
            var ry = Math.sqrt(size / (2 * d3_svg_symbolTan30)),
                rx = ry * d3_svg_symbolTan30;
            ctx.beginPath();
            ctx.moveTo(0, -ry);
            ctx.lineTo(rx, 0);
            ctx.lineTo(0, ry);
            ctx.lineTo(-rx, 0);
            ctx.closePath();
        },
        "square": function(ctx, size) {
            var s = Math.sqrt(size);
            ctx.beginPath();
            ctx.rect(-0.5*s, -0.5*s, s, s);
            ctx.closePath();
        },
        "triangle-down": function(ctx, size) {
            var rx = Math.sqrt(size / d3_svg_symbolSqrt3),
                ry = rx * d3_svg_symbolSqrt3 / 2;
            ctx.beginPath();
            ctx.moveTo(0, ry);
            ctx.lineTo(rx, -ry);
            ctx.lineTo(-rx, -ry);
            ctx.closePath();
        },
        "triangle-up": function(ctx, size) {
            var rx = Math.sqrt(size / d3_svg_symbolSqrt3),
                ry = rx * d3_svg_symbolSqrt3 / 2;
            ctx.beginPath();
            ctx.moveTo(0, -ry);
            ctx.lineTo(rx, ry);
            ctx.lineTo(-rx, ry);
            ctx.closePath();
        }
    });

    d3.canvas.symbolTypes = d3_canvas_symbols.keys();


    var d3_svg_symbolSqrt3 = Math.sqrt(3),
        d3_svg_symbolTan30 = Math.tan(30 * d3_radians);
