

For pie charts, the ``draws`` entry is of the form:
```json
{
    "marks": "pie",
    "from": "<data source name>"
    "x": "<x-field>",
    "r": "<radial-field>",
    "value": "<value-field>"
}
```

**label**

Default: ``x``

The ``x`` entry is a field name of the data source serie
(specified in the ``from`` entry)
or an ``eval`` function which extract the value from the serie.


**value**

Default: ``y``

The ``value`` like the ``label`` field is a field name of the data source serie
or an ``eval`` function which extract the value from the serie.
