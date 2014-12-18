title: GiottoJS - group API
description: A GiottoJS group maintainin a collection of drawing in memory. A group can be a g-element of an svg element or a canvas element.


A group is a collection af drawings in a [paper](/api/paper).
It is created form a paper and it is always part of a paper.

    group = paper.group(options);

where ``options`` is an object containing parameters to override the ``paper`` defaults.

# Drawing

### # group.add(drawing)

Add a new drawing to the group. The input can be a [drawing](/api/drawing) object or
a function which render the drawing:

    group.add(function () {

    });

is equivalent to

    group.add(drawing(group, function () {

    }));

This method returns the ``drawing`` object added to the group drawing collection.


### # group.path(data, [opts])

Create a new path and add it to the drawings collection. Returns the new path
drawing object which can be act upon via the [drawing api](/api/drawing). The control
points of the path are given in the ``data`` array which default it is assumed to
be an array of two elements array ``[x, y]``. This can be changed by modifying the
[drawing.x()](/api/drawing#drawingxx) and [drawing.y()](/api/drawing#drawingyy)
accessors.

### # group.render()

Render the group by re-rendering all drawings. It returns the group for chaining.

### # group.clear()

Clear all drawing from ``g`` or ``canvas`` element but keeps them still loaded in memory.
Issuing ``render`` after the command will re-render all drawings. It returns the group for chaining.

# Dimensions

### # group.factor()

For ``svg`` it is 1, for ``canvas`` it depends on the resolution of your screen (for a mac-book pro retina display it is 2).

### # group.width()

Width in pixels of the group, equivalent to:

    group.size()[0]

### # group.height()

Height in pixels of the group, equivalent to:

    group.size()[1]

### # group.innerWidth()

Width in pixels of the group excluding left and right margins. Equivalent to:

    var o = group.options();
    group.width() - group.factor()*(o.margin.left + o.margin.right);

### # group.innerHeight()

Height in pixels of the group excluding top and bottom margins. Equivalent to:

    var o = group.options();
    group.height() - group.factor()*(o.margin.top + o.margin.bottom);

### # group.dim(value)

Convert ``value`` into the x-axis internal range. There are two possible conversions:

* Convert from a 0 to 1 range - The input must be a number between 0 and 1
* Convert from pixels - The input must be a string ending with ``"px"``

For example, lets assume the internal
range is ``[-5, 5]`` and the [group.innerWidth()](#groupinnerwidth) is ``500px``:

    group.dim(0) === -5
    group.dim(1) === 5
    group.dim(0.5) === 0
    group.dim('250px') = 0
    group.dim('500px') = 5

