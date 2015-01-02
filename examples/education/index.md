title: First and second stage of tertiary education in Europe
description: Barchart displaying tooltip, legend and right-click interations on both canvas and svg elements.
author: Luca Sbardella
date: 2 January 2015
image: $site_url/examples/education.png

<div class="container-fluid">
  <div class="row">
    <div class="col-sm-10">
      <div data-options='gexamples.education' data-src="$site_url/data/edat_lfse_07_1_Data.csv" style='width: 100%' giotto-chart></div>
      <p class="text-right small">Source: <a href="http://ec.europa.eu/eurostat" target="self">Eurostat</a></p>
    </div>
    <div class="col-sm-2 small">
      $html_type_form
      <p>Right click on the chart for additional options</p>
    </div>
  </div>
</div>

Barcharts support both canvas and svg on standard and ordinal scales.
This example shows how to add additional labels to the chart legend.


Html:

    <div data-options='gexamples.education' data-src="$site_url/data/edat_lfse_07_1_Data.csv" style='width: 100%' giotto-chart></div>