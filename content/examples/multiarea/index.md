title: Multiple Area Charts with Gradient
description: Multiple area charts for both svg and canvas elements are supported by rendering areas in a background element.
author: Luca Sbardella
date: 30 December 2014
image: /examples/multiarea/multiarea.png

<div class="container-fluid">
  <div class="row">
    <div class="col-sm-10">
      <div data-options='gexamples.area3' style='width: 100%' giotto-chart></div>
    </div>
    <div class="col-sm-2 small">
      $html_randomise_form
    </div>
  </div>
</div>

Area charts are enabled by setting the ``area`` parameter in the ``line`` entry
to to ``true``. The ``gradient`` entry can specify the second color of the
gradient (``fill`` specifies the first color of the gradient and by default
it is picked by the [paper.pickColour](/api/paper#paperpickcolor) method).


Html:

    <div data-options='gexamples.area2' style='width: 100%' giotto-chart></div>