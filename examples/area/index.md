title: Area Chart
description: GiottoJS supports area charts for both svg and canvas elements by extending d3js area to canvas.
date: 2014 December 26
author: Luca Sbardella
image: $site_url/examples/area.png

<div class="container-fluid">
  <div class="row">
    <div class="col-sm-12">
      <div class='center-block' style='width: 100%; max-width: 800px' giotto-chart='gexamples.area1'></div>
    </div>
  </div>
</div>

Area charts are enabled by setting the ``area`` parameter in the ``line`` entry
to to ``true``.


Html:

    <div data-options='gexamples.area1' style='width: 100%' giotto-chart></div>