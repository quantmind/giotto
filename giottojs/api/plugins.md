head-title: $APP_NAME - Plugin API
title: Plugin API
order: 98

Plugins are defined within a [paper] object to add behaviours
and/or additional graphics.


## Scales

The scales plugins add reference scales to paper so that other objects can use them.
Sensible defaults are used and, as usual, theyr can be overwritten at global
or paper level. For example:
```
"scales.y": {
    "type": "log",
    "from": "<serie-name>.<field-name>"
},
"scales.color": {
    "range": "myColorRangeFunction()"
}
```
Set the ``y`` scale to ``log`` and the ``range`` in the ``color`` scale to a
custom function to be evaluate by giotto engine.


[paper]: /api/paper "paper API"
