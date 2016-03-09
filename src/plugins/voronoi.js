import * as d3_voronoi from 'd3-voronoi';

import {default as gradient} from '../core/gradient';

gradient.voronoi = function () {
    var context = this.getContext(),
        x1 = this.xscale(0),
        x2 = this.xscale(1),
        y1 = this.yscale(0),
        y2 = this.yscale(1),
        voronoi = d3_voronoi.voronoi().extent([[x1, y1], [x2, y2]]);

    context.path(voronoi);
}
