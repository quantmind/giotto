
    d3.canvas.transition = function(selection, name) {
        var transition = d3.transition(selection, name);

        return transition;
    };