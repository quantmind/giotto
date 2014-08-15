
    d3ext.SunBurst = Viz.extend({
        //
        d3build: function () {
            var self = this;
            //
            // Load data if not already available
            if (!this.attrs.data) {
                return this.loadData(function () {
                    self.d3build();
                });
            }
            //
            var d3 = this.d3,
                size = this.size(),
                root = this.attrs.data,
                padding = this.attrs.padding ? +this.attrs.padding : 10,
                width = size[0]/2,
                height = size[1]/2,
                radius = Math.min(width, height)-padding,
                svg = this.svg().append("g")
                          .attr('class', 'sunburst')
                          .attr("transform", "translate(" + width + "," + height + ")"),
                color = d3.scale.category20c(),
                partition = d3.layout.partition()
                    .value(function(d) { return d.size; }),
                x = d3.scale.linear().range([0, 2 * Math.PI]),
                y = d3.scale.sqrt().range([0, radius]);

            var arc = d3.svg.arc()
                    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
                    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
                    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
                    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); }),
                path = svg.selectAll("path")
                          .data(partition.nodes(root))
                          .enter().append("path")
                          .attr("d", arc)
                          .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
                          .on("click", click);

            function click(d) {
                path.transition()
                    .duration(750)
                    .attrTween("d", arcTween(d));
            }

            // Interpolate the scales!
            function arcTween(d) {
                var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                    yd = d3.interpolate(y.domain(), [d.y, 1]),
                    yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
                return function(d, i) {
                    return i ? function(t) { return arc(d); } : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
                };
            }
        }
    });
