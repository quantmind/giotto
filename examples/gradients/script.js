
    giottoQueue.push(function () {

        var gt = d3.giotto,
            paper1 = d3.giotto.paper(d3.select('#gradient1'), {
                margin: 0,
                height: '50%'
            });

        paper1.group().fill(gt.gradient());
        paper1.render();

        var gradient2 = gt.gradient().direction('x')
                            .colors(['#ffffd9', '#41b6c4', '#225ea8']);
            paper2 = d3.giotto.paper(d3.select('#gradient2'), {
                margin: 0,
                height: '50%'
            }),

        paper2.group().fill(gradient2);
        paper2.render();


        var gradient3 = gt.gradient().direction('x')
                            .colors(['#ffffd9', '#41b6c4', '#225ea8'])
                            .opacity(0.5);
            paper3 = d3.giotto.paper(d3.select('#gradient3'), {
                margin: 0,
                height: '50%'
            });

        paper3.group().fill(gradient3);
        paper3.render();


        var paper4 = d3.giotto.paper(d3.select('#gradient4'), {
                type: 'canvas',
                margin: 0,
                height: '50%'
            });

        paper4.group().fill(gradient2);
        paper4.render();


        var chart = d3.giotto.chart(d3.select('#chart')).options({
            type: 'canvas',
            height: '50%',
            fill: gradient2,
            data: [
            {
                point: {
                    size: '20px',
                    fill: '#fff',
                    color: '#222',
                    lineWidth: 4
                },
                line: {
                    lineWidth: 4,
                    color: '#222'
                },
                data: [[1, 3], [2, 2], [3, 5], [4, 6], [5, 4], [6, -1], [7, 1], [8, 0]]
            }]
        }).start();

    });
