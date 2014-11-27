title: Triangligy

# Trianglify

<div data-giotto-trianglify data-height='60%' data-on-init="luxforms.trianglifyReady">
<div class="trianglify-box center-block">
<p>The trianglify visualization uses the <a href="http://qrohlf.com/trianglify/"> Trianglify</a> javascript library.</p>
$html_trianglify_form
</div>
</div>

<script>
if (!this.luxforms)
    this.luxforms = {};

luxforms.redraw = function () {};
// called back once the vizualization is ready
luxforms.trianglifyReady = function (viz) {
    luxforms.redraw = function (e) {
        e.preventDefault();
        if (this.form.$valid)
            viz.redraw(this.trianglify);
    };
};
</script>