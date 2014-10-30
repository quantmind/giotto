title: Triangligy

# Trianglify

<div data-viz-trianglify data-resize=1 data-height='60%'
data-on-init="luxforms.trianglifyReady">
<div class="trianglify-box center-block">
<p>The trianglify extension uses the owesome <a href="http://qrohlf.com/trianglify/"> Trianglify</a> javascript library.</p>
$html_trianglify_form
</div>
</div>

<script>
if (!this.luxforms)
    this.luxforms = {};

luxforms.redraw = function () {};
// called back once the vizualization is ready
luxforms.trianglifyReady = function () {
    var viz = this;
    luxforms.redraw = function (e) {
        e.preventDefault();
        if (this.form.$valid)
            viz.redraw(this.trianglify);
    };
};
</script>