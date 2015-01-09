
    gexamples.europedebt = {
        height: '60%',

        colors: function () {
            return d3.colorbrewer.YlOrBr[9].slice().reverse();
        },

        tooltip: {
          show: true
        },

        pie: {
            show: true,
            labels: {
                position: 'outside'
            },
            innerRadius: 0.7,
            cornerRadius: 0.01,
            padAngle: 0.5,
            fillOpacity: 0.7,
            active: {
                fillOpacity: 1
            },
            transition: {
                duration: 1000
            },
            formatY: function (d) {
                return '€ ' + d3.format(',.0f')(d) + 'M';
            },
            x: function (d) {return d[1];},
            y: function (d) {return d[2];}
        },

        // Custom entry for diplaying the year and the total ammount of debt
        custom: {
            show: function () {
                // display the year and total debt
                var group = this.group(),
                    width = group.innerWidth(),
                    height = group.innerHeight(),
                    data = this.data(),
                    size = 30*group.factor(),
                    dy = 10*group.factor(),
                    total = 0;
                data.forEach(function (d) {
                    total += d[2];
                });
                total = gexamples.europedebt.pie.formatY(total);
                if (group.type() === 'svg') {
                    var uid = this.uid() + 'info',
                        el = group.element().selectAll('#' + uid).data([true]);
                    el.enter().append('g').attr('id', uid);
                    el.attr('transform', 'translate(' + width/2 + ',' + (height - size)/2 + ')');
                    var text = el.selectAll('text').data([this.label() + ' total', total]);
                    text.enter().append('text');
                    d3.giotto.svg.font(text, {size: size + 'px', weight: 'bold'});
                    text.attr('text-anchor', 'middle')
                        .text(function (d) {return d;})
                        .attr('y', function (d, i) {return (size + dy)*i;});
                } else {
                    var ctx = group.context();
                    ctx.save();
                    ctx.translate(width/2, (height - size)/2);
                    ctx.font = d3.giotto.canvas.font(ctx, {size: size + 'px', weight: 'bold'});
                    ctx.textAlign = 'center';
                    ctx.fillText(this.label() + ' total', 0, 0);
                    ctx.fillText(total, 0, size + dy);
                    ctx.restore();
                }
            }
        },

        onInit: function (chart, opts) {
            var current = 2013;
                yeardata = {2012: [], 2013: []};

            debtdata.sort(function (a, b) {return d3.descending(a[2],b[2]);}).forEach(function (data) {
                yeardata[data[0]].push(data);
            });

            function animate () {
                current = 2013 + 2012 - current;
                data = {label: current + '',
                        data: yeardata[current]};

                if (chart.numSeries()) {
                    chart.each(function (serie) {
                        serie.label = data.label;
                        serie.data(data.data);
                    });
                    chart.resume();
                } else
                    opts.data = [data];
                d3.timer(animate, 4*opts.pie.transition.duration);
                return true;
            }

            animate();
        },

        // Callback for angular directive
        angular: function (chart, opts) {

            opts.scope.$on('formFieldChange', function (e, form, field) {
                if (field === 'type') {
                    opts.type = form[field];
                    chart.resume();
                }
            });
        }
    };

    var debtdata = [[2012,"Belgium",342980.3],
                    [2013,"Belgium",351255.9],
                    [2012,"Bulgaria",7172.1],
                    [2013,"Bulgaria",7416.3],
                    [2012,"Czech Republic",66335.7],
                    [2013,"Czech Republic",61236.6],
                    [2012,"Denmark",93842.9],
                    [2013,"Denmark",92733.2],
                    [2012,"Germany",1369103.5],
                    [2013,"Germany",1372828.8],
                    [2012,"Estonia",1228.2],
                    [2013,"Estonia",1310.5],
                    [2012,"Ireland",191779.3],
                    [2013,"Ireland",202337.1],
                    [2012,"Spain",760195.2],
                    [2013,"Spain",836192.7],
                    [2012,"France",1522936.9],
                    [2013,"France",1595410.5],
                    [2012,"Croatia",23737.5],
                    [2013,"Croatia",28215.9],
                    [2012,"Italy",1882380.0],
                    [2013,"Italy",1970530.3],
                    [2012,"Latvia",8808.8],
                    [2013,"Latvia",8626.8],
                    [2012,"Lithuania",12335.1],
                    [2013,"Lithuania",12640.6],
                    [2012,"Luxembourg",8593.3],
                    [2013,"Luxembourg",9769.9],
                    [2012,"Hungary",73102.3],
                    [2013,"Hungary",76213.1],
                    [2012,"Malta",4867.1],
                    [2013,"Malta",5238.8],
                    [2012,"Netherlands",387007.0],
                    [2013,"Netherlands",404294.0],
                    [2012,"Austria",208874.3],
                    [2013,"Austria",214382.0],
                    [2012,"Poland",207248.8],
                    [2013,"Poland",214904.7],
                    [2012,"Portugal",204193.8],
                    [2013,"Portugal",213973.4],
                    [2012,"Romania",48383.4],
                    [2013,"Romania",52402.0],
                    [2012,"Slovenia",18618.0],
                    [2013,"Slovenia",24752.9],
                    [2012,"Slovakia",37280.8],
                    [2013,"Slovakia",39878.2],
                    [2012,"Finland",93900.0],
                    [2013,"Finland",98905.0],
                    [2012,"Sweden",130857.7],
                    [2013,"Sweden",140075.6],
                    [2012,"United Kingdom",1680297.8],
                    [2013,"United Kingdom",1732269.4]];
