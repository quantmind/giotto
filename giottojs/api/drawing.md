head-title: $APP_NAME - Drawing API
title: Drawing API
order: 99

Drawings are associated with a [paper] object and are responsible
for creating the objects that we perceive on the paper. A drawing is
composed of four components:

* data and aesthetic mapping
* statistical transformation
* geometric object
* position adjustment

Usually all the drawings on a paper have something in common, typically they are
different views of the same data, for example, a scatterplot with and
overlaid line, and area chart with the corresponding line chart overlaid,
a bar chart and its pie chart equivalent and so forth.

A drawing does not need to specify all components, the [paper] will
supply defaults if some components are omitted.

## Data and Mapping

Data are what turns an abstract drawing into a concrete one.
Along with the data, we need a specification of which variables are mapped to which
aesthetics. For example, we might map weight to x position, height to y position, and age
to size. The details of the mapping are described by the scales; see Section 3.2. Choosing
a good mapping is crucial for generating a useful graphic, as described in Section 7.


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
```javascript
function y(d) {
    return d[1];
}
```
### # drawing.options([options])

If options is specified, set the options for the drawing object and return the
``drawing``. If is not specified, returns the current options which by default
is an empty ``Object``. Drawing options are the way GiottoJS override default
behaviour in a paper.


[paper]: /api/paper "paper API"
