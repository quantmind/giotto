title: Transitions
description: Transitions on a bar chart
image: $site_url/examples/transitions.png
date: 24 December 2014
author: Luca Sbardella

<div data-options='gexamples.transition1' style='max-width: 600px' class="center-block" giotto-chart></div>

Transitions are easily implemented using the ``d3.transition`` api. To enable transition on
a GiottoJS chart, set a positive ``transition.duration`` on a chart type.
Currently, [transitions work on svg elements only](https://github.com/quantmind/giotto/issues/9).

Html:

    <div data-options='gexamples.transition1' giotto-chart></div>