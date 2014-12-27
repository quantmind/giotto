title: Area Chart with Gradient
description: GiottoJS supports area charts for both svg and canvas elements by extending d3js area to canvas.
date: 2014 December 27
author: Luca Sbardella
image: $site_url/examples/areagradient.png

<div class="container-fluid">
  <div class="row">
    <div class="col-sm-10">
      <div data-options='gexamples.area2' style='width: 100%' giotto-chart></div>
    </div>
    <div class="col-sm-2 small">
      $html_type_form
    </div>
  </div>
</div>

Area charts are enabled by setting the ``area`` parameter in the ``line`` entry
to to ``true``. The ``gradient`` entry can specify the second color of the
gradient (``fill`` specifies the first color of the gradient and by default
it is picked by the [paper.pickColour](/api/paper#paperpickcolor) method).


Html:

    <div data-options='gexamples.area2' style='width: 100%' giotto-chart></div>