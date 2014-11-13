
    var

    Paper = Class.extend({

        init: function (element, options) {
            options = extend({}, options, x.paperDefaults);
            this.element = element;
            this.element.html('');
            //
            // Create axis objects
            this.axis = {
                x: new Axis(this, options.xaxis),
                y: new Axis(this, options.yaxis),
                y2: new Axis(this, options.yaxis2)
            };
        }
    }),

    Axis = Class.extend({

        init: function (paper, options) {
            options = options || {};
            this.type = options.type || 'linear';
        }
    }),

    Svg = Paper.extend({

        init: function (element, attrs) {
            this._super(element, attrs);
            attrs = this.attrs;
            element = this.element;

            var width = attrs.width,
                height = attrs.height,
                svg = this.element.append("svg")
                                .attr("width", width)
                                .attr("height", height)
                                .attr("viewBox", "0 0 " + width + " " + height);
                                //perserveAspectRatio="xMinYMid"

            var x = d3.scale.linear()
                        .range([0, width]),
                y = d3.scale.linear()
                        .range([height, 0]);
        },
        //
        //  Draw a new Line from a serie object
        //
        drawLine: function (serie) {
            if (isArray(serie)) serie = {data: serie};
            if (!(serie && serie.data)) return;

            copyMissing(this.options.lines, serie);

            var line = d3.svg.line()
                        .interpolate(serie.interpolate)
                        .x(function(d) {
                            return d.x;
                        })
                        .y(function(d) {
                            return d.y;
                        }),
                data = this.xyData(serie.data);


            var g = this.svg.append('g')
                        .datum(data)
                        .attr('d', line);
        },
        //
        xyData: function (data) {
            if (!isArray(data)) return;
            if (isArray(data[0]) && data[0].length === 2) {
                var xydata = [];
                data.forEach(function (xy) {
                    xydata.push({x: xy[0], y: xy[1]});
                });
                return xydata;
            }
            return data;
        }
    });