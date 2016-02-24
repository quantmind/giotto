head-title: $APP_NAME - Drawing API
title: Drawing API

A drawing is created by a [paper](/api/paper) object


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

### # drawing.options([options])

If options is specified, set the options for the drawing object and return the
``drawing``. If is not specified, returns the current options which by default
is an empty ``Object``. Drawing options are the way GiottoJS override default
behaviour in a paper.
