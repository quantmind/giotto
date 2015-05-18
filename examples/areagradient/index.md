title: Area Chart with Gradient
description: GiottoJS supports area charts for both svg and canvas elements by extending d3js area to canvas.
date: 2014 December 27
author: Luca Sbardella
image: $site_url/examples/areagradient.png

<div class="container-fluid">
  <div class="row">
    <div class="col-sm-12">
      <div class='center-block' style='width: 100%; max-width: 800px' giotto-chart='gexamples.area2'></div>
    </div>
  </div>
</div>

Area charts are enabled by setting the ``area`` parameter in the ``line`` entry
to to ``true``. The ``gradient`` entry can specify the second color of the
gradient (``fill`` specifies the first color of the gradient and by default
it is picked by the [paper.pickColour](/api/paper#paperpickcolor) method).


Html:

    <div class='center-block' style='width: 100%; max-width: 800px' giotto-chart='gexamples.area2'></div>