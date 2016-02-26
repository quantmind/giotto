head-title: $APP_NAME - Paper API
title: Paper API
order: 100

A ``giotto.paper`` is an abstraction
on top of the ``svg`` or the ``canvas`` elements and serves as placeholder
for [drawings] and [plugins].
```javascript
    var gt = giotto();
    var paper = gt.paper(element, options);
```
where ``options`` is an optional object containing several parameters
to customise the paper and therefore override the defaults values in the ``gt``
instance. ``element`` is the ``HtmlElement`` where the paper is located.


<h2>Contents</h2>

[TOC]

### paper.element

Returns a [d3 selection](https://github.com/d3/d3-selection) containing the
outer element of the paper, i.e. the element containing the [paper-container](#papercontainer)

### paper.container

Returns a [d3 selection](https://github.com/d3/d3-selection) containing the
element of the paper.

### paper.type

The type of paper, either ``canvas`` or ``svg``.

### paper.id

Unique identifier of the paper, in the current Html document, an integer.

### paper.size

The current size in pixels of the paper [container element](#papercontainer).
This is a two-elements array indicating ``width`` and ``height``.
```javascript
paper.size => [600, 400]
```
All [drawins] in in a paper have the same size.

### paper.domWidth

Alias of ``paper.size[0]``.

### paper.domHeight

Alias of ``paper.size[1]``.

### paper.options([value])

Set or get the [options](/api/options) of the paper.

### paper.each(function)

Calls the specified ``function`` for each [drawing] in this paper, passing
the drawing’s value and index as arguments. Returns undefined.
The iteration order is the same as the order of the drawings in the paper.
```javascript
paper.each(function (draw, i) {
    ...
});
```

### paper.resize([size])

Resize the paper if needed. The optional ``size`` parameter is a two elements
array indicating the new size. When missing, it is calculated from the
[paper.container](#papercontainer) element.
The resizing occurs only when ``size`` is different from the current
[size](#papersize) of the paper, otherwise it is a non operation.

When resizing occurs, the paper is [cleared](#paperclear) and
[redrawn](#paperdraw).

### paper.clear()

Clear the paper by removing all visible drawing and plugins. This method does not
remove drawings from the paper, it simply remove their graphical representation.

### paper.draw()

Draw all [drawings].


[drawings]: /api/drawing
[drawing]: /api/drawing
[plugins]: /api/plugin
[plugin]: /api/plugin
