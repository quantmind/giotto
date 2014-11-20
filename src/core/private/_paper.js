    //
    //  Initaise paper
    function _initPaper (paper, p) {

        paper.xAxis().scale().range([0, p.size[0]]);
        paper.yaxis(2).yAxis().scale().range([0, p.size[1]]);
        paper.yaxis(1).yAxis().scale().range([0, p.size[1]]);
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
            height = p.height_percentage*width;
        }

        p.size = [width, height];
        p.event = d3.dispatch('resize');
        return p;
    }
