title: Zooming
description: Zooming on SVG and Canvas with GiottoJS using d3js behavour zoom
image: $site_url/examples/zooming.png
date: 18 December 2014
author: Luca Sbardella

<div style="width: 100px" class="center-block">$html_type_form</div>
<div data-options='gexamples.zooming1' style="max-width: 600px" class="center-block" giotto-chart></div>

GiottoJS charts can zoom along the x and y coordinates by simply enabling it
in the grid parameter as shown below.

Under the hood, it uses ``d3.behaviour.zoom`` from [d3][] for both canvas and svg.

Html:

    <div data-options='gexamples.zooming1' style="max-width: 600px" class="center-block" giotto-chart></div>