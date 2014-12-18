title: GiottoJS - drawing API

A drawing is created in a [group](/api/group) object.

### # drawing.x([x])

If x is specified, sets the x-accessor to the specified function or constant.
If x is not specified, returns the current x-accessor. This accessor is invoked
for each element in the data array passed to the drawing generator.
The default accessor assumes that each input element is a two-element array of numbers:

    function (d) {
        return d[0];
    }

### # drawing.y([y])

If y is specified, sets the y-accessor to the specified function or constant.
If y is not specified, returns the current y-accessor. This accessor is invoked
for each element in the data array passed to the drawing generator.
The default accessor assumes that each input element is a two-element array of numbers:

    function y(d) {
        return d[1];
    }