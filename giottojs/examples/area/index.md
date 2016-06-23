title: Area Chart
description: GiottoJS supports area charts for both svg and canvas elements by extending d3js area to canvas.
date: 2014 December 26

<div class="row" giotto='examples/area/giotto.json'>
    <div class="col-sm-10">
        <div data-aspect-ratio="2:1">
        <div giotto-paper></div>
        </div>
    </div>
    <div class="col-sm-2">
        <button class="btn btn-default" type="submit" ng-controller="GiottoTools as vm" ng-click="vm.randomize()">Randomize</button>
    </div>
</div>

Area charts are enabled by adding ``area`` to the ``draw`` list.
