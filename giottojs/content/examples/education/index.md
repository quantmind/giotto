title: First and second stage of tertiary education in Europe
description: Barchart displaying tooltip, legend and right-click interations on both canvas and svg elements.
author: Luca Sbardella
date: 2 January 2015
image: $site_url/examples/education.png

<div class="container-fluid">
  <div class="row">
    <div class="col-sm-12">
      <div class="center-block" data-options='gexamples.education'
      data-data="$site_url/data/edat_lfse_07_1_Data.csv"
      style='width: 100%; max-width: 800px' giotto-chart></div>
      <p class="text-right small">2013 Data for both female and male population, source: <a href="http://ec.europa.eu/eurostat" target="self">Eurostat</a></p>
    </div>
  </div>
</div>

Barcharts support both canvas and svg on standard and ordinal scales.
This example shows how to add additional labels to the chart legend and how to
display them at an angle.


Html:

    <div data-options='gexamples.education' data-src="$site_url/data/edat_lfse_07_1_Data.csv" style='width: 100%' giotto-chart></div>