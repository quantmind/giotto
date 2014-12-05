    //
    //  Initaise paper
    function _initPaper (paper, p) {
        //
        // Apply paper type
        g.paper[p.type](paper, p);

        // clear the paper
        paper.clear();
        _reset_axis(paper);

        var width = paper.innerWidth(),
            height = paper.innerHeight(),
            allAxis = [{axis: paper.xAxis(), o: p.xaxis},
                       {axis: paper.yaxis(2).yAxis(), o: p.yaxis2},
                       {axis: paper.yaxis(1).yAxis(), o: p.yaxis}];

        allAxis.forEach(function (a) {
            var axis = a.axis, o = a.o;
            axis.orient(o.position);
            if (o.min !== null && o.max !== null)
                axis.scale().domain([o.min, o.max]);
            else
                o.auto = true;
        });
        //
        if (p.css)
            addCss('#giotto-paper-' + paper.uid(), p.css);
        //
        return paper;
    }

    function _reset_axis (paper) {
        var yaxis = paper.yaxis();
        paper.xAxis().scale().range([0, paper.innerWidth()]);
        paper.yaxis(2).yAxis().scale().range([paper.innerHeight(), 0]);
        paper.yaxis(1).yAxis().scale().range([paper.innerHeight(), 0]);
        return paper.yaxis(yaxis);
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

        var p = extend(true, {}, g.defaults.paper, cfg);

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
        return p;
    }
