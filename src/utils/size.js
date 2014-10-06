
    function getWidth (element) {
        return getParentRectValue(element, 'width');
    }


    function getHeight (element) {
        return getParentRectValue(element, 'height');
    }

    function getParentRectValue (element, key) {
        var parent = element.node(),
            r, v;
        while (parent && parent.tagName !== 'BODY') {
            v = parent.getBoundingClientRect()[key];
            if (v)
                break;
            parent = parent.parentNode;
        }
        return v;
    }

    function generateResize () {
        var resizeFunctions = [];
        function callResizeFunctions() {
            resizeFunctions.forEach(function (f) {
                f();
            });
        }
        callResizeFunctions.add = function (f) {
            resizeFunctions.push(f);
        };
        return callResizeFunctions;
    }

