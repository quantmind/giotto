title: World Population
author: Luca Sbardella


<div class="container">
<div class="row" data-options='gexamples.world' data-giotto-collection>
    <div class="col-md-8">
        <div data-key='world' data-giotto-chart></div>
    </div>
    <div class="col-md-4">
        <div data-key='slider' data-giotto-slider></div>
        <div><p class='text-center' ng-bind="year"></p></div>
        <div data-key='timeserie' data-height='50%' data-giotto-chart></div>
    </div>
</div>
</div>

Html:

    <div class="container">
    <div class="row" data-options='gexamples.world' data-giotto-collection>
        <div class="col-md-8">
            <div data-key='world' data-giotto-chart></div>
        </div>
        <div class="col-md-4">
            <div data-key='timeserie' data-height='50%' data-giotto-chart></div>
        </div>
    </div>
    </div>