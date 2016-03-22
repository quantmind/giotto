title: World Population
author: Luca Sbardella

Adding data-driven charts on maps is easy. It requires at least one additional
parameter to be passed to the configuration object, the geometric features
to use in the chart.

This example uses the ``giotto-collection`` angular directive which manage a group
of charts requiring interaction.

<div class="container">
    <div class="row" giotto-collection='gexamples.world'>
        <div class="col-md-8">
            <div giotto-chart='world'></div>
        </div>
        <div class="col-md-4">
            <div data-key='slider' giotto-slider='slider'></div>
            <div><p class='text-center' ng-bind="year"></p></div>
            <div data-height='50%' giotto-chart='timeserie'></div>
        </div>
    </div>
</div>

Html:

    <div class="container">
        <div class="row" giotto-collection='gexamples.world'>
            <div class="col-md-8">
                <div giotto-chart='world'></div>
            </div>
            <div class="col-md-4">
                <div data-key='slider' giotto-slider='slider'></div>
                <div><p class='text-center' ng-bind="year"></p></div>
                <div data-height='50%' giotto-chart='timeserie'></div>
            </div>
        </div>
    </div>