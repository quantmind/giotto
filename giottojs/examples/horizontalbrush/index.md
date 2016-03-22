title: Horizontal Brush
description: GiottoJS supports horizontal brush for both canvas and svg charts
date: 2014 December 21
author: Luca Sbardella
image: $site_url/examples/horizontalbrush.png

<div data-options='gexamples.brush1' style='width: 90%; height: 200px' class="center-block" giotto-chart></div>

GiottoJS extends [d3][] support for brushes to the canvas element using a similar API.
This example uses the ``brush`` plugin for charts. Under the hood, brush support for canvas is implemented in the
``d3.canvas.brush`` function.

Html:

    <div data-options='gexamples.brush1' style='width: 90%;' class="center-block" giotto-chart></div>