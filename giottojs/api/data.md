head-title: $APP_NAME - Data API
title: Data API
order: 95

Data is what turns an abstract [drawing] into a concrete one. Data can be of any
shape or form, it can contain several **fields** and dimensions.

## Data Providers

Data providers are responsible for providing data from whatever source. The library ships
with several providers and allow for users to add their own custom sources.

### values

The ``values`` provider simply provides data as an array of cross-section data:

```json

    values: [
        {...}, ...
    ]
```

### url

The ``url`` provider fetch data from the url given

```json

    url: '/mydata.json'
```

### eval

Evaluate an expression in javascript


## Data transforms

### filter

This transform requires the [crossfilter][] library.
In order to use it, one must register it with giotto:
```javascript
crossfilter = require('crossfilter');
giotto.registerExtension('crossfilter', crossfilter); 
```
A filter transform can be used to create additional series from an existing one, for example:
```json
{
    "type": "filter",
    "dimension": "year",
    "filter": [2013, 2012]
}
```
Creates two additional series: from the original one: ``serie.year.2012`` and ``serie.year.2013``.


[paper]: /api/paper "paper API"
[drawing]: /api/drawing "drawing API"
[crossfilter]: https://github.com/square/crossfilter
