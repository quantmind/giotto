    //
    //  Trianglify visualization
    //  ===========================
    //
    //  Requires trianglify library loaded or an entry ``trianglify`` in your
    //  require config.
    g.createviz('trianglify', {
        fillOpacity: 1,
        strokeOpacity: 1,
        variance: 0.75,
        seed: null,
        cell_size: 80,
        color: null,
        x_color: null,
        y_color: null
    }, function (tri) {

        var t;

        tri.gradient = function (value) {
            if (value && typeof(value) === 'string') {
                var bits = value.split('-');
                if (bits.length === 2) {
                    var palette = Trianglify.colorbrewer[bits[0]],
                        num = +bits[1];
                    if (palette) {
                        return palette[num];
                    }
                }
            }
        };
        //
        tri.on('tick.main', function (e) {
            // Load data if not already available
            tri.stop();
            if (tri.Trianglify === undefined && typeof Trianglify === 'undefined') {
                require(['trianglify'], function (Trianglify) {
                    tri.Trianglify = Trianglify || null;
                    tri.resume();
                });
            } else {
                if (tri.Trianglify === undefined)
                    tri.Trianglify = Trianglify;
                build();
            }
        });


        function build () {
            var opts = tri.options(),
                cell_size = +opts.cell_size,
                color = tri.gradient(opts.color),
                x_color = tri.gradient(opts.x_gradient) || color,
                y_color = tri.gradient(opts.y_gradient) || color,
                paper = tri.paper(),
                element = paper.element(),
                size = paper.size();

            //element.selectAll('.trianglify-background').remove();
            if (!t) {
                paper.on('change.trianglify' + paper.uid(), build);
                //highjack paper.image()
                paper.image = function () {
                    var url = pattern.dataUrl;
                    return url.substring(4,url.length-1);
                };
            }

            var topts = t.opts;
            if (x_color)
                topts.x_color = x_color;
            if (y_gradient)
                topts.y_color = y_color;
            if (cell_size > 0) {
                topts.cell_size = cell_size;
            }
            var pattern = tri.Trianglify(topts),
                telement = element.select('.trianglify-background');
            if (!telement.node()) {
                var parentNode = element.node(),
                    node = document.createElement('div'),
                    inner = parentNode.childNodes;
                while (inner.length) {
                    node.appendChild(inner[0]);
                }
                node.className = 'trianglify-background';
                parentNode.appendChild(node);
                telement = element.select('.trianglify-background');
            }
            telement.style("min-height", "100%")
                   //.style("height", this.attrs.height+"px")
                   //.style("width", this.attrs.width+"px")
                    .style("background-image", pattern.dataUrl);
        }
    });
