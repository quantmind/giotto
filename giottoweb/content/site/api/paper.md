title: GiottoJS - paper API


A ``giotto.paper`` is a constructor for a ``paper`` object, an abstraction
on top of the ``svg`` or the ``canvas`` element.

    var paper = giotto.paper(options);

where ``options`` is an object containing several parameters to customise the
paper.

## Identifiers

### # paper.type()

Returns the paper type, currently only ``svg`` is supported.

### # paper.uid()

Returns the unique identifier for the paper in the current Html document, an integer.

## Dimensions

### # paper.size()

Returns a two elements array containing the pixel dimensions of the paper, including any margin

### # paper.width()

Width in pixels of the paper, equivalent to:

    paper.size()[0]

### # paper.height()

Height in pixels of the paper, equivalent to:

    paper.size()[1]

### # paper.innerWidth()

Width in pixels of the paper excluding left and right margins. Equivalent to:

    var o = paper.options();
    paper.size()[0] - o.margin.left - o.margin.right;

### # paper.innerHeight()

Height in pixels of the paper excluding top and bottom margins. Equivalent to:

    var o = paper.options();
    paper.size()[1] - o.margin.top - o.margin.bottom;

### # paper.dim(value)

Convert ``value`` into the x-axis internal range. There are two possible conversions:

* Convert from a 0 to 1 range - The input must be a number between 0 and 1
* Convert from pixels - The input must be a string ending with ``"px"``

For example, lets assume the internal
range is ``[-5, 5]`` and the [paper.innerWidth()](#paperinnerwidth) is ``500px``:

    paper.dim(0) === -5
    paper.dim(1) === 5
    paper.dim(0.5) === 0
    paper.dim('250px') = 0
    paper.dim('500px') = 5




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




