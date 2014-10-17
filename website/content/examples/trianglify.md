title: Triangligy

# Trianglify

<div data-viz-trianglify data-resize=1 data-height='60%'
data-on-init="trix.trianglifyReady">
<div class="center-block" style="max-width: 400px">
$html_trianglify_form
</div>
</div>

<script>
var trix = {
    redraw: function () {},
    // called back once the vizualization is ready
    trianglifyReady: function () {
        var viz = this;
        trix.redraw = function (data) {
            viz.redraw(data);
        };
    }
};
</script>