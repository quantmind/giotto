
    g.paper.addType('canvas', function (paper, p) {
        var canvas, current,
            clear = paper.clear;

        p.xAxis = d3.canvas.axis();
        p.yAxis = [d3.canvas.axis(), d3.canvas.axis()];

        paper.destroy = function () {
            canvas = null;
            current = null;
            paper.element().selectAll('*').remove();
            return paper;
        };

        paper.refresh = function () {
            clearCanvas();
            paper.render();
            p.event.refresh({type: 'refresh', size: p.size.slice(0)});
            return paper;
        };

        paper.clear = function () {
            clearCanvas();
            return clear();
        };

        paper.current = function () {
            return current;
        };

        function clearCanvas() {
            var element = paper.element();
            element.selectAll('*').remove();
            canvas = paper.element().append("canvas")
                            .attr("width", p.size[0])
                            .attr("height", p.size[1]);
            current = canvas.node().getContext('2d');
            current.translate(p.margin.left, p.margin.top);
        }

        paper.clear();
    });
