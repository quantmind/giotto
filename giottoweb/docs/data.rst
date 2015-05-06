
Data Utilities
===================


Serie Data
----------------------

.. js:function:: giotto.data.serie(data, [idname])

   Create a new :js:data:`serie` data object. Usage::

       var data = [{name: 'foo', year, 2013, value: 5675},
                   {name: 'gee', year, 2013, value: 3452545},
                    ...];
       var g = giotto.data.multi(data, 'name');

   :param array data: Array of objects containing data
   :param string idname: Optional string which can be used to retrieve data by
      via a spcific value of the objects, rather than the array index.
   :returns: A new :js:func:`multi` function


.. js:data:: serie

   .. js:function:: serie.x([x])

      Gets or sets the x-accessor to the specified function or constant. If
      ``x`` is specified set the x-accessor and return the :js:data:`serie`.
      If ``x`` is not specified return the current x-accessor.

   .. js:function:: serie.y([y])

      Gets or sets the y-accessor to the specified function or constant. If
      ``y`` is specified set the y-accessor and return the :js:data:`serie`.
      If ``y`` is not specified return the current x-accessor.

   .. js:function:: serie.label([label])

      Gets or sets the label-accessor to the specified function or constant. If
      ``label`` is specified set the label-accessor and return the :js:data:`serie`.
      If ``label`` is not specified return the current label-accessor.


Geometric Data
-------------------

.. js:function:: giotto.data.geo(features)

   Create a new :js:func:`geo` data handler. Usage::

       var g = giotto.data.geo(features);

   :param array features: Array of geometric features to render
   :returns: A new geo function


.. js:function:: geo(geodata)

   Bind ``geodata`` to the geometric features available in this
   geometric data handler.

   :param array geodata: an array data to bind to geometric features
   :return: the

   .. js:function:: geo.value([value])

   .. js:function:: geo.data([data])

      Set or get data associated with the geometric features of this handler
      When no arguments are available return the current data, otherwise set
      the new data as return :js:func:`geo`.