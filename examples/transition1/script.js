
    gexamples.transition1 = {
        height: '60%',

        onInit: function (viz) {

            var paper = viz.paper(),
                group = paper.group(),
                points = group.points([]).transition();

            group.element().transition().style("color", "red");

            function animate () {
                points.add([Math.random(), Math.random()]).render();
                d3.timer(animate, 1000);
                return true;
            }

            d3.timer(animate, 1000);
        }
    };