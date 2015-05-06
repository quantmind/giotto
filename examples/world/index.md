title: World Population
author: Luca Sbardella

Adding data-driven charts on mapps is easy. It requires at least one additional
parameter to be passed to the configuration object, the geometric features
to use in the chart.

<div class="container">
    <div class="row" data-options='gexamples.world' giotto-collection>
        <div class="col-md-8">
            <div data-key='world' giotto-chart></div>
        </div>
        <div class="col-md-4">
            <div data-key='slider' giotto-slider></div>
            <div><p class='text-center' ng-bind="year"></p></div>
            <div data-key='timeserie' data-height='50%' giotto-chart></div>
        </div>
    </div>
</div>

Html:

    <div class="container">
        <div class="row" data-options='gexamples.world' giotto-collection>
            <div class="col-md-8">
                <div data-key='world' giotto-chart></div>
            </div>
            <div class="col-md-4">
                <div data-key='slider' giotto-slider></div>
                <div><p class='text-center' ng-bind="year"></p></div>
                <div data-key='timeserie' data-height='50%' giotto-chart></div>
            </div>
        </div>
    </div>