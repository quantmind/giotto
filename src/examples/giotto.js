
    g.Giotto = g.Viz.extend({

        d3build: function () {
            var self = this,
                paper = this.paper();

            paper.group().attr('class', 'containers');
            paper.xAxis().scale().domain([-1, 1]);
            paper.yAxis().scale().domain([-1, 1]);
            paper.rect(-1, -1, 2, 2).attr('fill', 'none');
            paper.circle(0, 0, 1).attr('fill', 'none');
            paper.root().group().attr('class', 'random');
            var anim = {total: 0, circle: 0, frame: 0};
            d3.timer(function () {
                return self._step(anim);
            });
        },

        _step: function (anim) {
            var i = 0, self = this, x, y, r2, pi;
            while (i < 4) {
                ++i;
                x = 2*(Math.random() - 0.5);
                y = 2*(Math.random() - 0.5);
                r2 = x*x + y*y;
                anim.total += 1;
                if (r2 <= 1)
                    anim.circle += 1;

                pi = 4*anim.circle/anim.total;

                this.paper().circle(x, y, 0.02);
            }
            d3.timer(function () {
                return self._step(anim);
            });
            return true;
        }
    });
