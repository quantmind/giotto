        var DT;

        // Set the time-step for each frame
        //
        // This is optional and probably useful during development only
        d3physics.dt = function (x) {
            if (!arguments.length) return DT;
            DT = +x > 0 ? +x : 0;
            return d3physics;
        };
