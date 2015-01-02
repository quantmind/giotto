title: GiottoJS - Visualization API


A giotto visualization factory is created via the api function ``giotto.createviz``.
The function returns a factory function which can be used to create visualization objects for a given
visualization family. For example, the ``Chart`` visualization is created in the following way:

    d3.giotto.createviz('Chart', {
        // defaults parameters for chart objects
        ...
        },
        //
        // Function to implement the visualization api
        function (chart, opts) {
            ...
        });

Chart object can subsequently be created via the ``Chart`` factory function:

    // without an element
    var mychart1 = d3.giotto.Chart(options);

    // with an HTML element
    var mychart2 = d3.giotto.Chart(element, options);


The visualization base implementation expose most of the functionality needed for
dealing with the [Paper API]

### # viz.paper([createNew]) {#viz-paper}

Returns the [paper][] of the visualization. If ``createView`` is positive a new paper
is created and the old one removed from the DOM.

### # viz.render() {#vizrender}

Render the visualization by calling the [paper.render]($site_url/api/paper#paper-render)
method.

### # viz.resume()

Equivalent to:

    viz.alpha(.1);

This method sets the internal ``alpha`` parameter to 0.1, and then restarts
the timer.


[paper]: $site_url/api/paper
[Paper API]: $site_url/api/paper