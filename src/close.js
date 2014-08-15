
    if (typeof define === "function" && define.amd)
        define(d3ext);
    else if (typeof module === "object" && module.exports)
        module.exports = d3ext;
    else
        window.d3ext = d3ext;

}());