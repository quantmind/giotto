head_title: D3 Extensions

[TOC]

## Zoomable Sunburst Partition

<div class='row'>
    <div class='col-sm-12'>
        <h5>Sqrt Scale <small>default</small></h5>
        <data-viz-sun-burst data-src="https://gist.githubusercontent.com/lsbardel/f3d21f35a685a96706bf/raw"
        data-resize=1 data-height='50%' data-addorder data-padding=60></sun-burst>
    </div>
</div>

## Force Layout

<div class='row'>
    <div class='col-sm-12'>
        <h5></h5>
        <div data-viz-force data-nodes=100 data-max-radius=12 data-gravity=0.1 data-charge=-1000 data-height='60%' data-resize=1></div>
    </div>
</div>

The Force layout contains 100 data nodes a full width and an height of 60% of the width.

    <div data-viz-force data-nodes=50 data-max-radius=12 data-gravity=0.1
    data-charge=-1000 data-height='60%' data-resize=1></div>

## Time Series

<div class='row'>
    <div class='col-sm-12'>
        <h5></h5>
        <div data-viz-c3 data-options='d3examples.bitcoin'></div>
    </div>
</div>

<script type='text/javascript'>
// bitcoin timeserie options
var d3examples = {
    //
    bitcoin: function (d3) {
        var years = 1;
        return {
            src: 'http://www.quandl.com/api/v1/datasets/BAVERAGE/USD.json?auth_token=-kdL9rjDHgBsx1VcDkrC&rows=' + 365*years,
            processData: function (raw) {
                var cols = d3.transpose(raw.data);
                    dates = cols[0],
                    price = cols[1],
                    volume = cols[2];
                dates.splice(0, 0, 'dates');
                price.splice(0, 0, 'price');
                volume.splice(0, 0, 'volume');
                return {
                    data: {
                        x: 'dates',
                        axes: {
                            price: 'y',
                            volume: 'y2'
                        },
                        columns: [dates, price, volume],
                        types: {
                            price: 'area-spline',
                        }
                    },
                    axis: {
                        x: {
                            type: 'timeseries',
                            tick : {
                                format : "%e %b %y"
                            }
                        },
                        y2: {
                            show: true
                        }
                    }
                };
            }
        }
    }
};
</script>