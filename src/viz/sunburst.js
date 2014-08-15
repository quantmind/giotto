
    d3ext.SunBurst = Viz.extend({
        //
        d3build: function () {
            //
            // Load data if not already available
            if (!this.root) {
                var self = this;
                return d3.json(this.attrs.target, function(error, root) {
                    if (!error) {
                        self.root = root || {};
                        self.d3build();
                    }
                });
            }
            //
            var d3 = this.d3,
                size = this.size(),
                root = this.root,
                width = size[0],
                height = size[1],
                svg = this.svg().append("g")
                          .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");
                color = d3.scale.category20c(),
                partition = d3.layout.partition()
                    .value(function(d) { return d.size; });

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
