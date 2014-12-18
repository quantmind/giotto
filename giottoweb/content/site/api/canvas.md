title: D3 canvas API

GiottoJS injects the ``canvas`` namespace into into ``d3``. Importantly, this part
of the library is completely independent from the other GiottoJS components
and could be stripped out to work on its own.

## Line

### # d3.canvas.line()

Constructs a new line generator with the default d3 x- and y-accessor functions
(that assume the input data is a two-element array of numbers; see below
for details), and linear interpolation.
The returned function generates path data for an open piecewise linear curve,
or polyline, as in a line chart:

## Axis

### # d3.canvas.axis()

Create a new default axis.

## Arc

### # d3.canvas.arc()

## Symbol

### # d3.canvas.symbol()

