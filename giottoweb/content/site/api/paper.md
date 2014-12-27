title: GiottoJS - paper API


A ``giotto.paper`` is a constructor for a ``paper`` object, an abstraction
on top of the ``svg`` or the ``canvas`` element.

    var paper = giotto.paper(options);

where ``options`` is an object containing several parameters to customise the
paper.


### # paper.type()

Returns the default [group](/api/group) type for the paper.
It can be either ``svg`` (default) or ``canvas``.

### # paper.uid()

Returns the unique identifier for the paper in the current Html document, an integer.

### # paper.size()

Returns a two elements array containing the pixel dimensions of the paper, including any margin.

### # paper.select([filter])

Select a [group](/api/group) given a filter in a similar way as ``d3.select``.
Returns the selected group or ``undefined``:

    paper.select('*')   // returns the first group in the paper
    paper.select('#plot1') // select the group with id plot1

### # paper.each([filter], callback)

Invokes the specified ``callback`` function for each group in the paper, passing the index ``i``
with the ``this`` context of the current group. If the optional ``filter`` parameter is given,
it invokes the ``callback`` only on the mathing groups.

    paper.each(function (i) {
        this.yaxis.tickSize(5);
    });

    paper.each('.timeseries', function (i) {
        this.yaxis.tickSize(5);
    });

### # paper.pickColor()

Pick a color from the paper color range.

## Options

The internal paper options can be accessed via the ``options`` method:

    var options = paper.options();

There shouldn't be much need to modify the options once the paper is created,
this accessor is here just in case.

### type

Default:

    "svg"

Currently only svg is fully supported.

### margin

Default:

    {top: 20, right: 20, bottom: 20, left: 20}

Set the margins for the inner part of the paper.


### colors

Default:

    d3.scale.category10().range()

An Array of colors to use by the visualization rendering the paper.




