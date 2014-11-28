    //
    //  Initaise paper
    function _initPaper (paper, p) {
        g.paper.types[p.type](paper, p);

        var width = p.size[0] - p.margin.left - p.margin.right,
            height = p.size[1] - p.margin.top - p.margin.bottom;

        paper.xAxis().orient(p.xaxis.position).scale().range([0, width]);
        paper.yaxis(2).yAxis().orient(p.yaxis2.position).scale().range([height, 0]);
        paper.yaxis(1).yAxis().orient(p.yaxis.position).scale().range([height, 0]);
        //
        return d3.rebind(paper, p.event, 'on');
    }


    function _newPaperAttr (element, cfg) {
        var width, height;

        if (cfg) {
            width = cfg.width;
            height = cfg.height;
            cfg = pick(cfg, function (value, key) {
                if (g.defaults.paper[key] !== undefined)
                    return value;
            });
        }
        else
            cfg = {};

        var p = extend({}, g.defaults.paper, cfg);

        if (!width) {
            width = getWidth(element);
            if (width)
                p.elwidth = getWidthElement(element);
            else
                width = g.constants.WIDTH;
        }

        if (!height) {
            height = getHeight(element);
            if (height)
                p.elheight = getHeightElement(element);
            else
                height = g.constants.HEIGHT;
        }
        else if (typeof(height) === "string" && height.indexOf('%') === height.length-1) {
            p.height_percentage = 0.01*parseFloat(height);
            height = d3.round(p.height_percentage*width);
        }

        p.size = [width, height];
        p.event = d3.dispatch('refresh');
        return p;
    }
