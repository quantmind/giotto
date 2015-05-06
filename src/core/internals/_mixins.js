    var _idCounter = 0;

    // Base giotto mixin for paper, group and viz
    function giottoMixin (d, opts, plugins) {
        var uid = ++_idCounter;

        opts = g.options(opts, plugins);

        // unique identifier for this object
        d.uid = function () {
            return uid;
        };

        d.event = function (name) {
            return noop;
        };

        //  Fire an event and return the mixin
        d.fire = function (name) {
            var event = d.event(name);
            event.call(d, {type: name});
            return d;
        };

        // returns the options object
        d.options = function (_) {
            if (!arguments.length) return opts;
            opts.extend(_);
            return d;
        };

        d.toString = function () {
            return 'giotto (' + uid + ')';
        };

        return d;
    }
