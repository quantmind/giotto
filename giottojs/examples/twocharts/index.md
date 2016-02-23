title: Area Chart
description: GiottoJS supports area charts for both svg and canvas elements by extending d3js area to canvas.
date: 2014 December 26

<div class="container-fluid">
  <div class="row" giotto='$html_url/giotto.json'>
    <div class="col-sm-6">
      <div class='center-block' style='width: 100%; max-width: 800px' giotto-paper="left"></div>
    </div>
    <div class="col-sm-6">
      <div class='center-block' style='width: 100%; max-width: 800px' giotto-paper="right"></div>
    </div>
  </div>
</div>

Area charts are enabled by setting the ``area`` parameter in the ``line`` entry
to to ``true``.


Html:

    <div style='width: 100%' giotto-config='$path/giotto.json'></div>
